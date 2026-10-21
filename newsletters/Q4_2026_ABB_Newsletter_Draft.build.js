const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, ExternalHyperlink,
  AlignmentType, LevelFormat, convertInchesToTwip, PageOrientation,
} = require('docx');

const SP = { after: 0, line: 240, lineRule: 'auto' };

const P = (children, opts = {}) => new Paragraph({ spacing: SP, children, ...opts });
const T = (text, opts = {}) => new TextRun({ text, ...opts });

const Label = (text) => P([T(text, { bold: true, italics: true })]);
const Head = (text) => P([T(text, { bold: true })]);
const Blank = () => P([]);

const Link = (text, url) =>
  new ExternalHyperlink({ link: url, children: [T(text, { style: 'Hyperlink' })] });

const Bullet = (children, level = 0) =>
  new Paragraph({ numbering: { reference: 'abbBullets', level }, spacing: SP, children });

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
        new Paragraph({
          spacing: SP,
          alignment: AlignmentType.CENTER,
          children: [T('ABB IN ACTION | NEWSLETTER 10.20.2026', { bold: true, underline: {} })],
        }),
        Blank(),

        // ── Subject line ────────────────────────────────────────────
        Label('[Subject Line]'),
        Bullet([
          T('ABB in Action: Sen. Heinrich on the Factory Floor, Ten Years in Senatobia, and Powering What Comes Next'),
        ]),
        Blank(),

        // ── I. Building the grid here: Albuquerque + Senatobia ──────
        Label('[Note from ABB Team]'),
        P([
          T('On October 12, Senator Martin Heinrich came to ABB’s Elastimold plant in Albuquerque. The Ranking Member of the Senate Energy and Natural Resources Committee '),
          Link(
            'joined a roundtable hosted by ABB and the National Association of Manufacturers',
            'https://www.energy.senate.gov/newsroom/press/heinrich-meets-with-new-mexicans-to-discuss-how-landmark-bipartisan-legislation-will-lower-costs-create-jobs-hold-data-centers-accountable/'
          ),
          T(' and walked the floor – five stations where he could pick up the hardware and see how it gets built. “We need permitting reform to put more electrons on the grid,” Heinrich said. “It results in more jobs.”'),
        ]),
        Blank(),
        P([
          T('He was there to make the case for the Bipartisan American Affordability and Jobs Act of 2026, which he introduced with Senators Lee, Capito, and Whitehouse. The bill speeds federal review of energy projects, requires data centers to pay for their own grid upgrades and their share of the existing grid, and targets an interconnection queue where, by the sponsors’ accounting, 83% of the projects waiting are clean energy. “How do we create a faster process, not lower the bar on standards,” as Heinrich put it. The plant was the argument: Elastimold cable accessories and Fisher Pierce circuit solutions are the hardware that connects what the queue is holding up.'),
        ]),
        Blank(),
        P([
          T('Two days later in Senatobia, Mississippi, ABB marked ten years at its circuit breaker factory and '),
          Link(
            'cut the ribbon on a $40 million expansion that doubles the site’s footprint',
            'https://new.abb.com/news/detail/139398/engineered-for-america-senatobia-a-decade-of-helping-u-s-industries-outrun'
          ),
          T(' and adds about 200 jobs. Governor Tate Reeves, Congressman Trent Kelly, Mayor Greg Graves, and Swiss Consul General Rolf Ott all came on October 14. Kelly took a private tour and met with senior staff and with workers on the line. The project adds automated production lines, new technology and quality controls, employee training, and renovations to the existing plant – at a site that has been building circuit breakers in Mississippi, rather than importing them, since 2016.'),
        ]),
        Blank(),
        P([
          T('The day before, ABB hosted more than 60 U.S. customers in Oxford, who came through the plant to see the new SACE Emax 3 air circuit breaker. NEMA President and CEO Debra Phillips and Consul General Ott filmed a '),
          T('Watts Brewing', { italics: true }),
          T(' segment on site, over sweet tea. ABB also donated $5,000 to the STEM program at Northwest Mississippi Community College, whose main campus sits in Senatobia.'),
        ]),
        Blank(),
        ImageSlot('[IMAGE TBD]'),
        Caption('[Caption TBD]'),
        Blank(),
        ImageSlot('[IMAGE TBD]'),
        Caption('[Caption TBD]'),
        Blank(),

        // ── II. Powering Growth ─────────────────────────────────────
        Label('[Features]'),

        Head('Powering Growth: Where the Demand Is Coming From'),
        P([
          T('On September 15, ABB exhibited at the Congressional Grid Innovation Expo in the Rayburn House Office Building, hosted by NEMA, the GridWise Alliance, and the American Critical Minerals Association in conjunction with the House Grid Innovation Caucus. The premise of the morning was a number: electric load demand is projected to rise 55% by 2050, and the exhibits were there to show Members and staff what the technology answering it actually looks like.'),
        ]),
        Blank(),
        P([
          T('A week later, ABB took the same question to Climate Week NYC. In his opening keynote, International Energy Agency Executive Director Fatih Birol set out a “35 by 35” target – lifting electricity from just over 20% of final energy demand today to 35% by 2035. “35 by 35 will be the real target,” he said. Demand is rising across every sector at once, and the fastest capacity available is the efficiency already sitting in installed equipment.'),
        ]),
        Blank(),
        P([
          T('That is the argument ABB brought to both rooms, and it is the one Brandon Spencer took to Bloomberg from New York that week – below.'),
        ]),
        Blank(),
        ImageSlot('[IMAGE TBD]'),
        Caption('[Caption TBD]'),
        Blank(),

        // ── III. Soirée Suisse ──────────────────────────────────────
        Head('A Race Car at the Swiss Embassy'),
        P([
          T('On September 16, ABB brought a NASCAR race car to the 25th annual Soirée Suisse at the Embassy of Switzerland in Washington, with NASCAR driver David Ragan on hand.'),
        ]),
        Blank(),
        ImageSlot('[IMAGE TBD]'),
        Caption('[Caption TBD]'),
        Blank(),

        // ── IV. News ────────────────────────────────────────────────
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
            T(' to discuss Infinitus, ABB’s new direct-current portfolio for AI data centers. Spencer describes rack-level power demand climbing toward roughly one megawatt per rack – five to six times today’s levels – and where DC distribution fits in meeting it.'),
          ],
          1
        ),
        Blank(),

        // ── Looking Ahead ───────────────────────────────────────────
        Label('[Looking Ahead]'),
        P([T('Be on the lookout for ABB at future events connecting leaders on electrification and manufacturing:')]),
        Bullet([
          T('The Visioneers with Zay Harding', { italics: true }),
          T(': ABB Vice President of Strategic Partnerships Chris Shigas takes CBS’s weekly eco-innovation series inside the NASCAR EV prototype | CBS (November 7, 2026)'),
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
