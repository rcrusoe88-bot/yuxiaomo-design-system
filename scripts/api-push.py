#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
api-push.py — 当 git 的 HTTPS 通道不可用（本地代理 502）时，用 GitHub Git Data API
把**本地已有的某个提交**原样推上去。

设计要点：
1. blob 内容一律从 git 对象库读原始字节（`git cat-file blob <sha>:<path>`），
   绝不用工作区文件 —— 工作区是 CRLF，提交里存的是 LF，直接用会导致 sha 不一致。
2. 完整复刻 author / committer 的姓名、邮箱、时间戳，使 API 生成的 commit sha
   与本地 commit sha **完全一致**，从而不给后续 git pull/push 留下分叉。
3. base_tree 用远端当前 HEAD 的 tree，只改动 diff 里列出的文件。

用法：python api-push.py <commit-sha>
"""
import base64
import json
import subprocess
import sys
import urllib.error
import urllib.request
from datetime import datetime, timedelta, timezone

REPO = 'rcrusoe88-bot/yuxiaomo-design-system'
API = 'https://api.github.com'


def git(*args, binary=False):
    r = subprocess.run(['git', *args], capture_output=True)
    if r.returncode != 0:
        raise SystemExit(f'git {" ".join(args)} 失败: {r.stderr.decode("utf-8", "replace")[:300]}')
    return r.stdout if binary else r.stdout.decode('utf-8')


def token():
    r = subprocess.run(['gh', 'auth', 'token'], capture_output=True, text=True)
    if r.returncode != 0 or not r.stdout.strip():
        raise SystemExit('拿不到 gh token（先跑 gh auth login）')
    return r.stdout.strip()


TOKEN = token()


def api(method, path, payload=None):
    data = json.dumps(payload).encode('utf-8') if payload is not None else None
    req = urllib.request.Request(f'{API}{path}', data=data, method=method)
    req.add_header('Authorization', f'Bearer {TOKEN}')
    req.add_header('Accept', 'application/vnd.github+json')
    req.add_header('X-GitHub-Api-Version', '2022-11-28')
    if data:
        req.add_header('Content-Type', 'application/json')
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            body = resp.read().decode('utf-8')
            return json.loads(body) if body else {}
    except urllib.error.HTTPError as e:
        raise SystemExit(f'{method} {path} -> {e.code}\n{e.read().decode("utf-8", "replace")[:800]}')


def iso(ts, offset_seconds):
    """把 git 的 unix 时间戳 + 时区偏移转成 GitHub 要的 ISO8601。"""
    tz = timezone(timedelta(seconds=offset_seconds))
    return datetime.fromtimestamp(ts, tz).strftime('%Y-%m-%dT%H:%M:%S+08:00')


def main():
    sha = sys.argv[1] if len(sys.argv) > 1 else 'HEAD'
    sha = git('rev-parse', sha).strip()

    raw = git('cat-file', '-p', sha)
    header, _, message = raw.partition('\n\n')
    meta = {}
    for ln in header.split('\n'):
        k, _, v = ln.partition(' ')
        meta.setdefault(k, []).append(v)
    tree = meta['tree'][0]
    parent = meta['parent'][0]

    # author/committer: "Name <email> <unixts> <+0800>"
    def parse_person(s):
        # 从右往左切两次：得到 "Name <email>" / unixts / tz
        head, ts, tz = s.rsplit(' ', 2)
        name, _, em = head.partition(' <')
        return {
            'name': name.strip(),
            'email': em.rstrip('>').strip(),
            'ts': int(ts),
            'tz': tz,
        }

    a = parse_person(meta['author'][0])
    c = parse_person(meta['committer'][0])

    def tz_seconds(s):
        sign = -1 if s[0] == '-' else 1
        return sign * (int(s[1:3]) * 3600 + int(s[3:5]) * 60)

    print(f'本地提交 {sha[:7]}  tree={tree[:7]}  parent={parent[:7]}')

    # 0. 远端 HEAD 必须就是我们的 parent，否则 base_tree 会错
    ref = api('GET', f'/repos/{REPO}/git/ref/heads/main')
    remote_sha = ref['object']['sha']
    print(f'远端 main = {remote_sha[:7]}')
    if remote_sha == sha:
        print('远端已经是这个提交，无需推送。')
        return
    if remote_sha != parent:
        raise SystemExit(f'远端 HEAD({remote_sha[:7]}) 与本地父提交({parent[:7]}) 不一致，先人工确认。')

    # 1. 改动文件清单
    changed = git('diff', '--name-only', parent, sha).strip().split('\n')
    changed = [f for f in changed if f]
    print(f'待上传 {len(changed)} 个文件')

    # 2. 逐个建 blob（从 git 对象库取原始字节）
    entries = []
    for path in changed:
        blob = git('cat-file', 'blob', f'{sha}:{path}', binary=True)
        content_b64 = base64.b64encode(blob).decode('ascii')
        res = api('POST', f'/repos/{REPO}/git/blobs',
                  {'content': content_b64, 'encoding': 'base64'})
        entries.append({'path': path, 'mode': '100644', 'type': 'blob', 'sha': res['sha']})
        print(f'  blob {res["sha"][:8]}  {path}  ({len(blob)} B)')

    # 3. 新 tree（base_tree = 父提交的远端 tree）
    new_tree = api('POST', f'/repos/{REPO}/git/trees',
                   {'base_tree': git('rev-parse', f'{parent}^{{tree}}').strip(),
                    'tree': entries})
    print(f'新 tree = {new_tree["sha"][:8]}  (本地 tree = {tree[:8]})')

    # 4. 新 commit（完整复刻身份与时间，力求 sha 一致）
    person_a = {'name': a['name'], 'email': a['email'], 'date': iso(a['ts'], tz_seconds(a['tz']))}
    person_c = {'name': c['name'], 'email': c['email'], 'date': iso(c['ts'], tz_seconds(c['tz']))}
    commit = api('POST', f'/repos/{REPO}/git/commits',
                 {'message': message, 'tree': new_tree['sha'], 'parents': [parent],
                  'author': person_a, 'committer': person_c})
    print(f'新 commit = {commit["sha"][:7]}  (本地 {sha[:7]})  '
          f'{"★ sha 一致" if commit["sha"] == sha else "⚠ sha 不同"}')

    # 5. 更新分支引用
    api('PATCH', f'/repos/{REPO}/git/refs/heads/main',
        {'sha': commit['sha'], 'force': False})
    print('已更新 refs/heads/main')

    # 6. 让本地 remote-tracking 跟上（git fetch 走不通，直接手写 ref）
    git('update-ref', 'refs/remotes/origin/main', commit['sha'])
    print(f'本地 refs/remotes/origin/main -> {commit["sha"][:7]}')
    print('\n完成。')


if __name__ == '__main__':
    main()
