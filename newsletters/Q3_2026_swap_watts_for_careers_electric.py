import re, shutil, os

D = 'q3u/word/document.xml'
R = 'q3u/word/_rels/document.xml.rels'

x = open(D, encoding='utf-8').read()
rels = open(R, encoding='utf-8').read()

# ── add relationships for the two new hyperlinks ────────────────────────────
LINKS = {
    'Rce0001': 'https://new.abb.com/news/detail/136486/careers-electric-launches-national-coalition-to-expand-workforce-training-for-the-electrical-careers-of-today-and-tomorrow',
    'Rce0002': 'https://governor.nc.gov/news/press-releases/2026/07/13/governor-stein-visits-careers-electric-cleveland-county-summer-academy-highlights-workforce',
}
new_rels = ''.join(
    f'<Relationship Id="{rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" '
    f'Target="{url}" TargetMode="External" />'
    for rid, url in LINKS.items()
)
rels = rels.replace('</Relationships>', new_rels + '</Relationships>')

# ── XML builders matching this document's conventions ───────────────────────
def esc(s):
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')

def run(text, **kw):
    rpr = ''
    if kw.get('b'):
        rpr += '<w:b w:val="1" /><w:bCs w:val="1" />'
    if kw.get('i'):
        rpr += '<w:i /><w:iCs />'
    rpr = f'<w:rPr>{rpr}</w:rPr>' if rpr else ''
    return f'<w:r>{rpr}<w:t xml:space="preserve">{esc(text)}</w:t></w:r>'

def link(text, rid):
    return (f'<w:hyperlink r:id="{rid}"><w:r><w:rPr><w:rStyle w:val="Hyperlink" /></w:rPr>'
            f'<w:t xml:space="preserve">{esc(text)}</w:t></w:r></w:hyperlink>')

def para(inner, center=False, headrpr=False):
    ppr = ''
    if center:
        ppr = '<w:pPr><w:jc w:val="center" /></w:pPr>'
    elif headrpr:
        ppr = '<w:pPr><w:rPr><w:b w:val="1" /><w:bCs w:val="1" /></w:rPr></w:pPr>'
    return f'<w:p>{ppr}{inner}</w:p>'

BLANK = '<w:p />'

# ── the Careers Electric feature ────────────────────────────────────────────
feature = ''.join([
    para(run('Careers Electric Turns a National Commitment Into Classroom Seats in North Carolina', b=True),
         headrpr=True),

    para(
        run('In June, ABB joined the Siemens Foundation as co-chair of the ')
        + link('Careers Electric Coalition', 'Rce0001')
        + run(' with a $1 million investment, backing a national initiative to train a cumulative 25,000 people '
              'for skilled electrical careers over its first 10 years. This summer, that commitment turned into '
              'classroom seats. Twelve Careers Electric Summer Academies ran at community colleges across North '
              'Carolina – the first state to implement the model – introducing high school students to the '
              'electrical trade at no cost to them.')
    ),
    BLANK,

    para(
        run('Students earn college credit in electrical coursework, industry-valued credentials, hands-on '
            'experience with employer partners, and completion of a registered pre-apprenticeship, plus a '
            '$2,000 stipend when they finish. Careers Electric also launched at 10 North Carolina community '
            'colleges this year, with the North Carolina Business Committee for Education and the North '
            'Carolina Community College System as implementation partners. Founding national industry partners '
            'include ABB, Amazon Web Services, Duke Energy, Hitachi Energy, JetZero, and Siemens.')
    ),
    BLANK,

    para(
        run('North Carolina Governor Josh Stein ')
        + link('visited the Cleveland Community College academy', 'Rce0002')
        + run(' in July, where 18 local high school students had just started an eight-week introduction to '
              'electrical systems technology. The constraint on American electrification is not demand or '
              'technology – it is having enough people qualified to do the work. Careers Electric is built to '
              'scale from North Carolina to the rest of the country, and ABB is helping steer it.')
    ),
    BLANK,

    para(run('[IMAGE TBD]', i=True), center=True),
    para(run('[Caption TBD]', b=True, i=True), center=True),
    BLANK,
])

# ── splice: replace the whole Watts Brewing feature block ───────────────────
anchor = '<w:commentRangeStart w:id="372411183" />'
start = x.rindex('<w:p ', 0, x.index(anchor))
end = x.rindex('<w:p ', 0, x.index('The Accelerate America 250+ Tour Brings ABB Technology Coast to Coast'))
removed = x[start:end]
assert 'Watts Brewing' in removed and 'Polaris Forge' in removed, 'wrong block'
assert 'Accelerate America 250+ Tour' not in removed, 'over-reached into the tour feature'
assert '617210696' not in removed, 'would clobber the tour comment'
x = x[:start] + feature + x[end:]

# ── subject line no longer matches the contents ─────────────────────────────
x = x.replace('AI Data Centers in North Dakota', 'Careers Electric Expands in North Carolina')

open(D, 'w', encoding='utf-8').write(x)
open(R, 'w', encoding='utf-8').write(rels)

# ── drop Jim's comment on the removed feature (its anchor is gone) ──────────
# Only comments.xml matters here: a w:comment with no reference left in
# document.xml is what Word objects to. Stale rows in the commentsExtended /
# Ids / Extensible sidecars are tolerated, so leave them be.
CID = '372411183'
s = open('q3u/word/comments.xml', encoding='utf-8').read()
m = re.search(r'<w:comment\b[^>]*w:id="%s".*?</w:comment>' % CID, s, re.S)
if m:
    s = s[:m.start()] + s[m.end():]
    open('q3u/word/comments.xml', 'w', encoding='utf-8').write(s)
    print('removed comment', CID, 'from comments.xml')

print('done')
