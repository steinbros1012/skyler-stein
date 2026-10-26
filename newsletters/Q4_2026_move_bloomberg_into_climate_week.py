import re

D = 'q4u/word/document.xml'
x = open(D, encoding='utf-8').read()

BLOOMBERG_REL = 'rId13'  # already points at the Bloomberg video


def esc(s):
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


# ── 1. build the replacement block for the Climate Week section ────────────
body = (
    '<w:p><w:commentRangeStart w:id="1" />'
    '<w:r><w:t xml:space="preserve">' + esc(
        'Brandon Spencer, President of ABB’s Motion Business Area, took the same argument to '
        'Bloomberg Markets: The Close that week, discussing Infinitus, ABB’s new direct-current '
        'portfolio for AI data centers, and rack-level power demand climbing toward roughly one '
        'megawatt per rack – five to six times today’s levels.'
    ) + '</w:t></w:r>'
    '<w:commentRangeEnd w:id="1" />'
    '<w:r><w:rPr><w:rStyle w:val="CommentReference" /><w:sz w:val="20" /><w:szCs w:val="20" /></w:rPr>'
    '<w:commentReference w:id="1" /></w:r></w:p>'
)

spacer = '<w:p />'

screenshot = (
    '<w:p><w:pPr><w:jc w:val="center" /></w:pPr>'
    '<w:r><w:rPr><w:i /><w:iCs /></w:rPr><w:t xml:space="preserve">'
    + esc('[SCREENSHOT TBD – hyperlink the image to the Bloomberg interview]')
    + '</w:t></w:r></w:p>'
)

caption = (
    '<w:p><w:pPr><w:jc w:val="center" /><w:rPr><w:b /><w:bCs /></w:rPr></w:pPr>'
    f'<w:hyperlink r:id="{BLOOMBERG_REL}">'
    '<w:r><w:rPr><w:rStyle w:val="Hyperlink" /><w:b /><w:bCs /></w:rPr><w:t xml:space="preserve">'
    + esc('Watch: Brandon Spencer on Bloomberg Markets: The Close')
    + '</w:t></w:r></w:hyperlink></w:p>'
)

block = spacer + body + spacer + screenshot + caption

# ── 2. remove the News section: label + both bullets ───────────────────────
i = x.index('[ABB in the News]')
start = x.rindex('<w:p ', 0, i)
# end of the second bullet paragraph, which carries the commentRangeEnd
j = x.index('<w:commentReference w:id="1" />')
end = x.index('</w:p>', j) + len('</w:p>')
removed = x[start:end]
assert '[ABB in the News]' in removed and 'Bloomberg' in removed, 'wrong block'
assert 'CLOSING GRAPHIC' not in removed, 'over-reached past the news section'
x = x[:start] + x[end:]

# ── 3. insert after the Jim Creevy caption in the Climate Week section ─────
k = x.index('Jim Creevy (far right)')
ins = x.index('</w:p>', k) + len('</w:p>')
x = x[:ins] + block + x[ins:]

open(D, 'w', encoding='utf-8').write(x)
print('moved Bloomberg item into the Climate Week section; News section removed')
