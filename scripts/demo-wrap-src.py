# -*- coding: utf-8 -*-
"""
给 AppTaxonomy.jsx 的每个演示单元套上 <SrcBlock of="组件">。

为什么要自动化：演示页一共 32 个单元，每个单元都是「<RuleTitle en="组件名"> 开头，
到下一个 RuleTitle（或 </Page>）结束」这种规整结构。手改 32 处 = 32 次可能打错，
而且以后加一个演示单元就会漏掉包装 → 那一个组件又变回默认蓝（正是本版要修的病）。

单元里没有 <DemoTag> 的，补一个自闭合的 —— DemoTag 会从上下文里自动带上「来源」徽标，
不补就没有来源信息可看。

用法：
  python scripts/demo-wrap-src.py            # dry-run
  python scripts/demo-wrap-src.py --apply
"""
import io
import json
import os
import re
import sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP = os.path.join(BASE, 'src', 'demo', 'AppTaxonomy.jsx')
REG = os.path.join(BASE, 'registry.json')

INDENT = ' ' * 6

def main():
    apply = '--apply' in sys.argv
    known = {c['name'] for c in json.load(io.open(REG, encoding='utf-8'))['components']}
    src_of = {c['name']: c['contract'].get('src', '') for c in json.load(io.open(REG, encoding='utf-8'))['components']}

    text = io.open(APP, encoding='utf-8').read()
    lines = text.splitlines(keepends=True)

    starts = [i for i, ln in enumerate(lines) if re.match(r'^\s*<RuleTitle\s+en="', ln)]
    closes = [i for i, ln in enumerate(lines) if re.match(r'^\s*</Page>', ln)]

    before, after = {}, {}
    plan, unresolved, no_tag, done = [], [], [], 0

    for k, s in enumerate(starts):
        # 幂等保护：上一行已经是 <SrcBlock> 说明这个单元包过了 —— 再套一层会变成嵌套两重，
        # 组件会拿到错误的主题上下文（而且多出来的徽标会把这页顶溢出）。
        if s > 0 and lines[s - 1].strip().startswith('<SrcBlock'):
            done += 1
            continue
        nxt = [c for c in closes if c > s] or [None]
        end = (starts[k + 1] - 1) if (k + 1 < len(starts) and starts[k + 1] < (nxt[0] or 10 ** 9)) else (nxt[0] - 1)
        body = ''.join(lines[s:end + 1])

        en = re.search(r'en="([^"]*)"', lines[s]).group(1)
        token = re.split(r'\s*[/·（]\s*', en)[0].strip()
        if token not in known:
            unresolved.append((token, en))
            continue

        before.setdefault(s, []).append(INDENT + '<SrcBlock of="%s">' % token + ('\n' if lines[s].endswith('\n') else ''))
        after.setdefault(end, []).append(INDENT + '</SrcBlock>' + ('\n' if lines[end].endswith('\n') else ''))
        if '<DemoTag' not in body:
            no_tag.append(token)
            after.setdefault(s, []).append(INDENT + '<DemoTag />' + ('\n' if lines[s].endswith('\n') else ''))
        plan.append((k + 1, token, src_of.get(token, ''), lines[s].strip()[:60]))

    print('=' * 92)
    print('%s：%d 个 <RuleTitle>，成功配对 %d 个演示单元%s'
          % ('写入' if apply else 'DRY-RUN', len(starts), len(plan),
             '（跳过 %d 个已包装的）' % done if done else ''))
    print('=' * 92)
    print('%-4s %-26s %-11s %s' % ('#', '组件', '来源脉', 'RuleTitle 行'))
    print('-' * 92)
    for n, (idx, token, src, raw) in enumerate(plan, 1):
        print('%-4d %-26s %-11s %s' % (n, token, src, raw))
    print('-' * 92)
    print('缺 DemoTag、需补一个的单元：%d 个 %s' % (len(no_tag), no_tag if no_tag else ''))
    if unresolved:
        print('\n✗ 无法配对（RuleTitle 的 en 不是组件名）：')
        for t, e in unresolved:
            print('   · %r ← en="%s"' % (t, e))
        sys.exit(1)
    print('✓ 全部 %d 个单元都配到了真实组件名' % len(plan))

    if apply:
        out = []
        for i, ln in enumerate(lines):
            out += before.get(i, [])
            out.append(ln)
            out += after.get(i, [])
        io.open(APP, 'wb').write(''.join(out).encode('utf-8'))
        print('写入完成：', os.path.basename(APP))

        # 自检：<SrcBlock 与 </SrcBlock> 必须成对
        t = io.open(APP, encoding='utf-8').read()
        o = len(re.findall(r'<SrcBlock\b', t))
        c = len(re.findall(r'</SrcBlock>', t))
        print('自检 · 配对：<SrcBlock> %d 个 / </SrcBlock> %d 个 → %s' % (o, c, '✓' if o == c else '✗ 不平衡'))
        if o != c:
            sys.exit(1)

if __name__ == '__main__':
    main()
