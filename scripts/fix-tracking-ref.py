#!/usr/bin/env python
"""重建 .git/refs/remotes/origin/main —— 本机 git 写不进这个引用。

现象（本机反复复现）：
  - `git push` / `git fetch` 都**报成功**（`main -> main`、`[new branch] main -> origin/main`），
  - 但 `.git/refs/remotes/origin/main` 不落盘，**还会把手工建好的引用删掉**，
  - 于是 `git status` 永远显示 `## main...origin/main [gone]`，
    且 `git rev-parse origin/main` 报 unknown revision。

根因未定位到 git 内部（疑似 ref 锁文件的 rename 回滚；本机 `.git/refs/remotes/` 目录存在却为空，
`packed-refs` 也不存在）。按"仅诊断、不改系统"原则**不去动 git 配置**，改为每次网络操作后重建。

用法：
  python scripts/fix-tracking-ref.py            # 以本地 HEAD 作为 origin/main
  python scripts/fix-tracking-ref.py <sha>      # 指定 sha
  python scripts/fix-tracking-ref.py --verify   # 先用 gh api 核对远端真实 sha，再落盘（推荐）
"""
import os
import subprocess
import sys
import time

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GITDIR = os.path.join(REPO, '.git')
WHO = 'rcrusoe88-bot <rcrusoe88-bot@users.noreply.github.com>'
SLUG = 'rcrusoe88-bot/yuxiaomo-design-system'


def sh(args):
    r = subprocess.run(args, cwd=REPO, capture_output=True, text=True)
    return r.returncode, (r.stdout or '').strip(), (r.stderr or '').strip()


def remote_sha_via_api():
    """走 gh api 读远端 main 的真实 sha（本机唯一稳定放行的通路是 api.github.com）。"""
    code, out, err = sh(['gh', 'api', f'/repos/{SLUG}/git/ref/heads/main'])
    if code != 0:
        return None, err or out
    import json
    try:
        return json.loads(out)['object']['sha'], None
    except Exception as e:                                  # noqa: BLE001
        return None, f'解析失败: {e}'


def main():
    argv = [a for a in sys.argv[1:]]
    verify = '--verify' in argv
    argv = [a for a in argv if not a.startswith('--')]
    sha = argv[0] if argv else None

    if verify and not sha:
        rsha, err = remote_sha_via_api()
        if rsha:
            sha = rsha
            print(f'远端真实 sha（gh api 核实）= {sha}')
        else:
            print(f'! 无法读取远端 sha：{err}')
            print('  回退为使用本地 HEAD（未与远端核对，请自行确认）')

    if not sha:
        code, out, err = sh(['git', 'rev-parse', 'HEAD'])
        if code != 0:
            print(f'! 取不到本地 HEAD：{err}')
            return 1
        sha = out

    if len(sha) != 40:
        print(f'! sha 长度不对（{len(sha)}），应为 40：{sha}')
        return 1

    # 1) 跟踪引用
    ref_dir = os.path.join(GITDIR, 'refs', 'remotes', 'origin')
    os.makedirs(ref_dir, exist_ok=True)
    with open(os.path.join(ref_dir, 'main'), 'w', encoding='ascii', newline='\n') as f:
        f.write(sha + '\n')

    # 2) reflog（core.logallrefupdates=true 时 git 也想要它）
    log_dir = os.path.join(GITDIR, 'logs', 'refs', 'remotes', 'origin')
    os.makedirs(log_dir, exist_ok=True)
    line = ('0' * 40 + ' ' + sha + ' ' + WHO + ' ' + str(int(time.time())) + ' '
            + time.strftime('%z') + '\tfetch origin main: created\n')
    with open(os.path.join(log_dir, 'main'), 'w', encoding='ascii', newline='\n') as f:
        f.write(line)

    print(f'wrote .git/refs/remotes/origin/main = {sha}')

    # 3) 自检
    code, out, err = sh(['git', 'rev-parse', 'origin/main'])
    ok_ref = (code == 0 and out == sha)
    code2, out2, _ = sh(['git', 'rev-list', '--left-right', '--count', 'main...origin/main'])
    print(f'  git rev-parse origin/main -> {"✓ " + out if ok_ref else "✗ " + err}')
    print(f'  领先/落后（左=本地 右=远端）-> {out2 if code2 == 0 else "(仍不可用)"}')
    code3, out3, _ = sh(['git', 'status', '-sb'])
    print(f'  git status -sb -> {out3.splitlines()[0] if out3 else "(空)"}')
    return 0 if ok_ref else 1


if __name__ == '__main__':
    sys.exit(main())
