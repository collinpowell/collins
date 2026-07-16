const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, ShadingType, BorderStyle, HeadingLevel, AlignmentType,
  Numbering, LevelFormat, convertInchesToTwip
} = require("docx");

const PAGE_WIDTH_DXA = 11906; // A4
const MARGIN = 720;
const CONTENT_WIDTH = PAGE_WIDTH_DXA - MARGIN * 2;

function noBorders() {
  return {
    top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  };
}

function headerCell(children, width, alignment) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders: noBorders(),
    children,
  });
}

function bullet(text) {
  return new Paragraph({
    text,
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: 60 },
  });
}

function sectionHeading(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 22, color: "1F4E5F" })],
    spacing: { before: 240, after: 100 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: "1F4E5F", space: 2 },
    },
  });
}

function skillCol(title, lines) {
  const paras = [
    new Paragraph({
      children: [new TextRun({ text: title, bold: true, size: 20 })],
      spacing: { after: 60 },
    }),
  ];
  lines.forEach((l) =>
    paras.push(new Paragraph({ text: l, spacing: { after: 40 }, run: { size: 19 } }))
  );
  return paras;
}

const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: "\u2022",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 360, hanging: 260 } } },
          },
        ],
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: PAGE_WIDTH_DXA, height: 16838 },
          margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
        },
      },
      children: [
        new Table({
          width: { size: CONTENT_WIDTH, type: WidthType.DXA },
          columnWidths: [Math.round(CONTENT_WIDTH * 0.6), Math.round(CONTENT_WIDTH * 0.4)],
          rows: [
            new TableRow({
              children: [
                headerCell(
                  [
                    new Paragraph({
                      children: [new TextRun({ text: "COLLINS KRUBU", bold: true, size: 32 })],
                    }),
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: "Embedded Systems / IoT-Entwickler",
                          bold: true,
                          size: 22,
                          color: "1F4E5F",
                        }),
                      ],
                      spacing: { after: 40 },
                    }),
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: "Bewerbung: Ausbildung Fachinformatiker Anwendungsentwicklung (m/w/d)",
                          italics: true,
                          size: 19,
                        }),
                      ],
                      spacing: { after: 60 },
                    }),
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: "C/C++ · Arduino · ESP32 · FreeRTOS · PlatformIO · IoT · Cloud-Anbindung",
                          size: 18,
                        }),
                      ],
                    }),
                  ],
                  Math.round(CONTENT_WIDTH * 0.6)
                ),
                headerCell(
                  [
                    new Paragraph({ text: "collinskrubu723@gmail.com", alignment: AlignmentType.RIGHT, run: { size: 18 } }),
                    new Paragraph({ text: "+234 8107111396", alignment: AlignmentType.RIGHT, run: { size: 18 } }),
                    new Paragraph({ text: "github.com/collinpowell", alignment: AlignmentType.RIGHT, run: { size: 18 } }),
                    new Paragraph({ text: "linkedin.com/in/collins-krubu", alignment: AlignmentType.RIGHT, run: { size: 18 } }),
                    new Paragraph({ text: "Port Harcourt, Nigeria", alignment: AlignmentType.RIGHT, run: { size: 18 } }),
                    new Paragraph({ text: "Umzugsbereit nach Deutschland (Berlin)", alignment: AlignmentType.RIGHT, run: { size: 18 } }),
                  ],
                  Math.round(CONTENT_WIDTH * 0.4)
                ),
              ],
            }),
          ],
        }),

        new Paragraph({ spacing: { before: 200 }, text: "" }),

        new Paragraph({
          children: [
            new TextRun({
              text:
                "Softwareentwickler mit 6+ Jahren praktischer Erfahrung, davon mit klarem Schwerpunkt auf eingebetteten Systemen und IoT. Als Mitgründer und technischer Leiter von NodeX iHub habe ich ESP32-basierte Smart-Home-Geräte, ein sensorgesteuertes Bewässerungssystem für die Landwirtschaft sowie ein münzbetriebenes Verkaufsgerät entwickelt und produktiv eingesetzt. Ich bin mit der gesamten Produktkette eines eingebetteten Systems vertraut: C/C++-Firmware, FreeRTOS-Task-Scheduling, Sensor-/Aktor-Integration sowie – unüblich für einen Embedded-Entwickler – die Cloud- und Backend-Ebene, die Geräte mit Apps und Dashboards verbindet. Mit dieser Bewerbung möchte ich meine praktische Erfahrung mit einer staatlich anerkannten Qualifikation als Fachinformatiker ergänzen.",
              size: 20,
            }),
          ],
          spacing: { after: 100 },
        }),

        sectionHeading("KERNKOMPETENZEN"),
        new Table({
          width: { size: CONTENT_WIDTH, type: WidthType.DXA },
          columnWidths: [Math.round(CONTENT_WIDTH * 0.5), Math.round(CONTENT_WIDTH * 0.5)],
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: Math.round(CONTENT_WIDTH * 0.5), type: WidthType.DXA },
                  borders: noBorders(),
                  margins: { right: 200 },
                  children: skillCol("Embedded / Firmware", [
                    "C / C++ — Firmwareentwicklung, Register- und Treiberebene",
                    "Arduino, ESP32 — Mikrocontroller-Programmierung, Prototyping",
                    "PlatformIO — Build- und Toolchain-Verwaltung",
                    "FreeRTOS — Task-Scheduling, Nebenläufigkeit auf ressourcenbeschränkten Geräten",
                    "Sensor- und Aktorintegration — Echtzeit-Datenerfassung, Regelkreise",
                  ]),
                }),
                new TableCell({
                  width: { size: Math.round(CONTENT_WIDTH * 0.5), type: WidthType.DXA },
                  borders: noBorders(),
                  children: skillCol("IoT & Konnektivität", [
                    "Hardware-zu-Cloud-Datenpipelines — Echtzeit-Telemetrie, Fernsteuerung",
                    "Drahtlose Konnektivität (WLAN-basiert, ESP32)",
                    "REST, MQTT — Anbindung von Geräten und Backends",
                    "Integration von Hardware-Zahlungs-/Münzmechanismen",
                    "Durchgängige Produktentwicklung — von Firmware bis Companion-App",
                  ]),
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  width: { size: Math.round(CONTENT_WIDTH * 0.5), type: WidthType.DXA },
                  borders: noBorders(),
                  margins: { right: 200 },
                  children: skillCol("Cloud & Software (ergänzend)", [
                    "React / Next.js, TypeScript, Node.js — Companion-Apps, Dashboards",
                    "AWS, Docker, Kubernetes — Cloud-Infrastruktur für vernetzte Geräte",
                    "PostgreSQL, MongoDB — Telemetrie- und Gerätestatusdaten",
                    "CI/CD — GitHub Actions, GitLab CI",
                  ]),
                }),
                new TableCell({
                  width: { size: Math.round(CONTENT_WIDTH * 0.5), type: WidthType.DXA },
                  borders: noBorders(),
                  children: skillCol("Arbeitsweise & Zusammenarbeit", [
                    "KI-unterstützte Entwicklung — Claude, GitHub Copilot",
                    "Mentoring — Grundlagen eingebetteter Systeme",
                    "Teamführung — Mitgründung und Leitung eines 5-köpfigen Teams",
                    "Agile/Scrum — Sprintplanung, Code-Reviews, Retrospektiven",
                  ]),
                }),
              ],
            }),
          ],
        }),

        sectionHeading("BERUFSERFAHRUNG"),

        new Paragraph({
          children: [
            new TextRun({ text: "NodeX iHub", bold: true, size: 21 }),
            new TextRun({ text: "  —  Mitgründer & Embedded-Systems-Entwickler", size: 20 }),
          ],
          spacing: { before: 120 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "2020 – 2023 · Warri, Nigeria", italics: true, size: 18 })],
          spacing: { after: 60 },
        }),
        bullet("Mitgründung eines Studios für eingebettete Systeme und IoT-Produkte; Leitung eines Entwicklerteams beim Bau hardware-integrierter Produkte — von der Firmware bis zur cloud-vernetzten App."),
        bullet("Entwicklung ESP32-basierter Smart-Home-Geräte (intelligente Steckdosen, intelligente Umschalter) in C/C++ mit PlatformIO, inklusive Fernüberwachung und -steuerung über eine Companion-App."),
        bullet("Aufbau eines sensorgesteuerten Bewässerungssystems für die Landwirtschaft auf ESP32-Mikrocontrollern; Einsatz von FreeRTOS zur Verwaltung paralleler Sensorabfragen, Konnektivität und Aktorik in Echtzeit."),
        bullet("Entwicklung eines münzbetriebenen Verkaufsgeräts (Snooker-Automat) mit Integration eines Hardware-Zahlungs-/Münzmechanismus."),
        bullet("Anbindung eingebetteter Geräte an Cloud-Backends für Telemetrie und Fernsteuerung unter Nutzung von Full-Stack-Erfahrung (Node.js, React, AWS)."),
        bullet("Betreuung und Mentoring von Entwicklern und Studierenden in den Grundlagen eingebetteter Systeme sowie Code-Reviews und CI/CD-Praktiken."),

        new Paragraph({
          children: [new TextRun({ text: "Ergänzende Full-Stack-Erfahrung", bold: true, size: 20 })],
          spacing: { before: 160, after: 60 },
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "Lupply", bold: true, size: 20 }),
            new TextRun({ text: "  —  Gründer & Engineering Lead  ·  2019 – heute  ·  Remote", size: 18 }),
          ],
          spacing: { after: 40 },
        }),
        bullet("Gründung und Leitung einer Commerce-SaaS-Suite (POS, Marktplatz, Essenslieferung, Logistik) — TypeScript, React, Node.js, Go, Docker, Kubernetes, AWS. Über 40.445 Bestellungen auf Web, iOS, Android und Windows verarbeitet."),

        new Paragraph({
          children: [
            new TextRun({ text: "Luna Finance", bold: true, size: 20 }),
            new TextRun({ text: "  —  Backend-Entwickler  ·  Vertrag  ·  Remote", size: 18 }),
          ],
          spacing: { before: 100, after: 40 },
        }),
        bullet("Entwicklung von REST-APIs für eine Fintech-Plattform mit 300.000+ Nutzern; Reduzierung der Antwortzeiten um 80 % durch Query-Optimierung und Caching."),

        sectionHeading("SCHULBILDUNG & STUDIUM"),
        new Paragraph({
          children: [
            new TextRun({ text: "Federal University of Petroleum Resources (FUPRE), Warri", bold: true, size: 20 }),
            new TextRun({ text: "  ·  2017 – 2022", size: 18 }),
          ],
        }),
        new Paragraph({
          children: [new TextRun({ text: "BSc Informatik (Computer Science) · Abschlussnote: 2nd Class Upper", italics: true, size: 19 })],
          spacing: { after: 40 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "Hinweis: Abschlusszeugnis/Transkript der Universität liegt derzeit noch nicht vor und wird nachgereicht, sobald verfügbar. WAEC- und NECO-Abschlusszeugnisse (weiterführende Schule) liegen vor und können jederzeit vorgelegt werden.",
              italics: true,
              size: 18,
              color: "555555",
            }),
          ],
          spacing: { after: 60 },
        }),

        sectionHeading("SPRACHEN"),
        new Paragraph({ text: "Englisch — Muttersprache / verhandlungssicher", spacing: { after: 40 }, run: { size: 20 } }),
        new Paragraph({
          children: [
            new TextRun({ text: "Deutsch — A1 (aktueller Stand). ", size: 20 }),
            new TextRun({
              text: "Intensives, tägliches Selbststudium; Ziel: zertifiziertes B1/B2-Niveau (Goethe-Institut) bis Mitte 2027, rechtzeitig vor geplantem Ausbildungsbeginn.",
              size: 20,
            }),
          ],
          spacing: { after: 60 },
        }),

        sectionHeading("VERFÜGBARKEIT"),
        new Paragraph({
          children: [
            new TextRun({ text: "✅ Umzugsbereit nach Deutschland (Berlin)   ✅ Ausbildungsbeginn flexibel, ab 2027   ✅ Vollzeit", size: 19 }),
          ],
        }),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  require("fs").writeFileSync(__dirname + "/Collins_Krubu_Lebenslauf_Ausbildung_Embedded.docx", buf);
  console.log("done");
});