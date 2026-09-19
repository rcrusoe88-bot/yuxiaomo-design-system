# -*- coding: utf-8 -*-
"""
一次性迁移：给 src/lib/*.jsx 里每个 @ds-contract 块补两个来源字段。

  src:     来源脉（genscript / mce / neutral）—— R23「配色随来源」的粗粒度依据
  manual:  锁定的具体册（仅当 hue 点明某一册时写入）—— 细粒度依据，
           例如 ProductCardGrid 的 hue 是「MCE PROTAC 手册 深紫 #5A3A7D」，
           它就必须用 mce-protac 渲染，而不是 MCE 脉里第一册的蓝。

为什么需要它们：契约里早就写了「MCE 化合物库手册 深蓝 #2C6BAA」这样的来源说明，
但那是**给人读的散文**，机器读不出来 → 陈列页只能全上默认蓝（组件全变蓝的病根）。

用法：
  python scripts/contract-src.py            # dry-run，只打印映射
  python scripts/contract-src.py --apply    # 写入（幂等：已有字段的不再插）
"""
import io
import os
import re
import sys
from collections import Counter

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LIB = os.path.join(BASE, 'src', 'lib')

# hue 文本里没点名来源脉的，在这里显式裁决（每条都要给出理由）
OVERRIDE = {
    # 形态变体继承母体的来源脉 —— 不按变体自己的外观猜。
    # BlockTitle 的 hue 是「GenScript 胶囊型 → 直角变体」＝ GenScript 脉；
    # 故其轻量变体 OutlineTitle 也属 GenScript，而不是 MCE。
    'BlockTitle 轻量变体 · 随主题（描边+主色字，不加新色）': 'genscript',
    'GenScript 胶囊型 → 直角变体 · 随主题': 'genscript',
}

FOLDS = ('随册', '多册', '五册', '各册')
MANUAL_RULES = [
    ('PROTAC', 'mce-protac'),
    ('质量管理体系', 'mce-qms'),
    ('qms', 'mce-qms'),
    ('化合物库手册', 'mce-library'),
    ('library', 'mce-library'),
    ('药物发现', 'mce-discovery'),
    ('生化试剂', 'mce-biochem'),
]

FIELD_COL = 11  # 契约块里所有字段的值都从第 11 列开始（intent:/evidence:/src: 对齐用）


def derive(hue):
    if hue in OVERRIDE:
        return OVERRIDE[hue], 'override'
    if 'MCE' in hue:
        return 'mce', 'hue 点名 MCE'
    if 'GenScript' in hue:
        return 'genscript', 'hue 点名 GenScript'
    if '中性' in hue:
        return 'neutral', 'hue 声明中性无相'
    return None, '无法判定'


def derive_manual(hue, src):
    """具体册的锁定规则：hue 点明某一册 → 陈列页必须用那一册的主色渲染。

    排除条款优先：说了「随册 / 多册 / 五册 / 各册」的，说明它跨册复用、不绑定某一册，
    不能因为括号里举了 library 当例子就被误锁到 library。
    """
    if src != 'mce':
        return None, '非 MCE 脉（GenScript 各册结构同构，随选册）'
    if any(k in hue for k in FOLDS):
        return None, 'hue 明示跨册复用 → 不锁定'
    for kw, key in MANUAL_RULES:
        if kw in hue:
            return key, 'hue 点名 %s' % kw
    return None, 'MCE 脉但未点名具体册'


def patch_file(path, apply):
    lines = io.open(path, 'rb').read().decode('utf-8').splitlines(keepends=True)

    in_contract = False
    inserts = {}      # 行号 -> [要插在该行之后的文本]
    records = []      # (组件名, src, manual, hue)
    pending_hue = None
    has_src = has_manual = False
    skipped = 0

    for i, ln in enumerate(lines):
        if '@ds-contract' in ln:
            in_contract, pending_hue, has_src, has_manual = True, None, False, False
            continue
        if in_contract and '*/' in ln:
            in_contract = False
            continue  # 不清 pending_hue：契约块结束，但要留着它去配下面的 export
        if in_contract:
            if re.match(r'^\s*\*\s*src:', ln):
                has_src = True
                continue
            if re.match(r'^\s*\*\s*manual:', ln):
                has_manual = True
                continue
            m = re.match(r'^\s*\*\s*hue:\s*(.*?)\s*$', ln)
            if m:
                pending_hue = (i, m.group(1))
            continue
        m = re.match(r'^export function (\w+)\s*\(', ln)
        if m and pending_hue:
            idx, hue = pending_hue
            src, _ = derive(hue)
            man, _ = derive_manual(hue, src)
            records.append((m.group(1), src, man, hue))
            if has_src or has_manual:
                skipped += 1
            elif src:
                nl = '\n' if ln.endswith('\n') else ''
                box = inserts.setdefault(idx, [])
                box.append(' * ' + 'src:'.ljust(FIELD_COL) + src + nl)
                if man:
                    box.append(' * ' + 'manual:'.ljust(FIELD_COL) + man + nl)
            pending_hue = None

    if apply and inserts:
        out = []
        for i, ln in enumerate(lines):
            out.append(ln)
            out.extend(inserts.get(i, []))
        io.open(path, 'wb').write(''.join(out).encode('utf-8'))
    return records, skipped


def check_order(path):
    """自检：字段序必须是 hue → src → [manual] → evidence，且 src 只能出现在 _contract 之外。

    坑记：插入位置是「lines[idx] 之后」，而写回循环是「先输出 lines[i]，再插新行」——
    所以记录 (idx, ...) 而不是 (idx+1, ...)。写成 idx+1 会让字段整体下移一行
    （src 跑到 evidence 之后）。解析器按字段名读，所以不报错、只是顺序乱 ——
    正是那种"看不出错、但已经错了"的缺陷，故本脚本自带这条断言。
    """
    lines = io.open(path, encoding='utf-8').read().splitlines()
    base = os.path.basename(path)
    tot = ok = 0
    bad = []
    for i, ln in enumerate(lines):
        if re.match(r'^\s*\*\s*src:', ln):
            tot += 1
            good = bool(re.match(r'^\s*\*\s*hue:', lines[i - 1])) and \
                bool(re.match(r'^\s*\*\s*(manual|evidence):', lines[i + 1]))
            if good:
                ok += 1
            else:
                bad.append((base, i + 1))
        elif re.match(r'^\s*\*\s*manual:', ln):
            if not re.match(r'^\s*\*\s*evidence:', lines[i + 1]):
                bad.append((base, i + 1, 'manual 后不是 evidence'))
    return tot, ok, bad


def main():
    apply = '--apply' in sys.argv
    recs, skipped = [], 0
    for f in sorted(os.listdir(LIB)):
        if f.endswith('.jsx'):
            r, s = patch_file(os.path.join(LIB, f), apply)
            recs += r
            skipped += s

    print('=' * 100)
    print('%s：扫描到 %d 个组件契约块%s' % ('写入' if apply else 'DRY-RUN', len(recs),
                                        '（幂等跳过 %d 个已有字段的）' % skipped if skipped else ''))
    print('=' * 100)
    print('来源脉分布：', dict(Counter(r[1] for r in recs)))
    print('锁定具体册：%d 个 — %s' % (sum(1 for r in recs if r[2]), dict(Counter(r[2] for r in recs if r[2]))))
    print()
    print('%-4s %-11s %-15s %-24s %s' % ('#', 'src', 'manual', '组件', 'hue 原文'))
    print('-' * 100)
    for n, (name, src, man, hue) in enumerate(recs, 1):
        print('%-4d %-11s %-15s %-24s %s' % (n, src or '!! 未判定', man or '—', name, hue[:44]))
    print('-' * 100)
    bad = [r for r in recs if not r[1]]
    if bad:
        print('\n需要人工裁决（%d 条）—— 请补进 OVERRIDE：' % len(bad))
        for name, _, _, hue in bad:
            print('   · %s :: %s' % (name, hue))
        sys.exit(1)
    print('\n全部 %d 个组件都判定了来源脉。' % len(recs))

    if apply:
        tot = ok = 0
        badpos = []
        for f in sorted(os.listdir(LIB)):
            if f.endswith('.jsx'):
                t, o, b = check_order(os.path.join(LIB, f))
                tot += t; ok += o; badpos += b
        print()
        print('自检 · 字段位置：src 共 %d 个，位置正确的 %d 个' % (tot, ok))
        if badpos:
            print('  ✗ 位置不对：%s' % badpos[:8])
            sys.exit(1)
        print('  ✓ 全部满足 hue → src → [manual] → evidence')


if __name__ == '__main__':
    main()
