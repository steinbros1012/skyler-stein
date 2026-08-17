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

// centered placeholder standing in for an image
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

// editorial note for the team — gray so it is easy to spot and delete
const Note = (text) => P([T(text, { italics: true, color: '808080' })]);
const NoteBullet = (text, level = 1) =>
  Bullet([T(text, { italics: true, color: '808080' })], level);

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
          T('As the United States marks 250 years, one of the country’s most recognizable institutions is running on newly modernized, American-made electrical infrastructure. ABB '),
          Link(
            'upgraded the critical power systems',
            'https://new.abb.com/news/detail/136933/abb-modernizes-smithsonians-electrical-systems-as-the-united-states-marks-250-years'
          ),
          T(' at the Smithsonian Institution’s Arts and Industries Building in Washington, D.C. – the museum’s second-oldest structure, opened in 1881 as a showcase for American invention – ahead of the building’s reopening to the public for the semiquincentennial.'),
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
          T(' conversation series. Nearly 150 years after it first opened its doors to show the country what America could build, the building is doing it again – this time powered by equipment built by American workers in South Carolina.'),
        ]),
        Blank(),
        ImageSlot('[IMAGE TK: Arts and Industries Building exterior, or ABB crew on site — confirm Smithsonian image rights before use]'),
        Caption('[Caption TK: names and titles of anyone pictured, per house style]'),
        Blank(),

        // ── Features ────────────────────────────────────────────────
        Label('[Features]'),

        Head('Watts Brewing: Inside the AI Data Center Rising in Ellendale, North Dakota'),
        P([
          T('In the latest episode of '),
          T('Watts Brewing', { italics: true }),
          T(' [LINK TK]', { italics: true, color: '808080' }),
          T(', ABB Electrification President Giampiero Frisio traveled to Ellendale, North Dakota, to walk the Applied Digital campus with Chief Development Officer Todd Gale. Their conversation covers why AI is being called this generation’s space race, what it actually takes to build data centers fast enough to keep up with demand, and how the right partnerships get AI-ready infrastructure delivered faster.'),
        ]),
        Blank(),
        P([
          T('The Ellendale campus is a 400 MW greenfield build in Dickey County, and ABB is supplying the power backbone under an '),
          Link(
            'expanded partnership with Applied Digital',
            'https://new.abb.com/news/detail/131324/abb-expands-power-technology-partnership-with-applied-digital-for-ai-ready-data-centers'
          ),
          T(', anchored by the HiPerGuard medium-voltage static UPS – the first power system built specifically for AI-scale data centers. Shifting the architecture from low voltage to medium voltage lets the campus scale in 25 MW blocks with fewer conversion points and less cabling, which raises power density and energy efficiency while compressing the electrical plant footprint. Fewer conversion points also means fewer things that can fail.'),
        ]),
        Blank(),
        P([
          T('That efficiency is the whole point in a state where you cannot simply order up new generation. For a rural county of a few thousand people, it also means construction jobs, permanent operations jobs, and a tax base that did not exist five years ago.'),
        ]),
        Blank(),
        ImageSlot('[IMAGE TK: still from the Watts Brewing episode — Frisio and Gale on the Ellendale campus]'),
        Caption('ABB Electrification Business Area President Giampiero Frisio and Applied Digital Chief Development Officer Todd Gale at Applied Digital’s AI data center campus in Ellendale, North Dakota'),
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
          T('Fall stops include Indianapolis (September 25–28), Las Vegas (September 28–30 and October 4–7), Columbus (October 22–24), and Spokane (October 26–29), following an earlier stop in Chicago in May. Roughly 75–80% of what ABB sells in the U.S. is made in the U.S. – the tour is built to make that concrete, one stop at a time.'),
        ]),
        Blank(),
        Note('[DRAFTING NOTE: Tour name and coast-to-coast framing are confirmed. The stop list above came from a secondary source and needs a check against the official schedule — please confirm cities, dates, and whether any of these are co-located with trade shows. Also send me the tour landing page URL and I will hyperlink the name, plus any spokespeople, hiring/training announcements, or elected officials attending, and I will work them in.]'),
        Blank(),
        ImageSlot('[IMAGE TK: tour vehicle, exhibit floor, or employee photo from a stop]'),
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
        NoteBullet(
          '[CONFIRM: this is the June 4 hit — the last issue already ran the April 22 CNBC interview, so this is the next one up. If you meant a Q2 earnings interview from the week of July 16, I could not find it in search; send the link and I will swap it in. Record $12B orders and the $5.5B Rotork acquisition would give us a stronger investment hook.]'
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
        ImageSlot('[CLOSING GRAPHIC TK: the last issue closed on the NASCAR San Diego promo, which is now stale. Suggest an Accelerate America 250+ Tour banner.]'),
        Blank(),
        Blank(),

        // ── Open items ──────────────────────────────────────────────
        Label('[Open Items — delete before send]'),
        Bullet([T('Send date for the masthead.')]),
        Bullet([T('Watts Brewing Ellendale episode link — it is referenced in Giampiero’s LinkedIn post but I could not surface the URL.')]),
        Bullet([T('Accelerate America 250+ Tour: confirm the stop list and dates against the official schedule, and send the tour landing page so I can link it.')]),
        Bullet([T('Confirm the CNBC hit (June 4 vs. a Q2 earnings interview I could not locate).')]),
        Bullet([
          T('Sourcing flag on the Ellendale feature: HiPerGuard is designed and largely produced in Napier, New Zealand. The efficiency and jobs framing holds, but we should not let it read as an American-manufacturing example the way the Smithsonian and New Berlin items do.'),
        ]),
        Bullet([
          T('Heads-up on the Tech Briefs item: ABB Robotics is being divested to SoftBank, close expected mid-to-late 2026, and the division is already reported as discontinued operations. Worth a check with Comms on whether we want to feature robotics in a U.S. policy newsletter right now.'),
        ]),
        Bullet([T('Smithsonian image rights, and confirm the Robredo title as written.')]),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(process.argv[2] || 'out.docx', buf);
  console.log('written');
});
