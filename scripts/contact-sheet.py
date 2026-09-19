# 拼对比联络表：把同一页在多个配色状态下的截图并排成一张图（人眼巡检 / 给用户看对比用）
#
# 为什么需要它：本库是「一套语言 × 多套主题」，同一页在 10 个主题下的差异**只能靠眼睛同时看到**才判断得了 ——
#   逐张翻 13 页 × 3 状态 = 39 张图，人根本比不出来。拼成一张就一眼能看出"哪一块没跟着换色"。
# 依赖：托管 venv 的 Pillow（PIL 12.x）。
#
# 用法：python scripts/contact-sheet.py <out.png> "<label>|<png>" ["<label>|<png>" ...]
#   例：python scripts/contact-sheet.py preview/_cmp.png \
#         "来源模式|preview/p05.png" "?mce=mce-qms|preview/qms/p05.png" "品牌模式|preview/yuantai/p05.png"
#   ⚠ label 里可以带 '='（如 ?mce=mce-qms），所以**用 | 分隔**而不是 =（先前的 = 分隔会撞车）。
import sys
from PIL import Image, ImageDraw, ImageFont

OUT = sys.argv[1]
PAIRS = []
for a in sys.argv[2:]:
    label, _, p = a.rpartition('|')   # label|path —— 用 | 分隔，避免 label 里的 = 撞车
    PAIRS.append((label, p))

GAP, PAD, TOP = 18, 20, 46
imgs = [Image.open(p).convert('RGB') for _, p in PAIRS]
W = sum(i.width for i in imgs) + GAP * (len(imgs) - 1) + PAD * 2
H = max(i.height for i in imgs) + TOP + PAD
sheet = Image.new('RGB', (W, H), 'white')
d = ImageDraw.Draw(sheet)
try:
    font = ImageFont.truetype('C:/Windows/Fonts/msyhbd.ttc', 22)
except Exception:
    font = ImageFont.load_default()
x = PAD
for (label, _), im in zip(PAIRS, imgs):
    sheet.paste(im, (x, TOP))
    d.text((x, 14), label, fill='#111111', font=font)
    x += im.width + GAP
sheet.save(OUT)
print('saved', OUT, sheet.size)
