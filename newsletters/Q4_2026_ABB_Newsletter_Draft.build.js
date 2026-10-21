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

        // ── I. Building the grid here ───────────────────────────────
        Label('[Note from ABB Team]'),
        P([
          T('The hardest problem on the American grid right now is not building the equipment. It is getting permission to connect it. By the sponsors’ own accounting, 83% of the projects waiting in the federal interconnection queue are clean energy – power that exists on paper and nowhere else.'),
        ]),
        Blank(),
        P([
          T('That is the problem Senator Martin Heinrich came to Albuquerque to talk about on October 12. The Ranking Member of the Senate Energy and Natural Resources Committee '),
          Link(
            'joined a roundtable hosted by ABB and the National Association of Manufacturers',
            'https://www.energy.senate.gov/newsroom/press/heinrich-meets-with-new-mexicans-to-discuss-how-landmark-bipartisan-legislation-will-lower-costs-create-jobs-hold-data-centers-accountable/'
          ),
          T(' at ABB’s Elastimold plant, then walked the floor – five stations where he could pick up the hardware and see how it gets made. He was making the case for the Bipartisan American Affordability and Jobs Act of 2026, which he introduced with Senators Lee, Capito, and Whitehouse. The bill speeds federal review of energy projects and requires data centers to pay for their own grid upgrades and their share of the grid they plug into.'),
        ]),
        Blank(),
        P([
          T('“We need permitting reform to put more electrons on the grid,” Heinrich said. “It results in more jobs.” On the balance the bill is trying to strike: “How do we create a faster process, not lower the bar on standards.”'),
        ]),
        Blank(),
        P([
          T('The plant was the argument. Elastimold cable accessories and Fisher Pierce circuit solutions are the hardware that connects what the queue is holding up, and they are made in Albuquerque.'),
        ]),
        Blank(),
        P([
          T('Two days later, ABB made the same case in Mississippi with a ribbon. On October 14, the company marked ten years at its Senatobia circuit breaker factory and '),
          Link(
            'opened a $40 million expansion',
            'https://new.abb.com/news/detail/139398/engineered-for-america-senatobia-a-decade-of-helping-u-s-industries-outrun'
          ),
          T(' that doubles the site’s footprint and adds about 200 jobs. Governor Tate Reeves, Congressman Trent Kelly, Mayor Greg Graves, and Swiss Consul General Rolf Ott all came. Kelly took a private tour and met with senior staff and with workers on the line. The expansion brings automated production lines, new technology and quality controls, employee training, and renovations to the existing plant.'),
        ]),
        Blank(),
        P([
          T('The day before, more than 60 U.S. customers gathered in Oxford and came through the plant to see the new SACE Emax 3 air circuit breaker. NEMA President and CEO Debra Phillips and Consul General Ott filmed a '),
          T('Watts Brewing', { italics: true }),
          T(' segment on site, over sweet tea. ABB also donated $5,000 to the STEM program at Northwest Mississippi Community College, whose main campus is in Senatobia.'),
        ]),
        Blank(),
        P([
          T('Senatobia has been building circuit breakers in Mississippi, rather than importing them, since 2016. Ten years on, the case for building here is no longer a projection. It is a payroll.'),
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
          T('Every forecast for American electricity now points the same way, and the argument has stopped being about whether demand rises. Electric load is projected to climb 55% by 2050. The open question is what gets built, and how fast it can be connected.'),
        ]),
        Blank(),
        P([
          T('On September 15, ABB exhibited at the Congressional Grid Innovation Expo in the Rayburn House Office Building, hosted by NEMA, the GridWise Alliance, and the American Critical Minerals Association in conjunction with the House Grid Innovation Caucus. It is a morning built to put the technology answering that number in front of the Members and staff who will write the rules around it.'),
        ]),
        Blank(),
        P([
          T('A week later ABB carried the same question to Climate Week NYC, where Cody Taylor, ABB’s Vice President and Group Head of Government Relations and Public Affairs, told New York policymakers that a far larger share of the economy needs to be electrified – and named the two things that get it there. Modernize the grid: flexibility, digital capability, resilience. Then take demand out of industry, so the capacity freed up can go to growth somewhere else. ABB builds for both ends of that, from microgrids, digital substations, and energy storage to high-efficiency motors and drives.'),
        ]),
        Blank(),
        P([
          T('His point to the room was that none of this is waiting on invention. The technology is ready to scale now, which is why ABB supports the COP31 goal of electrifying 35% of the economy by 2035. Brandon Spencer made the same argument on television that week, below.'),
        ]),
        Blank(),
        ImageSlot('[IMAGE TBD]'),
        Caption('[Caption TBD]'),
        Blank(),

        // ── III. Soirée Suisse ──────────────────────────────────────
        Head('A Race Car at the Swiss Embassy'),
        P([
          T('On September 16, ABB brought a NASCAR race car to the 25th annual Soirée Suisse at the Embassy of Switzerland in Washington, with driver David Ragan on hand. A race car is an unusual way to make an argument about electrification, which is precisely why it works in a room full of people who have heard that argument made every other way.'),
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
