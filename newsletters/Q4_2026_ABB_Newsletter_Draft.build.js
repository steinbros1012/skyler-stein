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
          T('ABB in Action: A Race Car at the Swiss Embassy, Climate Week in New York, Sen. Heinrich in Albuquerque, and ABB on CBS'),
        ]),
        Blank(),

        // ── Note from ABB Team: the fall DC/NY run ──────────────────
        Label('[Note from ABB Team]'),
        P([
          T('Two rooms, six days apart, made the case for electrification to two very different audiences this fall. On September 16, the Embassy of Switzerland in Washington hosted its 25th annual Soirée Suisse, the signature evening where Swiss companies show American policymakers, diplomats, and press what Swiss innovation looks like on the ground in the United States. ABB brought the hardware: the NASCAR electric prototype built under the ABB NASCAR Electrification Innovation Partnership, with veteran NASCAR driver David Ragan on hand to walk guests through it. Hosted by ABB’s U.S. Government Relations team, the activation put high-performance electric racing – an all-wheel-drive, 78 kWh machine that out-accelerates the gas cars it shares a garage with – directly in front of the people who write energy policy.'),
        ]),
        Blank(),
        P([
          T('Six days later in New York, ABB took the harder question to Climate Week NYC. At Sustainability LIVE on September 22, ABB joined Alfa Laval, Digital Realty, and Compass Datacenters at the Javits Center for “New Frontiers in Data Center Efficiency,” a midday panel on how engineering, cooling technology, and cross-sector collaboration can get more compute out of each unit of energy – and on whether data centers can become active participants in the energy system rather than simply loads on it. [ABB PANELIST TBD – pre-event listings named Tuomo Hoysniemi, President of ABB’s Drive Products Division; confirm whether he or Brandon Spencer took the seat, and send any other ABB sessions.]'),
        ]),
        Blank(),
        P([
          T('The through-line in both rooms was efficiency. In his Climate Week opening keynote, International Energy Agency Executive Director Fatih Birol set out a “35 by 35” electrification target – lifting electricity from just over 20% of final energy demand today to 35% by 2035. “35 by 35 will be the real target,” he said. Meeting it depends far less on building new supply than on getting more out of what is already installed, which is the case ABB has been making all year.'),
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

        Head('Sen. Martin Heinrich Hosts ABB in Albuquerque'),
        P([
          T('On [DATE TBD], ABB will join Senator Martin Heinrich in Albuquerque for [EVENT FORMAT TBD – ribbon cutting, tour, roundtable]. Heinrich is the Ranking Member of the Senate Energy and Natural Resources Committee and one of four senators behind the bipartisan American Affordability and Jobs Act introduced in September, a bill pitched on cheaper energy, more jobs, and responsible growth. Albuquerque is a fitting place to make that case. [ADDITIONAL ATTENDEES AND ANNOUNCEMENT TBD.]'),
        ]),
        Blank(),
        P([
          T('ABB Installation Products opened a '),
          Link(
            'more than $40 million plant in the city',
            'https://new.abb.com/news/detail/125108/abb-opens-40-million-manufacturing-facility-in-new-mexico'
          ),
          T(' in April 2025 – 90,000 square feet building Elastimold cable accessories and Fisher Pierce circuit solutions, the unglamorous components utilities depend on to harden the grid and keep the lights on through storms and fire season. ABB has since put roughly $15 million more into equipment upgrades and automation at the site, and the Albuquerque campus now employs more than 565 people.'),
        ]),
        Blank(),
        P([
          T('That is the argument in one building: the hardware a senator writing national energy policy cares about is being built by New Mexicans, in New Mexico. It is the same case ABB has made this year in Wisconsin, South Carolina, and North Carolina – and the reason the company keeps making it is that reliability and domestic manufacturing turn out to be the same conversation.'),
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
          T(': ABB Vice President of Strategic Partnerships Chris Shigas takes CBS’s weekly eco-innovation series inside the NASCAR electric prototype – the same car that drew a crowd at the Swiss Embassy in September | CBS (Saturday, November 7, 2026)'),
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
