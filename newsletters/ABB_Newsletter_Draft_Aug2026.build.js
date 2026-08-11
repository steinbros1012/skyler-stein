const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, ExternalHyperlink,
  AlignmentType, LevelFormat, convertInchesToTwip, PageOrientation,
} = require('docx');

const SP = { after: 0, line: 240, lineRule: 'auto' };

// plain body paragraph; children = array of runs
const P = (children, opts = {}) =>
  new Paragraph({ spacing: SP, children, ...opts });

const T = (text, opts = {}) => new TextRun({ text, ...opts });

// bracketed section label, e.g. [Features]
const Label = (text) =>
  P([T(text, { bold: true, italics: true })]);

// bold sub-headline for a feature
const Head = (text) => P([T(text, { bold: true })]);

// empty spacer line
const Blank = () => P([]);

// hyperlink styled like the reference (Hyperlink char style)
const Link = (text, url) =>
  new ExternalHyperlink({
    link: url,
    children: [T(text, { style: 'Hyperlink' })],
  });

// bullet, level 0 or 1, on the shared "abbBullets" numbering
const Bullet = (children, level = 0) =>
  new Paragraph({
    numbering: { reference: 'abbBullets', level },
    spacing: SP,
    children,
  });

// centered placeholder standing in for an image, plus its caption slot
const ImageSlot = (note) =>
  new Paragraph({
    spacing: SP,
    alignment: AlignmentType.CENTER,
    children: [T(note, { italics: true, color: '808080' })],
  });

const Caption = (text) =>
  new Paragraph({
    spacing: SP,
    alignment: AlignmentType.CENTER,
    children: [T(text, { bold: true, italics: true, size: 20 })],
  });

// editorial note for the team — bracketed, italic, gray so it is easy to spot and delete
const Note = (text) =>
  P([T(text, { italics: true, color: '808080' })]);

const doc = new Document({
  creator: 'ABB in Action',
  title: 'ABB in Action Newsletter — Q3 2026 Draft',
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
          children: [T('ABB IN ACTION | NEWSLETTER 08.XX.2026', { bold: true, underline: {} })],
        }),
        Blank(),

        // ── Subject line ────────────────────────────────────────────
        Label('[Subject Line]'),
        Bullet([
          T('ABB in Action: Powering the Smithsonian for America’s 250th, AI Data Centers in North Dakota, and More'),
        ]),
        Blank(),

        // ── Note from ABB Team (headliner: Smithsonian) ─────────────
        Label('[Note from ABB Team]'),
        P([
          T('As the United States marks 250 years, one of the country’s most recognizable institutions is running on newly modernized American-made electrical infrastructure. ABB '),
          Link(
            'upgraded the critical power systems',
            'https://new.abb.com/news/detail/136933/abb-modernizes-smithsonians-electrical-systems-as-the-united-states-marks-250-years'
          ),
          T(' at the Smithsonian Institution’s Arts and Industries Building in Washington, D.C. – the museum’s second-oldest structure, opened in 1881 as a home for American invention – ahead of the building’s reopening to the public for the semiquincentennial.'),
        ]),
        Blank(),
        P([
          T('ABB retrofitted the building’s switchgear with custom-engineered circuit breakers featuring integral fusing, designed to meet the site’s specific fault-current protection requirements and to carry the higher operational demand that comes with a full public program. The breakers were manufactured at ABB’s U.S. Electrification Service factory in Florence, South Carolina. The upgrade also strengthened system protection so it responds faster to faults, added updated labeling and safety features for personnel working near energized equipment, and introduced integrated monitoring and data tools that give the Smithsonian’s facilities team continuous visibility into system performance.'),
        ]),
        Blank(),
        P([
          T('The Arts and Industries Building is open for a four-month run hosting the '),
          T('Voices and Votes', { italics: true }),
          T(' exhibition, the Folklife Marketplace, and the '),
          T('For the Common Good: Smithsonian Voices on Our Shared Future 250', { italics: true }),
          T(' conversation series. Nearly 150 years after it first opened its doors to showcase what America could build, the building is doing it again – this time powered by equipment built by American workers in South Carolina.'),
        ]),
        Blank(),
        ImageSlot('[IMAGE TK: Arts and Industries Building exterior or ABB team on site — confirm Smithsonian image rights before use]'),
        Caption('[Caption TK: names and titles of anyone pictured, per house style]'),
        Blank(),

        // ── Features ────────────────────────────────────────────────
        Label('[Features]'),

        Head('Watts Brewing: Inside the AI Data Center Rising in Ellendale, North Dakota'),
        P([
          T('In the latest episode of '),
          T('Watts Brewing', { italics: true }),
          T(' [LINK TK]', { italics: true, color: '808080' }),
          T(', ABB Electrification President Giampiero Frisio traveled to Ellendale, North Dakota, to walk the Applied Digital campus with Chief Development Officer Todd Gale. Their conversation covers why AI is being called this generation’s space race, what it actually takes to build data centers fast enough to keep up with demand, and why the choice of technology partner has become one of the biggest determinants of how quickly – and how efficiently – capacity comes online.'),
        ]),
        Blank(),
        P([
          T('The Ellendale campus is a 400 MW greenfield build in Dickey County, and ABB is supplying the power backbone under an '),
          Link(
            'expanded partnership with Applied Digital',
            'https://new.abb.com/news/detail/131010/abb-expands-power-technology-partnership-with-applied-digital-for-ai-ready-data-centers'
          ),
          T(', including its HiPerGuard medium-voltage static UPS. Moving protection to medium voltage removes conversion steps between the grid and the racks, which cuts losses and frees up floor space that would otherwise go to electrical rooms – efficiency that matters most in a state where new generation is not something you can simply order up. For a rural county of a few thousand people, it also means construction jobs, operations jobs, and a tax base that did not exist five years ago.'),
        ]),
        Blank(),
        ImageSlot('[IMAGE TK: still from the Watts Brewing episode — Frisio and Gale on the Ellendale campus]'),
        Caption('ABB Electrification Business Area President Giampiero Frisio and Applied Digital Chief Development Officer Todd Gale at Applied Digital’s AI data center campus in Ellendale, North Dakota'),
        Blank(),

        Head('Engineered for America Takes the Tour on the Road for the Nation’s 250th'),
        Note('[DRAFTING NOTE: We do not have public detail on the America 250 tour — route, stops, dates, format, or who is traveling. The copy below is a scaffold written to the shape of the story. Please drop in specifics and I will tighten it.]'),
        P([
          T('ABB’s '),
          Link(
            'Engineered for America',
            'https://new.abb.com/news/detail/135260/engineered-for-america-showcasing-abbs-growing-investment-in-us-manufacturing'
          ),
          T(' series has spent 2026 spotlighting the people and plants behind ABB’s U.S. footprint, beginning with the $100 million investment in the New Berlin, Wisconsin campus. For the country’s 250th anniversary, the series is going on the road – [NUMBER] stops across [STATES/REGIONS] between [START DATE] and [END DATE], bringing ABB technology and the employees who build it directly into the communities where the work happens.'),
        ]),
        Blank(),
        P([
          T('[STOP-BY-STOP DETAIL TK: which sites, what visitors see, which elected officials, customers, or workforce partners are joining, and any hiring or training announcements tied to the stops.] Roughly 75–80% of what ABB sells in the U.S. is made in the U.S., and the tour is built to make that concrete for the people who see the equipment but rarely see the factory floor behind it.'),
        ]),
        Blank(),
        ImageSlot('[IMAGE TK: tour vehicle, site visit, or employee photo from a stop]'),
        Caption('[Caption TK]'),
        Blank(),

        // ── ABB in the News ─────────────────────────────────────────
        Label('[ABB in the News]'),
        Bullet([
          T('June 2026 | CNBC: '),
          Link(
            'CEO of ABB on meeting the surging power demand for AI data centers',
            'https://www.cnbc.com/video/2026/06/04/ceo-of-abb-on-meeting-the-surging-power-demand-for-ai-data-centers.html'
          ),
        ]),
        Bullet(
          [
            T('ABB CEO Morten Wierod on the shortage of skilled workers available to build AI data centers, how the industry meets rising power demand, and what can be done to bring facility power consumption down.'),
          ],
          1
        ),
        Bullet(
          [
            T('[CONFIRM: this is the June 4 hit. If you meant the Q2 earnings interview from the week of July 16, send me the link and I will swap it in — record $12B orders and the Rotork acquisition would give us a stronger U.S. investment hook.]', { italics: true, color: '808080' }),
          ],
          1
        ),
        Bullet([
          T('June 2026 | Control Global: '),
          Link(
            'ABB’s Grinding Connect service improves grinding asset visibility in process plants',
            'https://www.controlglobal.com/industry-news/news/55395818/abb-abbs-grinding-connect-service-improves-grinding-asset-visibility-in-process-plants'
          ),
        ]),
        Bullet(
          [
            T('ABB’s new digital service suite for gearless mill drives gives mineral processing operators a single view of grinding asset condition, service history, and expert support – uptime that matters as the U.S. works to expand domestic critical mineral processing capacity. Unplanned downtime at these sites can run up to $500,000 per hour.'),
          ],
          1
        ),
        Bullet([
          T('June 2026 | Tech Briefs: '),
          Link(
            'Leveraging Human-Generated Data to Advance Robotic Dexterity',
            'https://www.techbriefs.com/component/content/article/55565-leveraging-human-generated-data-to-advance-robotic-dexterity'
          ),
        ]),
        Bullet(
          [
            T('ABB Robotics and San Diego-based PSYONIC are pairing PSYONIC’s Ability Hand with an ABB GoFa cobot, using real-world touch and motion data from prosthetic users – rather than simulation alone – to teach robots the delicate handling tasks that have resisted automation.'),
          ],
          1
        ),
        Blank(),

        // ── Looking Ahead ───────────────────────────────────────────
        Label('[Looking Ahead]'),
        P([T('Be on the lookout for future ABB at events connecting leaders on electrification and manufacturing:')]),
        Bullet([
          Link('Climate Week NYC', 'https://www.climateweeknyc.org/'),
          T(': Thought leadership conference convening business, government, and civil society on climate action | New York City, New York (September 2026)'),
        ]),
        Bullet([
          T('[EVENT TK]: [Description] | [City, State] ([Date])'),
        ]),
        Blank(),
        ImageSlot('[CLOSING GRAPHIC TK: last issue closed on the NASCAR San Diego promo. Suggest an America 250 / Engineered for America banner here.]'),
        Blank(),
        Blank(),

        // ── Open items ──────────────────────────────────────────────
        Label('[Open Items — delete before send]'),
        Bullet([T('Send date and issue date in the masthead.')]),
        Bullet([T('Watts Brewing Ellendale episode link.')]),
        Bullet([T('America 250 tour specifics: route, dates, format, spokespeople, and any announcements timed to stops.')]),
        Bullet([T('Confirm which CNBC hit we want (June 4 vs. Q2 earnings week).')]),
        Bullet([T('Verify the HiPerGuard efficiency framing in the Ellendale item against the press release before it goes out.')]),
        Bullet([T('Heads-up on the Tech Briefs item: ABB Robotics is being divested to SoftBank, with close expected mid-to-late 2026 and the division already reported as discontinued operations. Worth a check with Comms on whether we want to feature robotics in a U.S. policy newsletter right now.')]),
        Bullet([T('Smithsonian image rights and any required approval on how we characterize the partnership.')]),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(process.argv[2] || 'out.docx', buf);
  console.log('written');
});
