"""Create self-contained SVG review boards from existing repository art.

Static design studies only. No site runtime dependency and no source image edits.
"""
from base64 import b64encode
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).resolve().parent


def art(name):
    data = (ROOT / 'src' / 'assets' / name).read_bytes()
    return 'data:image/jpeg;base64,' + b64encode(data).decode()


def rect(x, y, w, h, fill):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{fill}"/>'


def image(name, x, y, w, h, focus='xMidYMid'):
    return f'<image xlink:href="{art(name)}" x="{x}" y="{y}" width="{w}" height="{h}" preserveAspectRatio="{focus} slice"/>'


def label(value, x, y, color='#c77c55', size=13):
    return f'<text x="{x}" y="{y}" font-family="Arial,sans-serif" font-size="{size}" font-weight="700" letter-spacing="2.2" fill="{color}">{escape(value.upper())}</text>'


def title(lines, x, y, size, color, step=None):
    step = step or size * .99
    return ''.join(f'<text x="{x}" y="{y + i * step}" font-family="Georgia,serif" font-size="{size}" letter-spacing="-3" fill="{color}">{escape(line)}</text>' for i, line in enumerate(lines))


def paragraph(lines, x, y, color, size=20, step=29):
    return ''.join(f'<text x="{x}" y="{y + i * step}" font-family="Georgia,serif" font-size="{size}" fill="{color}">{escape(line)}</text>' for i, line in enumerate(lines))


def mast(w):
    right = w - 48
    subline = 'An Infinity Enterprises publication' if w > 600 else 'Infinity Enterprises'
    return rect(0, 0, w, 76, '#08101a') + title(['SOVRANO@Infini'], 48 if w > 600 else 22, 40, 28 if w > 600 else 21, '#f4f1eb') + label(subline, 48 if w > 600 else 22, 60, '#d8c39a', 8) + f'<rect x="{right - (150 if w > 600 else 91)}" y="22" width="{130 if w > 600 else 76}" height="37" rx="18" fill="none" stroke="#f4f1eb"/>' + label('Contents', right - (132 if w > 600 else 80), 46, '#f4f1eb', 10 if w > 600 else 8)


def save(name, w, h, parts):
    body = ''.join(parts)
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="{w}" height="{h}" viewBox="0 0 {w} {h}"><defs><linearGradient id="shade" x2="0" y2="1"><stop stop-color="#07111d" stop-opacity=".12"/><stop offset="1" stop-color="#07111d" stop-opacity=".98"/></linearGradient><linearGradient id="side"><stop stop-color="#07111d" stop-opacity=".96"/><stop offset="1" stop-color="#07111d" stop-opacity=".08"/></linearGradient></defs>{body}</svg>'
    (OUT / name).write_text(svg)


# A: issue cover, then unequal editorial picks.
w, h = 1600, 900
save('a-desktop.svg', w, h, [
    rect(0, 0, w, h, '#f4f1eb'), mast(w),
    image('cover.jpg', 0, 76, w, 590), rect(0, 76, w, 590, 'url(#side)'),
    label('A  /  THE CINEMATIC ISSUE', 72, 128, '#efb28b'),
    label('THE CURRENT ISSUE  •  COVER STORY', 72, 242, '#efb28b'),
    title(['Ideas worth', 'staying for.'], 72, 337, 91, '#fff', 93),
    paragraph(['One arresting opening. Then a magazine that unfolds',
               'by editorial importance, not identical cards.'], 74, 520, '#f4f1eb', 23, 32),
    label('ENTER THE ISSUE  ↗', 74, 624, '#fff'),
    label('SELECTED BY THE EDITORS', 72, 710),
    title(['Editorial Picks'], 72, 763, 50, '#102638'),
    image('hero.jpg', 72, 786, 872, 114), image('food.jpg', 968, 786, 560, 114),
])
w, h = 390, 900
save('a-phone.svg', w, h, [rect(0, 0, w, h, '#f4f1eb'), mast(w), image('cover.jpg', 0, 76, w, 555, 'xMidYMid'), rect(0, 76, w, 555, 'url(#shade)'), label('A  /  CINEMATIC ISSUE', 22, 113, '#efb28b', 10), label('CURRENT ISSUE', 22, 388, '#efb28b', 10), title(['Ideas worth', 'staying for.'], 22, 451, 48, '#fff', 53), paragraph(['One story opens the issue.', 'The rest unfolds by rank.'], 22, 555, '#fff', 17, 25), label('ENTER THE ISSUE  ↗', 22, 612, '#fff', 10), label('EDITORIAL PICKS', 22, 690, '#8a4526', 10), title(['Stories to stay for'], 22, 731, 31, '#102638'), image('hero.jpg', 22, 752, 346, 131)])

# Major Feature: a portrait magazine cover and adjacent editorial introduction.
# This is the lead section after the opening, not a replacement for an article.
w, h = 1600, 900
save('feature-desktop.svg', w, h, [
    rect(0, 0, w, h, '#f4f1eb'), mast(w),
    label('THE CURRENT ISSUE  /  THE MAJOR FEATURE', 72, 126, '#8a4526'),
    rect(72, 156, 570, 700, '#9b542f'),
    image('cover.jpg', 86, 170, 542, 672, 'xMidYMid'),
    rect(86, 170, 542, 672, 'url(#shade)'),
    title(['SOVRANO'], 116, 250, 68, '#fff'),
    label('AN INFINITY ENTERPRISES PUBLICATION', 116, 279, '#f4f1eb', 10),
    label('THE SEPTEMBER ISSUE', 116, 672, '#efb28b'),
    title(['Who governs', 'the reasoning?'], 116, 742, 43, '#fff', 48),
    label('01  /  THE FEATURE', 728, 269, '#8a4526'),
    title(['A cover story', 'with a point', 'of view.'], 728, 365, 75, '#102638', 81),
    paragraph(['The cover arrests the eye. The introduction opens',
               'the argument. The full story earns its own page.'], 732, 647, '#4a5962', 24, 36),
    rect(728, 724, 287, 57, '#102638'), label('READ THE FEATURE  ↗', 754, 759, '#fff', 12),
    label('EDITORIAL PICKS FOLLOW BELOW  ↓', 728, 831, '#8a4526', 12),
])
w, h = 390, 900
save('feature-phone.svg', w, h, [
    rect(0, 0, w, h, '#f4f1eb'), mast(w),
    label('THE CURRENT ISSUE  /  MAJOR FEATURE', 22, 113, '#8a4526', 10),
    rect(22, 138, 346, 503, '#9b542f'),
    image('cover.jpg', 31, 147, 328, 485, 'xMidYMid'),
    rect(31, 147, 328, 485, 'url(#shade)'),
    title(['SOVRANO'], 47, 206, 38, '#fff'),
    label('INFINITY ENTERPRISES', 47, 229, '#fff', 8),
    label('THE SEPTEMBER ISSUE', 47, 526, '#efb28b', 9),
    title(['Who governs', 'the reasoning?'], 47, 575, 29, '#fff', 33),
    label('01  /  THE FEATURE', 22, 691, '#8a4526', 10),
    title(['A cover story', 'with a point', 'of view.'], 22, 744, 35, '#102638', 39),
    label('READ THE FEATURE  ↗', 22, 882, '#8a4526', 10),
])

# B: dark gallery progression.
w, h = 1600, 900
save('b-desktop.svg', w, h, [
    rect(0, 0, w, h, '#10151a'), mast(w),
    rect(0, 76, 690, 555, '#10151a'), image('motor-1.jpg', 690, 76, 910, 555),
    rect(690, 76, 235, 555, 'url(#side)'),
    label('B  /  GALLERY CHAPTERS', 72, 128, '#efb28b'),
    label('MOTOR  •  OBJECTS OF MOTION', 72, 235, '#efb28b'),
    title(['First, the', 'feeling.'], 72, 340, 86, '#fff', 92),
    paragraph(['Detail. Silhouette. Then the reveal.', 'Each scroll changes what you know.'], 72, 520, '#d2c8c1', 22),
    label('EXPLORE THE STORY  ↘', 72, 600, '#fff'),
    image('motor-2.jpg', 0, 631, 800, 269), rect(800, 631, 800, 269, '#9c392f'),
    label('02 / THE LONG LINE', 855, 702, '#fff'),
    title(['Built to be', 'looked at.'], 855, 772, 54, '#fff', 58),
])
w, h = 390, 900
save('b-phone.svg', w, h, [rect(0, 0, w, h, '#10151a'), mast(w), image('motor-1.jpg', 0, 76, w, 365, 'xMidYMid'), rect(0, 325, w, 116, 'url(#shade)'), label('B  /  GALLERY CHAPTERS', 22, 115, '#fff', 10), label('MOTOR  •  OBJECTS OF MOTION', 22, 493, '#efb28b', 10), title(['First, the', 'feeling.'], 22, 555, 53, '#fff', 56), paragraph(['Detail. Silhouette. Reveal.'], 22, 659, '#d2c8c1', 17), label('EXPLORE THE STORY  ↘', 22, 700, '#fff', 10), image('motor-2.jpg', 0, 735, w, 165)])

# C: paper reading environment.
w, h = 1600, 900
save('c-desktop.svg', w, h, [
    rect(0, 0, w, h, '#f1ede5'), mast(w),
    image('research.jpg', 860, 76, 740, 545), rect(0, 76, 870, 545, '#f1ede5'),
    label('C  /  THE READING ROOM', 72, 130, '#8a4526'),
    label('SELECTED WORK  •  REPORTING / ESSAYS', 72, 230, '#8a4526'),
    title(['Follow the', 'question.'], 72, 334, 88, '#122737', 94),
    paragraph(['A quieter space for ideas and evidence.', 'Sources, authorship and dates stay visible.'],
              72, 519, '#334b59', 23, 32),
    label('BROWSE THE DESK  ↗', 72, 600, '#8a4526'),
    label('LEAD STORY / REPORTING', 72, 696, '#8a4526'),
    label('OUTSIDE SIGNALS', 670, 696, '#8a4526'),
    label('OPINION / ENIGMAS', 1180, 696, '#8a4526'),
    rect(72, 714, 1456, 2, '#ad7350'),
    title(['What the record', 'shows.'], 72, 785, 48, '#122737', 52),
    title(['Beyond the', 'room.'], 670, 785, 44, '#122737', 48),
    title(['A point', 'of view.'], 1180, 785, 44, '#122737', 48),
])
w, h = 390, 900
save('c-phone.svg', w, h, [rect(0, 0, w, h, '#f1ede5'), mast(w), image('research.jpg', 0, 76, w, 285), label('C  /  THE READING ROOM', 22, 115, '#fff', 10), label('REPORTING  /  ESSAYS', 22, 407, '#8a4526', 10), title(['Follow the', 'question.'], 22, 468, 49, '#122737', 52), paragraph(['A calmer page for evidence,', 'ideas and carefully labeled', 'opinion.'], 22, 574, '#334b59', 18, 25), label('BROWSE THE DESK  ↗', 22, 678, '#8a4526', 10), rect(22, 714, 346, 2, '#ad7350'), label('LEAD STORY / REPORTING', 22, 746, '#8a4526', 10), title(['What the record', 'shows.'], 22, 802, 31, '#122737', 34)])
print('Rendered 8 self-contained SVG visual studies.')
