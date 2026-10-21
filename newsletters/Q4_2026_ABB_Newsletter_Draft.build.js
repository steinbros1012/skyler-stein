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

const ImageSlot = () =>
  new Paragraph({
    spacing: SP,
    alignment: AlignmentType.CENTER,
    children: [T('[IMAGE TBD]', { italics: true })],
  });

// short descriptive line under the art, as in the final Q3
const Caption = (text) => P([T(text)]);

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

        Label('[Subject Line]'),
        Bullet([
          T('ABB in Action: Senator Heinrich on the Factory Floor, Ten Years in Senatobia, Powering Growth Across the Economy, and More'),
        ]),
        Blank(),

        // ── Note from ABB Team ──────────────────────────────────────
        Label('[Note from ABB Team]'),
        P([
          T('The hardest problem on the American grid is not building the equipment. It is getting permission to connect it. By the sponsors’ accounting, 83% of the projects waiting in the federal interconnection queue are clean energy.'),
        ]),
        Blank(),
        P([
          T('On October 12, Senator Martin Heinrich came to ABB’s Elastimold plant in Albuquerque. The Ranking Member of the Senate Energy and Natural Resources Committee '),
          Link(
            'joined a roundtable hosted by ABB and the National Association of Manufacturers',
            'https://www.energy.senate.gov/newsroom/press/heinrich-meets-with-new-mexicans-to-discuss-how-landmark-bipartisan-legislation-will-lower-costs-create-jobs-hold-data-centers-accountable/'
          ),
          T(' and walked the floor where he could pick up the hardware – the Elastimold separable connectors that tie underground cable into transformers and switchgear, and the Fisher Pierce fault indicators that show utilities where an outage starts – and see how it gets built. During the visit he made the case for the Bipartisan American Affordability and Jobs Act of 2026, which he introduced with Senators Lee, Capito, and Whitehouse. “We need permitting reform to put more electrons on the grid,” Heinrich said. “It results in more jobs.”'),
        ]),
        Blank(),
        P([
          T('Two days later in Senatobia, Mississippi, ABB marked ten years at its circuit breaker factory and '),
          Link(
            'opened a $40 million expansion',
            'https://new.abb.com/news/detail/139398/engineered-for-america-senatobia-a-decade-of-helping-u-s-industries-outrun'
          ),
          T(' that doubles the site’s footprint and adds about 200 jobs. Governor Tate Reeves, Congressman Trent Kelly, Mayor Greg Graves, and Swiss Consul General Rolf Ott attended. Kelly toured the plant privately and met with senior staff and workers on the line.'),
        ]),
        Blank(),
        P([
          T('The day before, more than 60 U.S. customers gathered in Oxford and came through the plant to see the new SACE Emax 3 air circuit breaker. NEMA President and CEO Debra Phillips and Consul General Ott filmed a '),
          T('Watts Brewing', { italics: true }),
          T(' segment on site. ABB donated $5,000 to the STEM program at Northwest Mississippi Community College.'),
        ]),
        Blank(),
        P([
          T('Senatobia has built circuit breakers in Mississippi, rather than importing them, since 2016. The case for building here is no longer a projection.'),
        ]),
        Blank(),
        ImageSlot(),
        Caption('Senator Heinrich tours ABB’s Elastimold plant in Albuquerque'),
        Blank(),
        ImageSlot(),
        Caption('Governor Reeves, Congressman Kelly, and ABB leaders at the Senatobia ribbon cutting'),
        Blank(),

        // ── Features ────────────────────────────────────────────────
        Label('[Features]'),

        Head('Powering Growth Across Every Sector of the Economy'),
        P([
          T('Electric load demand is projected to rise 55% by 2050. On September 15, ABB exhibited at the Congressional Grid Innovation Expo in the Rayburn House Office Building, hosted by NEMA, the GridWise Alliance, and the American Critical Minerals Association in conjunction with the House Grid Innovation Caucus.'),
        ]),
        Blank(),
        P([
          T('Meeting that demand is less a question of invention than of deployment. The technology is ready to scale now – the work is modernizing the grid and freeing up the capacity already sitting in installed equipment.'),
        ]),
        Blank(),
        P([
          T('A week later at Climate Week NYC, Cody Taylor, ABB’s Vice President and Group Head of Government Relations and Public Affairs, told New York policymakers that a far larger share of the economy needs to be electrified, and named two priorities for getting there: grid modernization – flexibility, digital capability, and resilience – and industrial energy efficiency, which cuts demand to free capacity for growth elsewhere. ABB’s portfolio covers both, from microgrids, digital substations, and energy storage to high-efficiency motors and drives.'),
        ]),
        Blank(),
        P([
          T('ABB supports the COP31 goal of electrifying 35% of the economy by 2035.'),
        ]),
        Blank(),
        ImageSlot(),
        Caption('Cody Taylor at Climate Week NYC'),
        Blank(),

        Head('The ABB NASCAR EV Prototype Comes to the Swiss Embassy'),
        P([
          T('On September 16, ABB featured the ABB NASCAR EV Prototype at the 25th annual Soirée Suisse, the Embassy of Switzerland reception convening government, business, and diplomatic leaders in Washington, DC. NASCAR driver David Ragan joined ABB on site.'),
        ]),
        Blank(),
        P([
          T('ABB is a founding member of NASCAR IMPACT and NASCAR’s official electrification partner. The prototype has spent the year doing the same job in different rooms – making American electrification something people can walk up to and put a hand on.'),
        ]),
        Blank(),
        ImageSlot(),
        Caption('The ABB NASCAR EV Prototype at the Embassy of Switzerland'),
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
            T('ABB Motion Business Area President Brandon Spencer on Infinitus, ABB’s new direct-current portfolio for AI data centers, and rack-level power demand climbing toward roughly one megawatt per rack – five to six times today’s levels.'),
          ],
          1
        ),
        Blank(),

        // ── Looking Ahead ───────────────────────────────────────────
        Label('[Looking Ahead]'),
        P([T('Be on the lookout for ABB at future events connecting leaders on electrification and manufacturing:')]),
        Bullet([
          T('November 7 | '),
          T('The Visioneers with Zay Harding', { italics: true }),
          T(': ABB Vice President of Strategic Partnerships Chris Shigas takes the CBS eco-innovation series inside the ABB NASCAR EV Prototype | CBS'),
        ]),
        Blank(),
        P([T('[CLOSING GRAPHIC TBD]', { italics: true })]),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(process.argv[2] || 'out.docx', buf);
  console.log('written');
});
