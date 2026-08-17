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
  title: 'ABB in Action Newsletter — August 2026 Draft',
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
          T('ABB in Action: Powering the Smithsonian for America’s 250th, Accelerate America 250+ Hits the Road, AI Data Centers in North Dakota, and More'),
        ]),
        Blank(),

        // ── Note from ABB Team (headliner: Smithsonian) ─────────────
        Label('[Note from ABB Team]'),
        P([
          T('One hundred fifty years ago, America celebrated its 100th birthday with the Centennial Exhibition in Philadelphia – a showcase of what the country could build. The Smithsonian brought those collections home to Washington and put up a building to hold them: the Arts and Industries Building, opened in 1881 and still the second-oldest structure on the Smithsonian campus. As the nation marks 250 years, ABB '),
          Link(
            'modernized the building’s electrical systems',
            'https://new.abb.com/news/detail/136933/abb-modernizes-smithsonians-electrical-systems-as-the-united-states-marks-250-years'
          ),
          T(' so it could open its doors again.'),
        ]),
        Blank(),
        P([
          T('ABB retrofitted the building’s switchgear with custom-engineered circuit breakers featuring integral fusing, tailored to the site’s fault-current protection requirements and to the higher operational demand that comes with a full public program. The breakers were manufactured at ABB’s U.S. Electrification Service factory in Florence, South Carolina. The work also strengthened system protection so it responds faster to faults, added updated labeling and safety features for personnel working near energized equipment, and introduced integrated monitoring and data tools that give the Smithsonian’s facilities team continuous visibility into system performance.'),
        ]),
        Blank(),
        P([
          T('“It’s been a complex project involving some agile thinking and great collaboration between our team and that of the Smithsonian,” said Pedro Robredo, Senior Vice President of Electrification Service – Americas Region, ABB. “We were delighted to have a role in strengthening the critical infrastructure of one of the country’s most prestigious institutions, and at such a significant time.”'),
        ]),
        Blank(),
        P([
          T('The Arts and Industries Building is open for a four-month run hosting the '),
          T('Voices and Votes', { italics: true }),
          T(' exhibition, the Folklife Marketplace, and the '),
          T('For the Common Good: Smithsonian Voices on Our Shared Future 250', { italics: true }),
          T(' conversation series. The building that was raised to hold the artifacts of America’s 100th birthday is now powering its 250th – on equipment built by American workers in South Carolina.'),
        ]),
        Blank(),
        ImageSlot('[IMAGE TBD]'),
        Caption('[Caption TBD]'),
        Blank(),

        // ── Features ────────────────────────────────────────────────
        Label('[Features]'),

        Head('Watts Brewing: Inside the AI Data Center Rising in Ellendale, North Dakota'),
        P([
          T('In the latest episode of '),
          T('Watts Brewing', { italics: true }),
          T(' [LINK TBD]', { italics: true }),
          T(', ABB Electrification Business Area President Giampiero Frisio traveled to Ellendale, North Dakota, to walk the Applied Digital campus with Chief Development Officer Todd Gale. Their conversation covers why AI is being called this generation’s space race, what it actually takes to build data centers fast enough to keep up with demand, and how the right partnerships get AI-ready infrastructure delivered faster.'),
        ]),
        Blank(),
        P([
          T('Polaris Forge 1 is a 400 MW AI factory campus in Dickey County, and ABB has supplied the power backbone since the '),
          Link(
            'partnership was announced',
            'https://new.abb.com/news/detail/126792/abb-and-applied-digital-accelerate-ai-ready-data-centers'
          ),
          T('. At the center of it is ABB’s HiPerGuard medium-voltage static UPS, purpose-built for the power profiles of AI and high-performance computing workloads. Shifting the architecture from low voltage to medium voltage lets the campus scale in 25 MW blocks with less cabling and fewer conversion points, which raises power density and energy efficiency while compressing the electrical plant footprint. Fewer conversion points also means fewer things that can fail. The first of three contracted buildings at the campus is now fully energized at 100 MW.'),
        ]),
        Blank(),
        P([
          T('The two companies have since expanded the partnership to a second North Dakota site – Polaris Forge 2, a 300 MW campus near Harwood phased across two buildings coming online in 2026 and 2027. That efficiency is the whole point in a state where you cannot simply order up new generation. For rural counties of a few thousand people, it also means construction jobs, permanent operations jobs, and a tax base that did not exist five years ago.'),
        ]),
        Blank(),
        ImageSlot('[IMAGE TBD]'),
        Caption('ABB Electrification Business Area President Giampiero Frisio and Applied Digital Chief Development Officer Todd Gale at Applied Digital’s Polaris Forge 1 campus in Ellendale, North Dakota'),
        Blank(),

        Head('The Accelerate America 250+ Tour Brings ABB Technology Coast to Coast'),
        P([
          T('ABB’s '),
          Link(
            'Engineered for America',
            'https://new.abb.com/news/detail/135260/engineered-for-america-showcasing-abbs-growing-investment-in-us-manufacturing'
          ),
          T(' series has spent 2026 spotlighting the people and plants behind ABB’s U.S. footprint, led by the $100 million investment in the New Berlin, Wisconsin campus and building on roughly $500 million invested in U.S. manufacturing and R&D from 2022 to 2024. For the nation’s 250th, that story is going on the road. The Accelerate America 250+ Tour is a coast-to-coast journey putting ABB’s current and next-generation electrification and automation technology in front of the customers, workforce partners, and communities who rarely get to see the factory floor behind the equipment they rely on.'),
        ]),
        Blank(),
        P([
          T('The tour opened in Chicago in the spring and runs through the fall, with stops in Indianapolis, Las Vegas, Columbus, and Spokane. Roughly 75–80% of what ABB sells in the U.S. is made in the U.S. – the tour is built to make that concrete, one stop at a time.'),
        ]),
        Blank(),
        ImageSlot('[IMAGE TBD]'),
        Caption('[Caption TBD]'),
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
        Bullet([
          T('June 2026 | Control Global: '),
          Link(
            'ABB’s Grinding Connect service improves grinding asset visibility in process plants',
            'https://www.controlglobal.com/industry-news/news/55395818/abb-abbs-grinding-connect-service-improves-grinding-asset-visibility-in-process-plants'
          ),
        ]),
        Bullet(
          [
            T('Drawing on ABB’s experience across more than 160 gearless mill drive projects worldwide, the new digital service suite gives mineral processing operators one place to see asset condition, review service records, and reach ABB experts – with anomaly detection, frozen-signal detection, and the AI-powered GMD Copilot assistant. Unplanned downtime at these sites can run as high as $500,000 per hour, making reliability a direct input to the domestic critical minerals supply chain.'),
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
            T('ABB Robotics and California-based PSYONIC are pairing PSYONIC’s Ability Hand with an ABB GoFa™ cobot, training robots on real-world touch and motion data from human prosthetic users rather than simulation alone. As ABB Robotics President Marc Segura put it, “as we develop the next generation physical AI, robots will learn and understand the world as we do.”'),
          ],
          1
        ),
        Blank(),

        // ── Looking Ahead ───────────────────────────────────────────
        Label('[Looking Ahead]'),
        P([T('Be on the lookout for future ABB at events connecting leaders on electrification and manufacturing:')]),
        Bullet([
          T('Accelerate America 250+ Tour'),
          T(': ABB’s coast-to-coast showcase of electrification and automation innovation | Indianapolis, Indiana (September 25–28); Las Vegas, Nevada (September 28–30 and October 4–7); Columbus, Ohio (October 22–24); Spokane, Washington (October 26–29)'),
        ]),
        Bullet([
          Link('Climate Week NYC', 'https://www.climateweeknyc.org/'),
          T(': Thought leadership conference convening business, government, and civil society on climate action | New York City, New York (September 2026)'),
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
