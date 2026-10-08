const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, ExternalHyperlink,
  AlignmentType, LevelFormat, convertInchesToTwip, PageOrientation,
} = require('docx');

const SP = { after: 0, line: 240, lineRule: 'auto' };

const P = (children, opts = {}) => new Paragraph({ spacing: SP, children, ...opts });
const T = (text, opts = {}) => new TextRun({ text, ...opts });

// bracketed section label, e.g. [Features]
const Label = (text) => P([T(text, { bold: true, italics: true })]);

// bold sub-headline for a feature
const Head = (text) => P([T(text, { bold: true })]);

const Blank = () => P([]);

// hyperlink styled like the reference (Hyperlink char style)
const Link = (text, url) =>
  new ExternalHyperlink({ link: url, children: [T(text, { style: 'Hyperlink' })] });

// bullet, level 0 or 1, on the shared "abbBullets" numbering
const Bullet = (children, level = 0) =>
  new Paragraph({ numbering: { reference: 'abbBullets', level }, spacing: SP, children });

// production placeholder marking where art drops in
const ImageSlot = (note) =>
  new Paragraph({
    spacing: SP,
    alignment: AlignmentType.CENTER,
    children: [T(note, { italics: true })],
  });

const Caption = (text) =>
  new Paragraph({
    spacing: SP,
    alignment: AlignmentType.CENTER,
    children: [T(text, { bold: true, italics: true, size: 20 })],
  });

const doc = new Document({
  creator: 'ABB in Action',
  title: 'ABB in Action Newsletter — Q4 2026 Draft',
  numbering: {
    config: [
      {
        reference: 'abbBullets',
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: '●',
            alignment: AlignmentType.LEFT,
            style: {
              paragraph: {
                indent: { left: convertInchesToTwip(0.5), hanging: convertInchesToTwip(0.25) },
              },
            },
          },
          {
            level: 1,
            format: LevelFormat.BULLET,
            text: '○',
            alignment: AlignmentType.LEFT,
            style: {
              paragraph: {
                indent: { left: convertInchesToTwip(1.0), hanging: convertInchesToTwip(0.25) },
              },
            },
          },
        ],
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840, orientation: PageOrientation.PORTRAIT },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      children: [
        // ── Masthead ────────────────────────────────────────────────
        new Paragraph({
          spacing: SP,
          alignment: AlignmentType.CENTER,
          children: [T('ABB IN ACTION | NEWSLETTER 10.XX.2026', { bold: true, underline: {} })],
        }),
        Blank(),

        // ── Subject line ────────────────────────────────────────────
        Label('[Subject Line]'),
        Bullet([
          T('ABB in Action: A Race Car at the Swiss Embassy, Climate Week in New York, What’s Next in Albuquerque, and ABB on CBS'),
        ]),
        Blank(),

        // ── Note from ABB Team: the fall DC/NY run ──────────────────
        Label('[Note from ABB Team]'),
        P([
          T('Two rooms, five days apart, made the case for electrification to two very different audiences this fall. On September 16, the Embassy of Switzerland in Washington hosted its 25th annual Soirée Suisse, the signature evening where Swiss companies show American policymakers, diplomats, and press what Swiss innovation looks like on the ground in the United States. ABB brought the hardware: the NASCAR electric prototype built under the ABB NASCAR Electrification Innovation Partnership, with veteran NASCAR driver David Ragan on hand to walk guests through it. Hosted by ABB’s U.S. Government Relations team, the activation put high-performance electric racing – an all-wheel-drive, 78 kWh machine that out-accelerates the gas cars it shares a garage with – directly in front of the people who write energy policy.'),
        ]),
        Blank(),
        P([
          T('Five days later in New York, Brandon Spencer, President of ABB’s Motion Business Area, was on the ground for Climate Week NYC, meeting with policymakers, NGOs, media, and customers on accelerating electrification and scaling the technologies an efficient energy system depends on. [SESSION DETAIL TBD – panel name, co-panelists, and the line we want pulled out.]'),
        ]),
        Blank(),
        P([
          T('The through-line in both rooms was efficiency. Electricity accounts for just over 20% of final energy demand today, and the “35 by 35” goal would push that to 35% by 2035 – a target ABB supports, and one that gets met less by building new supply than by getting more out of what is already installed.'),
        ]),
        Blank(),
        ImageSlot('[IMAGE TBD]'),
        Caption('[Caption TBD]'),
        Blank(),
        ImageSlot('[IMAGE TBD]'),
        Caption('[Caption TBD]'),
        Blank(),

        // ── Features ────────────────────────────────────────────────
        Label('[Features]'),

        Head('[HEADLINE TBD] — Albuquerque'),
        P([
          T('[LEDE TBD – what is happening in Albuquerque, on what date, and who is attending.]'),
        ]),
        Blank(),
        P([
          T('Background we can build on: ABB Installation Products opened a '),
          Link(
            'more than $40 million plant in Albuquerque',
            'https://new.abb.com/news/detail/125108/abb-opens-40-million-manufacturing-facility-in-new-mexico'
          ),
          T(' in April 2025, a 90,000-square-foot facility building Elastimold cable accessories and Fisher Pierce circuit solutions – the components utilities use to harden the grid and keep power on. ABB has since put roughly $15 million more into equipment upgrades and automation at the site. The Albuquerque campus employs more than 565 people.'),
        ]),
        Blank(),
        P([
          T('[CLOSING TBD – the jobs number, the capacity added, and the local and congressional angle.] It is the same argument the rest of this year has made in Wisconsin, South Carolina, and North Carolina: the equipment that holds up the American grid is increasingly built by Americans, in American plants.'),
        ]),
        Blank(),
        ImageSlot('[IMAGE TBD]'),
        Caption('[Caption TBD]'),
        Blank(),

        // ── ABB in the News ─────────────────────────────────────────
        Label('[ABB in the News]'),
        Bullet([
          T('September 2026 | Bloomberg: '),
          Link(
            'ABB Motion President on New Data Center Technology',
            'https://www.bloomberg.com/news/videos/2026-09-22/abb-motion-president-on-new-data-center-technology'
          ),
        ]),
        Bullet(
          [
            T('Brandon Spencer, President of ABB’s Motion Business Area, joins Romaine Bostick and Bailey Lipschultz on '),
            T('Bloomberg Markets: The Close', { italics: true }),
            T(' to discuss Infinitus, ABB’s new direct-current portfolio for AI data centers. As rack-level demand climbs toward a megawatt apiece – five to six times today’s levels – Spencer makes the case that DC distribution, built on more than 25 years of ABB work in mission-critical facilities, is how operators get more compute out of the power they already have.'),
          ],
          1
        ),
        Blank(),

        // ── Looking Ahead ───────────────────────────────────────────
        Label('[Looking Ahead]'),
        P([T('Be on the lookout for ABB at future events connecting leaders on electrification and manufacturing:')]),
        Bullet([
          T('The Visioneers with Zay Harding', { italics: true }),
          T(': ABB featured on CBS’s weekly eco-innovation series, with ABB Vice President of Strategic Partnerships Chris Shigas on [SEGMENT TOPIC TBD] | CBS (Saturday, November 7, 2026)'),
        ]),
        Bullet([
          T('[ADDITIONAL EVENT TBD]: [Description] | [City, State] ([Date])'),
        ]),
        Blank(),
        ImageSlot('[CLOSING GRAPHIC TBD]'),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(process.argv[2] || 'out.docx', buf);
  console.log('written');
});
