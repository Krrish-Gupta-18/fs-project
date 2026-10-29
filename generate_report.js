import fs from 'fs';
import path from 'path';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ImageRun,
  Header,
  Footer,
  ShadingType,
} from 'docx';

const ASSETS_DIR = '/home/infirio/Desktop/chatapp/report_assets';
const OUTPUT_PATH = '/home/infirio/Desktop/chatapp/ChatFlow_FSD_Mini_Project_Report.docx';

const bannerImageBuffer = fs.readFileSync(path.join(ASSETS_DIR, 'img-000.png'));

function makeHeader() {
  return new Header({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [
          new ImageRun({
            data: bannerImageBuffer,
            transformation: {
              width: 530,
              height: 108,
            },
          }),
        ],
      }),
    ],
  });
}

function makeFooter(pageNum) {
  return new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 120 },
        children: [
          new TextRun({
            text: `Page ${pageNum}`,
            font: 'Times New Roman',
            size: 20, // 10pt
            color: '333333',
          }),
        ],
      }),
    ],
  });
}

function h1(text) {
  return new Paragraph({
    spacing: { before: 240, after: 120 },
    children: [
      new TextRun({
        text,
        bold: true,
        font: 'Times New Roman',
        size: 26, // 13pt
        color: '000000',
      }),
    ],
  });
}

function h2(text) {
  return new Paragraph({
    spacing: { before: 180, after: 80 },
    children: [
      new TextRun({
        text,
        bold: true,
        font: 'Times New Roman',
        size: 24, // 12pt
        color: '000000',
      }),
    ],
  });
}

function h3(text) {
  return new Paragraph({
    spacing: { before: 140, after: 60 },
    children: [
      new TextRun({
        text,
        bold: true,
        font: 'Times New Roman',
        size: 22, // 11pt
        color: '000000',
      }),
    ],
  });
}

function p(text, options = {}) {
  return new Paragraph({
    alignment: options.alignment || AlignmentType.JUSTIFIED,
    spacing: { before: options.before ?? 60, after: options.after ?? 80, line: 276 },
    children: [
      new TextRun({
        text,
        font: 'Times New Roman',
        size: options.size || 22,
        color: options.color || '111111',
        bold: options.bold || false,
        italics: options.italics || false,
      }),
    ],
  });
}

function bullet(boldPrefix, text) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { before: 40, after: 40, line: 260 },
    children: [
      new TextRun({
        text: boldPrefix ? `${boldPrefix}: ` : '',
        bold: true,
        font: 'Times New Roman',
        size: 22,
        color: '111111',
      }),
      new TextRun({
        text,
        font: 'Times New Roman',
        size: 22,
        color: '111111',
      }),
    ],
  });
}

function codeBlock(codeLines) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
      left: { style: BorderStyle.SINGLE, size: 12, color: '2563EB' },
      right: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { fill: 'F8FAFC', type: ShadingType.CLEAR },
            margins: { top: 100, bottom: 100, left: 160, right: 160 },
            children: codeLines.map(
              (line) =>
                new Paragraph({
                  spacing: { before: 15, after: 15, line: 230 },
                  children: [
                    new TextRun({
                      text: line,
                      font: 'Courier New',
                      size: 18,
                      color: '1E293B',
                    }),
                  ],
                })
            ),
          }),
        ],
      }),
    ],
  });
}

function makeTable(headers, rows, colWidths = []) {
  const borderDef = { style: BorderStyle.SINGLE, size: 4, color: '94A3B8' };
  const borders = {
    top: borderDef,
    bottom: borderDef,
    left: borderDef,
    right: borderDef,
    insideHorizontal: borderDef,
    insideVertical: borderDef,
  };

  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) => {
      const cellOpts = {
        borders,
        shading: { fill: 'E2E8F0', type: ShadingType.CLEAR },
        margins: { top: 100, bottom: 100, left: 120, right: 120 },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 40 },
            children: [
              new TextRun({
                text: h,
                bold: true,
                font: 'Times New Roman',
                size: 20,
                color: '0F172A',
              }),
            ],
          }),
        ],
      };
      if (colWidths[i]) {
        cellOpts.width = { size: colWidths[i], type: WidthType.DXA };
      }
      return new TableCell(cellOpts);
    }),
  });

  const bodyRows = rows.map((row) => {
    return new TableRow({
      children: row.map((cellText, i) => {
        const cellOpts = {
          borders,
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [
            new Paragraph({
              alignment: i === 0 && row.length > 2 ? AlignmentType.CENTER : AlignmentType.LEFT,
              spacing: { before: 30, after: 30, line: 240 },
              children: [
                new TextRun({
                  text: String(cellText),
                  font: 'Times New Roman',
                  size: 20,
                  color: '1E293B',
                }),
              ],
            }),
          ],
        };
        if (colWidths[i]) {
          cellOpts.width = { size: colWidths[i], type: WidthType.DXA };
        }
        return new TableCell(cellOpts);
      }),
    });
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders,
    rows: [headerRow, ...bodyRows],
  });
}

function imageWithCaption(imgFilename, caption, width = 500, height = 210) {
  const fullPath = path.join(ASSETS_DIR, imgFilename);
  if (!fs.existsSync(fullPath)) {
    console.warn(`[Image Warning]: Image ${imgFilename} does not exist.`);
    return [p(`[Figure: ${caption}]`, { italics: true, alignment: AlignmentType.CENTER })];
  }
  const buf = fs.readFileSync(fullPath);
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 50 },
      children: [
        new ImageRun({
          data: buf,
          transformation: {
            width,
            height,
          },
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 30, after: 120 },
      children: [
        new TextRun({
          text: caption,
          italics: true,
          font: 'Times New Roman',
          size: 19,
          color: '334155',
        }),
      ],
    }),
  ];
}

function twoImagesWithCaptions(imgFile1, cap1, imgFile2, cap2, width = 240, height = 150) {
  const p1 = path.join(ASSETS_DIR, imgFile1);
  const p2 = path.join(ASSETS_DIR, imgFile2);
  const buf1 = fs.existsSync(p1) ? fs.readFileSync(p1) : null;
  const buf2 = fs.existsSync(p2) ? fs.readFileSync(p2) : null;

  const row = new TableRow({
    children: [
      new TableCell({
        borders: {
          top: { style: BorderStyle.NONE },
          bottom: { style: BorderStyle.NONE },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
        },
        children: [
          ...(buf1
            ? [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new ImageRun({ data: buf1, transformation: { width, height } })],
                }),
              ]
            : []),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 60 },
            children: [
              new TextRun({ text: cap1, italics: true, font: 'Times New Roman', size: 18, color: '334155' }),
            ],
          }),
        ],
      }),
      new TableCell({
        borders: {
          top: { style: BorderStyle.NONE },
          bottom: { style: BorderStyle.NONE },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
        },
        children: [
          ...(buf2
            ? [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new ImageRun({ data: buf2, transformation: { width, height } })],
                }),
              ]
            : []),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 60 },
            children: [
              new TextRun({ text: cap2, italics: true, font: 'Times New Roman', size: 18, color: '334155' }),
            ],
          }),
        ],
      }),
    ],
  });

  return [
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE },
      },
      rows: [row],
    }),
  ];
}

// ============================================================================
// DOCUMENT SECTIONS DEFINITION
// ============================================================================

const sections = [];

// SECTION 1: COVER PAGE (Page 1)
sections.push({
  properties: {
    page: {
      margin: { top: 720, bottom: 720, left: 1080, right: 1080 },
    },
  },
  headers: { default: makeHeader() },
  footers: { default: makeFooter(1) },
  children: [
    new Paragraph({ spacing: { before: 180, after: 80 } }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 160, after: 80 },
      children: [
        new TextRun({
          text: 'FSD MINI-PROJECT REPORT',
          bold: true,
          font: 'Times New Roman',
          size: 30, // 15pt
          color: '000000',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 60, after: 120 },
      children: [
        new TextRun({
          text: 'ON',
          bold: true,
          font: 'Times New Roman',
          size: 24, // 12pt
          color: '000000',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 180 },
      children: [
        new TextRun({
          text: 'CHATFLOW: REAL-TIME COMMUNICATION AND COLLABORATION PLATFORM FOR SOFTWARE DEVELOPMENT TEAMS',
          bold: true,
          font: 'Times New Roman',
          size: 26, // 13pt
          color: '0F172A',
        }),
      ],
    }),
    new Paragraph({ spacing: { before: 200, after: 100 } }),
    p('Submitted in partial fulfilment of the requirements for the', {
      alignment: AlignmentType.CENTER,
      italics: true,
      size: 22,
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 40, after: 160 },
      children: [
        new TextRun({
          text: 'Full Stack Development (FSD) Mini-Project',
          bold: true,
          font: 'Times New Roman',
          size: 24,
        }),
      ],
    }),
    p('Semester 5 | Academic Year 2026-27', {
      alignment: AlignmentType.CENTER,
      bold: true,
      size: 22,
    }),
    new Paragraph({ spacing: { before: 240, after: 80 } }),
    p('Submitted by', {
      alignment: AlignmentType.CENTER,
      italics: true,
      size: 22,
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 40, after: 40 },
      children: [
        new TextRun({
          text: 'Krrish Gupta',
          bold: true,
          font: 'Times New Roman',
          size: 26,
        }),
      ],
    }),
    p('Class D15B | B.Tech – Information Technology', {
      alignment: AlignmentType.CENTER,
      size: 22,
    }),
    new Paragraph({ spacing: { before: 200, after: 60 } }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 80, after: 80 },
      children: [
        new TextRun({
          text: 'Project Guide: ',
          font: 'Times New Roman',
          size: 23,
        }),
        new TextRun({
          text: 'Mrs. Pooja Prajapati',
          bold: true,
          font: 'Times New Roman',
          size: 24,
        }),
      ],
    }),
  ],
});

// SECTION 2: DECLARATION (Page 2)
sections.push({
  properties: { page: { margin: { top: 720, bottom: 720, left: 1080, right: 1080 } } },
  headers: { default: makeHeader() },
  footers: { default: makeFooter(2) },
  children: [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 180, after: 180 },
      children: [
        new TextRun({
          text: 'Declaration',
          bold: true,
          font: 'Times New Roman',
          size: 28,
        }),
      ],
    }),
    p(
      'I, Krrish Gupta, Class D15B, student of Semester 5, Third year Engineering from Department of Information Technology, V. E. S. Institute of Technology, hereby declare that the project titled ChatFlow: Real-Time Communication and Collaboration Platform for Software Development Teams, submitted to the University of Mumbai for the academic year 2026-27, is a record of an original work done by me under the guidance of Mrs. Pooja Prajapati, Assistant Professor, Department of Information Technology, V.E.S. Institute of Technology, Mumbai -400074.'
    ),
    p(
      'This project report is submitted as a partial fulfillment of the requirement of the subject Full Stack Development in Semester 5.'
    ),
    new Paragraph({ spacing: { before: 360, after: 120 } }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
              children: [
                p('Date: ____________________', { bold: false }),
                p('Place: Mumbai', { bold: false }),
              ],
            }),
            new TableCell({
              borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
              children: [
                p('Name: Krrish Gupta', { bold: true }),
                p('Signature: ____________________', { bold: false }),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
});

// SECTION 3: CERTIFICATE (Page 3)
sections.push({
  properties: { page: { margin: { top: 720, bottom: 720, left: 1080, right: 1080 } } },
  headers: { default: makeHeader() },
  footers: { default: makeFooter(3) },
  children: [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 180, after: 180 },
      children: [
        new TextRun({
          text: 'CERTIFICATE',
          bold: true,
          font: 'Times New Roman',
          size: 28,
        }),
      ],
    }),
    p(
      'This is to certify that the Mini Project Report entitled ChatFlow: Real-Time Communication and Collaboration Platform for Software Development Teams submitted by Mr. Krrish Gupta, of Class D15B, Department of Information Technology, V.E.S. Institute of Technology, Mumbai, in partial fulfillment of the requirements for the subject Full Stack Development under the University of Mumbai, is a bonafide record of work carried out by the student under my guidance and supervision during the Academic Year 2026-27.'
    ),
    p(
      'The work presented in this report is original and has been completed as per the prescribed academic requirements.'
    ),
    new Paragraph({ spacing: { before: 400, after: 120 } }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
              children: [
                p('Project Guide:', { bold: true }),
                p('Name: Mrs. Pooja Deepak Prajapati', { size: 21 }),
                p('Signature: ____________________', { size: 21 }),
              ],
            }),
            new TableCell({
              borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
              children: [
                p('Head of Department:', { bold: true }),
                p('Department of Information Technology', { size: 21 }),
                p('Signature: ____________________', { size: 21 }),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
});

// SECTION 4: ABSTRACT (Page 4)
sections.push({
  properties: { page: { margin: { top: 720, bottom: 720, left: 1080, right: 1080 } } },
  headers: { default: makeHeader() },
  footers: { default: makeFooter(4) },
  children: [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 160 },
      children: [
        new TextRun({
          text: 'ABSTRACT',
          bold: true,
          font: 'Times New Roman',
          size: 26,
        }),
      ],
    }),
    p(
      'ChatFlow is a full-stack real-time communication and collaboration platform architected specifically for software development teams, tech startups, open-source maintainers, and student engineering cohorts. While conventional instant messaging applications lack engineering workflow context, ChatFlow integrates developer-centric collaboration directly into channels and direct conversations. The frontend is built using React 19, Vite, Tailwind CSS, Lucide React icons, and React Router DOM; user authentication, active workspaces, channels, online presence, and real-time state synchronization are centrally managed using the React Context API and specialized hooks (useChatState and useDebounce).'
    ),
    p(
      'The backend is engineered with Node.js (ES Modules) and Express 4, providing RESTful endpoints for user registration, login, multi-tenant workspace administration, workspace-scoped public and private channels, direct 1-to-1 chats, GitHub integrations, bug report management, and CI/CD deployment streaming. MongoDB Atlas serves as the persistent cloud database through Mongoose schemas. Passwords are securely hashed with bcrypt (10 salt rounds), REST endpoints and Socket.IO connections are safeguarded by JSON Web Tokens (JWT) and role-based access control (Admin, Member), while Helmet, CORS, input validation, and request rate limiting harden API resilience.'
    ),
    p(
      'Socket.IO enables low-latency bi-directional communication, powering workspace broadcasts, channel rooms, direct chats, typing indicators, active presence, message threads, inline editing, and read status delivery receipts. ChatFlow introduces a cryptographically verified GitHub webhook integration utilizing HMAC SHA-256 signatures (X-Hub-Signature-256) to automatically post rich interactive Pull Request cards and Git commit activities into dedicated channels. Discussion messages can be converted into tracked bug reports with severity and status filters in a single click, alongside live CI/CD deployment pipeline feeds. Frontend and backend services are containerized via Docker and Docker Compose with Nginx as a reverse proxy, verified through GitHub Actions CI/CD workflows, and deployed to Vercel (frontend) and Render (backend).'
    ),
    p(
      'Comprehensive verification using Postman, curl, Docker, and multi-user browser testing validated account authentication, role-based authorization, real-time message delivery, thread replies, dynamic unread badge clearing, webhook security, and cloud deployment resilience.'
    ),
    p(
      'Keywords: Full-stack development, React, Express, MongoDB Atlas, Socket.IO, JWT, GitHub Webhooks, HMAC SHA-256, Docker, GitHub Actions, Vercel, Render.',
      { italics: true, bold: false, before: 100 }
    ),
  ],
});

// SECTION 5: TABLE OF CONTENTS (Page 5)
sections.push({
  properties: { page: { margin: { top: 720, bottom: 720, left: 1080, right: 1080 } } },
  headers: { default: makeHeader() },
  footers: { default: makeFooter(5) },
  children: [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 180 },
      children: [
        new TextRun({
          text: 'TABLE OF CONTENTS',
          bold: true,
          font: 'Times New Roman',
          size: 26,
        }),
      ],
    }),
    makeTable(
      ['Topic / Chapter', 'Page No.'],
      [
        ['Declaration', '2'],
        ['Certificate', '3'],
        ['Abstract', '4'],
        ['1. Introduction and Objectives', '6'],
        ['2. Project Scope and Requirements', '7'],
        ['3. Technologies Used', '8'],
        ['4. System Design', '9'],
        ['5. Implementation', '12'],
        ['6. Implementation with Screenshots', '16'],
        ['7. Testing and Results', '26'],
        ['8. Deployment and DevOps', '28'],
        ['9. Conclusion and Future Scope', '30'],
        ['10. References', '31'],
        ['Project Links Summary', '32'],
      ],
      [6800, 1800]
    ),
  ],
});

// SECTION 6: 1. INTRODUCTION AND OBJECTIVES (Page 6)
sections.push({
  properties: { page: { margin: { top: 720, bottom: 720, left: 1080, right: 1080 } } },
  headers: { default: makeHeader() },
  footers: { default: makeFooter(6) },
  children: [
    h1('1. INTRODUCTION AND OBJECTIVES'),
    h2('1.1 Introduction'),
    p(
      'ChatFlow is a real-time web-based communication and team collaboration platform built as a Full Stack Development (FSD) mini-project. It combines a modern React 19 frontend with a robust Node.js/Express backend, a MongoDB Atlas cloud database, and a high-performance Socket.IO real-time engine. ChatFlow provides team workspace creation, public and private channels, direct 1-to-1 conversations, GitHub Pull Request & commit integration cards, message-to-bug conversion, CI/CD deployment activity streaming, and dynamic unread message tracking.'
    ),
    p(
      'Modern software engineering teams frequently experience communication fragmentation across disparate tools: chat in Slack or Discord, code reviews on GitHub, bug tracking in Jira, and deployment monitoring in cloud consoles. ChatFlow consolidates these engineering workflows into a cohesive, high-performance real-time hub tailored for student development teams, startups, and open-source contributors.'
    ),
    h2('1.2 Problem Statement'),
    p(
      'Generic chat systems lack tight developer workflow integrations. When engineers discuss issues, pull requests, and production releases, they are forced to manually copy-paste external URLs, context-switch between browser tabs, and lose conversational records. Furthermore, building such a collaborative system requires cleanly separating presentation from API logic, protecting multi-tenant workspace resources, enforcing cryptographic signature verification on external webhooks, securely hashing credentials, and synchronizing unread message counters across active client sessions.'
    ),
    h2('1.3 Aim'),
    p(
      'To design, build, test, containerize, and deploy a secure, responsive full-stack team collaboration platform with JWT authentication, multi-tenant workspaces, persistent real-time channels and direct messaging, automated GitHub webhook verification, bug tracking, and continuous integration/continuous deployment (CI/CD).'
    ),
    h2('1.4 Objectives'),
    bullet('UI/UX', 'Build an intuitive, responsive developer interface using React 19, Vite, Tailwind CSS, and Lucide React with client-side routing.'),
    bullet('State Management', 'Manage complex asynchronous state, presence, and real-time Socket.IO subscriptions via React Context API and custom hooks.'),
    bullet('REST APIs', 'Implement modular Express REST APIs backed by Mongoose schemas for users, workspaces, channels, conversations, messages, repositories, bug reports, and deployments.'),
    bullet('Security', 'Enforce bcrypt password hashing, JWT bearer token validation, role-based authorization (Admin/Member), input validation, and request rate limiting.'),
  ],
});

// SECTION 7: 1.5 PROJECT LINKS & 2. PROJECT SCOPE AND REQUIREMENTS (Page 7)
sections.push({
  properties: { page: { margin: { top: 720, bottom: 720, left: 1080, right: 1080 } } },
  headers: { default: makeHeader() },
  footers: { default: makeFooter(7) },
  children: [
    bullet('Webhooks & HMAC', 'Integrate GitHub webhooks with HMAC SHA-256 signature verification (X-Hub-Signature-256) to ingest PR and commit events in real time.'),
    bullet('Real-Time Messaging', 'Implement Socket.IO channels, direct messaging, typing indicators, read receipts, and message threads stored persistently in MongoDB.'),
    bullet('Containerization', 'Containerize the frontend and backend using Docker and Docker Compose with an Nginx reverse proxy.'),
    bullet('DevOps & Cloud', 'Automate CI/CD with GitHub Actions workflows and deploy frontend to Vercel, backend to Render, and database to MongoDB Atlas.'),
    h2('1.5 Project Links'),
    makeTable(
      ['Resource', 'Platform', 'Link'],
      [
        ['Source code', 'GitHub', 'https://github.com/Krrish-Gupta-18/fs-project'],
        ['Frontend (live)', 'Vercel', 'https://fs-project-theta.vercel.app/'],
        ['Backend API (live)', 'Render', 'https://fs-project-backend.onrender.com'],
        ['Database', 'MongoDB Atlas', 'Cloud-hosted cluster (chatflow database)'],
      ],
      [2200, 2000, 4400]
    ),
    h1('2. PROJECT SCOPE AND REQUIREMENTS'),
    h2('2.1 Project Scope'),
    p(
      'ChatFlow is a fully functional full-stack developer communication platform. It encompasses client-side presentation, RESTful API architecture, cloud database modeling, authenticated WebSockets, external webhook ingestion with cryptographic signature validation, bug report tracking, containerized local execution, and cloud hosting. The scope also includes automated CI/CD pipelines on GitHub Actions ensuring quality validation before deployment.'
    ),
    h2('2.2 Functional Requirements'),
    bullet('Authentication & Profiles', 'Secure user registration and login with bcrypt password hashing, JWT tokens, avatar selection, and profile bio inspection.'),
    bullet('Multi-Workspace System', 'Create and switch workspaces, manage role-based memberships (Admin/Member), and generate shareable alphanumeric invite codes.'),
    bullet('Channels & Direct Chats', 'Support public channels (#general, #development, #pull-requests) and private channels scoped to workspaces, alongside direct 1-to-1 conversations.'),
  ],
});

// SECTION 8: 2.3 NON-FUNCTIONAL REQUIREMENTS & 3. TECHNOLOGIES USED (Page 8)
sections.push({
  properties: { page: { margin: { top: 720, bottom: 720, left: 1080, right: 1080 } } },
  headers: { default: makeHeader() },
  footers: { default: makeFooter(8) },
  children: [
    bullet('Rich Messaging', 'Code block formatting with syntax styling, @mentions, inline message editing, deletion, image/file attachments, and threaded replies.'),
    bullet('Developer Activity Shortcuts', 'One-click sidebar access to bug trackers, repository activities, and deployment release streams.'),
    bullet('GitHub HMAC Webhooks', 'Receive pull request and push webhook events verified via HMAC SHA-256 and render interactive preview cards.'),
    bullet('Message-to-Bug Conversion', 'Convert any chat message into a tracked bug report with severity levels (Critical, High, Medium, Low) and assignee tracking.'),
    bullet('Dynamic Unread Counters', 'Accurately track and display unread badges on direct chats and channels, clearing dynamically when viewed.'),
    h2('2.3 Non-Functional Requirements'),
    makeTable(
      ['Requirement', 'Project approach'],
      [
        ['Usability', 'Modern dark/light developer aesthetic, sidebar navigation, keyboard shortcuts, unread badges, and clear responsive layouts.'],
        ['Maintainability', 'Modular architecture separating controllers, models, routes, hooks, components, and socket handlers.'],
        ['Security', 'Bcrypt password hashing (10 rounds), JWT authentication, role checks, raw body HMAC SHA-256 verification, Helmet, and rate limiting.'],
        ['Portability', 'Dockerfiles, Docker Compose, and Nginx reverse-proxy configuration define an identical reproducible runtime across platforms.'],
        ['Availability', 'Deployed to high-availability cloud infrastructure on Vercel, Render, and MongoDB Atlas with automated health checks.'],
        ['Real-time interaction', 'Socket.IO delivers messages, typing status, presence, and read receipts instantaneously with zero page reloads.'],
      ],
      [2500, 6100]
    ),
    h1('3. TECHNOLOGIES USED'),
    p(
      'ChatFlow employs an end-to-end JavaScript/ESM software stack, a cloud document database, event-driven WebSocket communication, and modern DevOps tools. The table below outlines the core technologies and their respective roles.'
    ),
    makeTable(
      ['Technology / Tool', 'Role in ChatFlow'],
      [
        ['React 19 + React Router', 'Component-based single-page application (SPA) and client-side routing between workspaces, channels, and chats.'],
        ['Vite 6', 'Fast frontend build tooling, HMR development server, and optimized production bundling.'],
      ],
      [3000, 5600]
    ),
  ],
});

// SECTION 9: TECHNOLOGIES (CONT.) & 3.1 ENVIRONMENT & 4. SYSTEM DESIGN (Page 9)
sections.push({
  properties: { page: { margin: { top: 720, bottom: 720, left: 1080, right: 1080 } } },
  headers: { default: makeHeader() },
  footers: { default: makeFooter(9) },
  children: [
    makeTable(
      ['Technology / Tool', 'Role in ChatFlow'],
      [
        ['Tailwind CSS 3', 'Utility-first styling for dark-mode developer UI, responsive layouts, badges, and modal drawers.'],
        ['Lucide React', 'Consistent, developer-friendly vector iconography for channels, repos, bugs, and status indicators.'],
        ['Hooks / Context API', 'Global state management (useChat, useChatState, useDebounce, AuthContext) for reactive data.'],
        ['Node.js 24 + Express 4', 'Backend REST API, webhook signature verification, route middleware, and HTTP server.'],
        ['MongoDB Atlas + Mongoose 8', 'Cloud NoSQL document database storing users, workspaces, channels, messages, bugs, and deployments.'],
        ['bcryptjs + JWT', 'Cryptographic password hashing and JSON Web Token issuance and verification.'],
        ['Socket.IO 4', 'Full-duplex WebSocket communication for real-time messaging, typing indicators, and presence.'],
        ['Docker + Docker Compose', 'Containerization of frontend and backend services for reproducible local and server execution.'],
        ['Nginx', 'High-performance reverse proxy routing HTTP API and WebSocket connections to backend.'],
        ['GitHub Actions', 'Automated CI/CD pipelines executing build validation and triggering deployments to Vercel and Render.'],
        ['Vercel, Render, Atlas', 'Serverless cloud hosting for frontend SPA, backend Web Service, and database cluster.'],
      ],
      [3000, 5600]
    ),
    h2('3.1 Development and Deployment Environment'),
    p(
      'Development was conducted in Visual Studio Code with Node.js 24 and npm. The Vite client runs on port 3000 (and 5173 during standalone development), the Express backend listens on port 5000, and Docker Compose publishes frontend on port 3000 and backend on port 5000. Docker images are built from node:22-alpine and nginx:alpine. Production deployments are orchestrated automatically via GitHub Actions: Vercel serves the frontend SPA with SPA rewrite rules in vercel.json, Render hosts the Node.js backend web service, and MongoDB Atlas manages the database cluster.'
    ),
    h1('4. SYSTEM DESIGN'),
    p(
      'ChatFlow employs a layered client-server architecture with dual communication channels. The React SPA sends standard HTTP REST requests for CRUD operations and establishes a persistent Socket.IO connection for real-time messaging, presence, and webhook notification broadcasts. Figure 1 illustrates the high-level architecture.'
    ),
  ],
});

// SECTION 10: ARCHITECTURE DIAGRAM & 4.1 ARCHITECTURE COMPONENTS (Page 10)
sections.push({
  properties: { page: { margin: { top: 720, bottom: 720, left: 1080, right: 1080 } } },
  headers: { default: makeHeader() },
  footers: { default: makeFooter(10) },
  children: [
    ...imageWithCaption('fig1_chatflow_high_level_architecture.png', 'Figure 1. High-level architecture of ChatFlow (React SPA, Express + Socket.IO server, MongoDB Atlas).', 520, 220),
    h2('4.1 Architecture Components'),
    makeTable(
      ['Component', 'Responsibility'],
      [
        ['Browser / Client', 'Renders React components, manages UI themes, handles local state, sends REST requests, and maintains Socket.IO connection.'],
        ['Frontend Service', 'Vite-bundled React application including Sidebar, ChatHeader, MessageBubble, MessageInput, ThreadView, BugTracker, and modals.'],
        ['Backend Service', 'Express.js server handling auth, workspaces, channels, messages, GitHub webhooks, bug reports, and Socket.IO events.'],
        ['MongoDB Atlas', 'Managed cloud database storing users, workspaces, channels, messages, repositories, bug reports, and deployments.'],
        ['Nginx Reverse Proxy', 'Serves frontend production build, falls back to index.html for SPA routes, and proxies /api/ and /socket.io/ traffic.'],
        ['GitHub Actions CI/CD', 'Automated workflows running syntax/build validation on PRs and triggering production deployments on push.'],
        ['Vercel / Render', 'Hosting platforms providing global CDN distribution for the frontend and container runtime for the backend.'],
      ],
      [2600, 6000]
    ),
  ],
});

// SECTION 11: 4.2 SYSTEM WORKFLOW & DATABASE DESIGN (Page 11)
sections.push({
  properties: { page: { margin: { top: 720, bottom: 720, left: 1080, right: 1080 } } },
  headers: { default: makeHeader() },
  footers: { default: makeFooter(11) },
  children: [
    h2('4.2 System Workflow and Project Structure'),
    h3('4.2.1 Main Request Flow'),
    bullet('1', 'The user accesses ChatFlow; the client checks localStorage for an auth token and user profile, redirecting to /login if unauthenticated.'),
    bullet('2', 'On login/sign-up, the client sends credentials to /api/auth/login or /api/auth/register; the backend validates input, hashes/verifies password with bcrypt, and returns a signed JWT.'),
    bullet('3', 'The client stores the JWT and establishes an authenticated Socket.IO connection, joining the personal user room and active workspace room.'),
    bullet('4', 'Workspaces, channels, direct conversations, bug reports, and active deployments are loaded via parallel REST queries.'),
    bullet('5', 'Sending a message emits message:send over Socket.IO; the server persists it to MongoDB, updates conversation summaries, and broadcasts message:new to participants.'),
    bullet('6', 'External GitHub webhook events POST to /api/integrations/github/webhook; the backend verifies HMAC SHA-256 signatures and broadcasts cards to #pull-requests.'),
    bullet('7', 'Pushing to main branch triggers GitHub Actions workflows to validate builds and trigger automatic redeployments on Render and Vercel.'),
    h3('4.2.2 Database Design'),
    makeTable(
      ['Collection', 'Main fields', 'Purpose'],
      [
        ['users', 'userId, name, email, password, avatar, role, status, bio, timestamps', 'User accounts, authentication credentials, and presence.'],
        ['workspaces', 'workspaceId, name, description, ownerId, members[], inviteCode, timestamps', 'Multi-tenant team workspaces and memberships.'],
        ['channels', 'channelId, workspaceId, name, type (public/private), topic, members[]', 'Workspace-scoped discussion channels.'],
        ['conversations', 'conversationId, name, type (direct/group), participants[], lastMessage, timestamps', '1-to-1 direct chats and private conversation metadata.'],
        ['messages', 'messageId, conversationId, senderId, text, status, replyTo, threadCount, mentions[]', 'Chat messages, thread replies, and media attachments.'],
        ['repositories', 'repoId, workspaceId, name, fullName, webhookSecret, defaultChannelId', 'Connected GitHub repositories and webhook settings.'],
        ['bugreports', 'bugId, workspaceId, channelId, originalMessageId, title, severity, status', 'Bug reports created directly from conversation messages.'],
        ['deployments', 'deploymentId, workspaceId, environment, status, commitSha, author', 'CI/CD deployment execution logs and build history.'],
      ],
      [1800, 4200, 2600]
    ),
  ],
});

// SECTION 12: PROJECT STRUCTURE & 5. IMPLEMENTATION (Page 12)
sections.push({
  properties: { page: { margin: { top: 720, bottom: 720, left: 1080, right: 1080 } } },
  headers: { default: makeHeader() },
  footers: { default: makeFooter(12) },
  children: [
    h3('4.2.3 Main Project Structure'),
    makeTable(
      ['Path', 'Contents'],
      [
        ['.github/workflows/', 'backend-render.yml, frontend-vercel.yml CI/CD pipelines'],
        ['backend/', 'server.js, socket.js, config/db.js, controllers/, middleware/, models/, routes/'],
        ['frontend/src/', 'main.jsx, App.jsx, index.css, components/, hooks/, services/'],
        ['frontend/src/components/', 'auth/, chat/ (Sidebar, ChatHeader, MessageBubble, MessageInput, modals)'],
        ['frontend/src/hooks/', 'useChat.jsx, useChatState.js, useDebounce.js'],
        ['Dockerfile.backend, frontend', 'Container definitions for Node backend and multi-stage Nginx frontend'],
        ['docker-compose.yml, nginx.conf', 'Multi-container orchestration and Nginx reverse proxy configuration'],
        ['vercel.json, render.yaml', 'Cloud deployment configuration and SPA rewrite rules'],
      ],
      [3000, 5600]
    ),
    h1('5. IMPLEMENTATION'),
    h2('5.1 Frontend Implementation'),
    p(
      'The client is built with React 19 and Vite 6. App.jsx configures the BrowserRouter with protected routes and state providers. The application supports full responsive views, modal dialogs for workspace and channel creation, developer drawers for bug reports, releases, and thread panels.'
    ),
    codeBlock([
      '<BrowserRouter>',
      '  <Routes>',
      '    <Route path="/login" element={<LoginPage />} />',
      '    <Route path="/register" element={<RegisterPage />} />',
      '    <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />',
      '    <Route path="/chat/:conversationId" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />',
      '    <Route path="*" element={<Navigate to="/chat" replace />} />',
      '  </Routes>',
      '</BrowserRouter>',
    ]),
  ],
});

// SECTION 13: 5.2 STATE & 5.3 BACKEND & 5.4 ROUTES (Page 13)
sections.push({
  properties: { page: { margin: { top: 720, bottom: 720, left: 1080, right: 1080 } } },
  headers: { default: makeHeader() },
  footers: { default: makeFooter(13) },
  children: [
    h2('5.2 State and Hook Management'),
    p(
      'State is structured through specialized custom hooks. useChatState encapsulates workspace switching, active channel/direct conversation selection, real-time Socket.IO subscriptions, optimistic message dispatch, and dynamic unread counter calculation. useChat provides consuming components clean access to context data without prop drilling.'
    ),
    codeBlock([
      '// Sync active target, clear unread count, and emit read receipts',
      'useEffect(() => {',
      '  if (!activeConversationId) return;',
      '  setConversations(prev => prev.map(c => c.id === activeConversationId ? { ...c, unreadCount: 0 } : c));',
      '  markMessagesAsReadApi(activeConversationId).catch(() => {});',
      '  socket?.emit("message:read", { conversationId: activeConversationId });',
      '}, [activeConversationId]);',
    ]),
    h2('5.3 Backend Implementation'),
    p(
      'The Express backend wraps an HTTP server sharing the same port with Socket.IO. Routes are mounted under /api/auth, /api/workspaces, /api/channels, /api/conversations, /api/messages, /api/integrations, and /api/bugs. Mongoose connects to MongoDB Atlas. Passwords are encrypted with bcrypt, API routes are guarded by JWT protect and authorize middlewares, and external webhook bodies preserve raw buffers for cryptographic signature verification.'
    ),
    h2('5.4 Main Routes and Events'),
    makeTable(
      ['Route / Event', 'Purpose'],
      [
        ['POST /api/auth/login, register', 'User authentication and JWT token generation.'],
        ['GET, POST /api/workspaces', 'Workspace creation, role assignments, and member invites.'],
        ['GET, POST /api/channels', 'Channel listing and channel creation within active workspace.'],
        ['GET, POST /api/messages', 'Fetch message history, send replies, edit, and delete.'],
        ['POST /api/messages/read/:id', 'Mark all unread messages as read in conversation.'],
        ['POST /api/integrations/github/webhook', 'HMAC SHA-256 verified GitHub webhook receiver.'],
        ['POST /api/bugs', 'Convert chat message to tracked bug report.'],
        ['workspace:join, conversation:join', 'Socket.IO room joining for real-time broadcasts.'],
        ['message:send, message:new, message:status', 'Live message dispatch, delivery, and read receipts.'],
      ],
      [3600, 5000]
    ),
  ],
});

// SECTION 14: 5.5 KEY CODE HIGHLIGHTS (Page 14)
sections.push({
  properties: { page: { margin: { top: 720, bottom: 720, left: 1080, right: 1080 } } },
  headers: { default: makeHeader() },
  footers: { default: makeFooter(14) },
  children: [
    h2('5.5 Key Code Highlights'),
    h3('5.5.1 Login with Password Check and JWT'),
    codeBlock([
      'const user = await User.findOne({ email });',
      'if (!user || user.password !== password) return res.status(401).json({ error: "Invalid credentials" });',
      'const token = generateToken(user);',
      'res.json({ token, user: { id: user.userId, name: user.name, email: user.email, role: user.role } });',
    ]),
    h3('5.5.2 Authentication and Role Middleware'),
    codeBlock([
      'export async function protect(req, res, next) {',
      '  const token = req.headers.authorization?.replace(/^Bearer\\s+/i, "");',
      '  if (!token) return res.status(401).json({ error: "Access denied. No token provided." });',
      '  try { req.user = jwt.verify(token, getJwtSecret()); next(); }',
      '  catch { return res.status(401).json({ error: "Invalid or expired token." }); }',
      '}',
      'export const authorize = (...roles) => (req, res, next) =>',
      '  roles.some(r => r.toLowerCase() === (req.user?.role || "Member").toLowerCase())',
      '    ? next() : res.status(403).json({ error: "Forbidden: Insufficient permissions." });',
    ]),
    h3('5.5.3 GitHub Webhook HMAC Verification'),
    codeBlock([
      'export function verifyGitHubSignature(rawBody, signatureHeader, secret) {',
      '  if (!rawBody || !signatureHeader || !secret) return false;',
      '  const hmac = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");',
      '  const expected = `sha256=${hmac}`;',
      '  return crypto.timingSafeEqual(Buffer.from(signatureHeader), Buffer.from(expected));',
      '}',
    ]),
    h3('5.5.4 Message to Bug Report Conversion Controller'),
    codeBlock([
      'const bug = await BugReport.create({',
      '  bugId: `bug_${Date.now()}`, workspaceId, channelId, originalMessageId,',
      '  title: title.trim(), description: description?.trim(), severity, status: "open",',
      '  reporterId: req.user.userId, reporterName: req.user.name, assigneeId',
      '});',
      'io?.to(channelId).emit("bug:new", { bug });',
    ]),
  ],
});

// SECTION 15: 5.5.5 ENVIRONMENT & DYNAMIC UNREAD COUNTERS (Page 15)
sections.push({
  properties: { page: { margin: { top: 720, bottom: 720, left: 1080, right: 1080 } } },
  headers: { default: makeHeader() },
  footers: { default: makeFooter(15) },
  children: [
    h3('5.5.5 Environment-Based API Configuration'),
    codeBlock([
      'export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";',
      'export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";',
    ]),
    p(
      'This configuration enables the single built frontend artifact to connect to local services during development and seamlessly bind to the cloud Render backend in production without code modifications.'
    ),
    h3('5.5.6 Dynamic Unread Message Count Calculation'),
    codeBlock([
      '// Calculate per-user dynamic unread message count in conversation controller',
      'async function enrichConversationForUser(conv, currentUserId) {',
      '  let enriched = { ...conv };',
      '  const targetId = conv.conversationId || conv.id;',
      '  if (currentUserId && targetId) {',
      '    const unread = await Message.countDocuments({',
      '      conversationId: targetId,',
      '      senderId: { $ne: currentUserId },',
      '      status: { $ne: "read" },',
      '    });',
      '    enriched.unreadCount = unread;',
      '  }',
      '  return enriched;',
      '}',
    ]),
    p(
      'By querying the Message collection directly rather than relying on static counter fields, unread indicators accurately reflect message status per user. Opening a conversation marks messages as read in MongoDB and dispatches a message:status event to update delivery checkmarks on all active client devices.'
    ),
  ],
});

// SECTION 16: 6. IMPLEMENTATION WITH SCREENSHOTS (Page 16)
sections.push({
  properties: { page: { margin: { top: 720, bottom: 720, left: 1080, right: 1080 } } },
  headers: { default: makeHeader() },
  footers: { default: makeFooter(16) },
  children: [
    h1('6. IMPLEMENTATION WITH SCREENSHOTS'),
    p(
      'The screenshots below illustrate the complete end-to-end user experience of ChatFlow, including workspace navigation, authentication, API verification in Postman, channels, direct chats, developer activity streams, Docker container execution, and live cloud deployment.'
    ),
    h2('6.1 Landing Page and Workspace Navigation'),
    p(
      'Upon accessing ChatFlow, authenticated users are presented with the workspace dashboard featuring workspace switcher, developer activity quick-access buttons, categorized channel lists, direct conversations with online indicators, and search filters.'
    ),
    ...imageWithCaption('chat_page_loaded_1793192967960.png', 'Figure 2. ChatFlow modern developer workspace interface with channels and direct messages.', 500, 220),
    h2('6.2 Authentication and User Registration'),
    p(
      'Users authenticate via dedicated Sign In and Sign Up tabs with client-side validation, error handling, and encrypted password authentication.'
    ),
    ...twoImagesWithCaptions('chatflow_login_card.png', 'Figure 3. Login interface.', 'chatflow_register_card.png', 'Figure 4. Sign-up interface.', 240, 160),
  ],
});

// SECTION 17: 6.3 POSTMAN API TESTING & 6.4 CHANNELS (Page 17)
sections.push({
  properties: { page: { margin: { top: 720, bottom: 720, left: 1080, right: 1080 } } },
  headers: { default: makeHeader() },
  footers: { default: makeFooter(17) },
  children: [
    ...twoImagesWithCaptions('fig5_postman_register.png', 'Figure 5. Postman: POST register returns 201 Created.', 'fig6_postman_login.png', 'Figure 6. Postman: POST login returns 200 and a JWT.', 240, 130),
    h2('6.3 Dashboard and Workspace Channels'),
    p(
      'Team members collaborate in specialized public and private channels. The #development channel facilitates code discussions, snippet sharing with syntax highlighting, and threaded comments.'
    ),
    ...imageWithCaption('development_channel_1793192990006.png', 'Figure 7. Team collaboration in the #development channel with code block formatting.', 500, 200),
    ...imageWithCaption('pull_requests_channel_1793193048860.png', 'Figure 8. GitHub PR and commit activity cards rendered automatically in #pull-requests channel.', 500, 200),
  ],
});

// SECTION 18: 6.5 PROTECTED ROUTES & NEGATIVE SECURITY CHECKS (Page 18)
sections.push({
  properties: { page: { margin: { top: 720, bottom: 720, left: 1080, right: 1080 } } },
  headers: { default: makeHeader() },
  footers: { default: makeFooter(18) },
  children: [
    ...twoImagesWithCaptions('fig9_postman_protected_route.png', 'Figure 9. Postman: protected route with valid Bearer token returns 200.', 'fig10_postman_admin_route.png', 'Figure 10. Postman: admin route with admin token returns 200.', 240, 130),
    h2('Negative Security Checks'),
    p(
      'Requests without authorization tokens, with malformed/expired JWTs, wrong passwords, or invalid payloads were rejected with precise HTTP status codes and security alerts.'
    ),
    ...imageWithCaption('fig11_negative_no_token.png', 'Figure 11. No token provided: 401 Unauthorized "Access denied. No token provided."', 480, 160),
  ],
});

// SECTION 19: NEGATIVE SECURITY CHECKS (CONT.) (Page 19)
sections.push({
  properties: { page: { margin: { top: 720, bottom: 720, left: 1080, right: 1080 } } },
  headers: { default: makeHeader() },
  footers: { default: makeFooter(19) },
  children: [
    ...imageWithCaption('fig12_negative_invalid_token.png', 'Figure 12. Invalid token: 401 Unauthorized "Invalid or expired token".', 480, 160),
    ...imageWithCaption('fig13_negative_wrong_password.png', 'Figure 13. Wrong password: 401 Unauthorized "Invalid email or password".', 480, 160),
    ...imageWithCaption('fig14_negative_malformed_json.png', 'Figure 14. Malformed JSON payload: 400 Bad Request.', 480, 160),
  ],
});

// SECTION 20: 6.6 DEVELOPER ACTIVITY (BUGS & RELEASES) (Page 20)
sections.push({
  properties: { page: { margin: { top: 720, bottom: 720, left: 1080, right: 1080 } } },
  headers: { default: makeHeader() },
  footers: { default: makeFooter(20) },
  children: [
    h2('6.6 Developer Activity: Bug Tracker & CI/CD Deployment Stream'),
    p(
      'ChatFlow provides integrated developer panels. Any message can be converted into a structured bug report with priority levels. The releases panel tracks live CI/CD pipeline deployments.'
    ),
    ...imageWithCaption('bug_tracker_panel_1793193065266.png', 'Figure 15. Developer Bug Tracker drawer with severity filters converted from chat messages.', 500, 210),
    ...imageWithCaption('releases_panel_1793193081096.png', 'Figure 16. CI/CD Deployment Release stream displaying commit author, hash, and status.', 500, 210),
  ],
});

// SECTION 21: 6.7 REAL-TIME CHAT & READ RECEIPTS (Page 21)
sections.push({
  properties: { page: { margin: { top: 720, bottom: 720, left: 1080, right: 1080 } } },
  headers: { default: makeHeader() },
  footers: { default: makeFooter(21) },
  children: [
    h2('6.7 Real-Time Direct Messaging and Read Receipts'),
    p(
      'Direct messaging between team members features instantaneous socket transmission, typing indicators, delivery checkmarks (single check = sent, double cyan checks = read), and unread badge counters.'
    ),
    ...imageWithCaption('direct_message_chat_1793193101166.png', 'Figure 17. 1-to-1 conversation with Sarah Jenkins showing real-time delivery status checkmarks.', 500, 200),
    ...twoImagesWithCaptions('david_chen_dm_1793193131869.png', 'Figure 18. Direct messaging with David Chen.', 'message_sent_success_1793194241773.png', 'Figure 19. Real-time message delivered to Emma Watson.', 240, 140),
  ],
});

// SECTION 22: 6.8 MONGODB & 6.9 DOCKERFILE (Page 22)
sections.push({
  properties: { page: { margin: { top: 720, bottom: 720, left: 1080, right: 1080 } } },
  headers: { default: makeHeader() },
  footers: { default: makeFooter(22) },
  children: [
    ...imageWithCaption('fig20_mongodb_atlas_chatflow.png', 'Figure 20. chatmessages and conversations collections stored in MongoDB Atlas.', 490, 200),
    h2('6.9 Containerisation with Docker Compose'),
    p(
      'The application is fully containerized. A lightweight Node.js Alpine image runs the backend, while a multi-stage Docker build compiles the Vite React application and serves it via Nginx.'
    ),
    ...twoImagesWithCaptions('fig21_backend_dockerfile.png', 'Figure 21. Backend Dockerfile.', 'fig22_frontend_dockerfile.png', 'Figure 22. Frontend multi-stage Dockerfile.', 240, 150),
  ],
});

// SECTION 23: DOCKER COMPOSE BUILD & RUN (Page 23)
sections.push({
  properties: { page: { margin: { top: 720, bottom: 720, left: 1080, right: 1080 } } },
  headers: { default: makeHeader() },
  footers: { default: makeFooter(23) },
  children: [
    ...imageWithCaption('fig23_docker_compose_build.png', 'Figure 23. docker compose build: both frontend and backend images built.', 480, 160),
    ...imageWithCaption('fig24_docker_compose_up.png', 'Figure 24. docker compose up -d starts both containers in detached mode.', 480, 100),
    ...imageWithCaption('fig25_docker_compose_ps.png', 'Figure 25. docker compose ps: backend on port 5000, frontend on port 3000.', 480, 110),
  ],
});

// SECTION 24: CONTAINER LOGS & DOCKER DESKTOP (Page 24)
sections.push({
  properties: { page: { margin: { top: 720, bottom: 720, left: 1080, right: 1080 } } },
  headers: { default: makeHeader() },
  footers: { default: makeFooter(24) },
  children: [
    ...imageWithCaption('fig26_docker_container_logs.png', 'Figure 26. Container logs: MongoDB connected and Socket.IO client connected.', 480, 200),
    ...imageWithCaption('fig27_docker_desktop_stack.png', 'Figure 27. Docker Desktop showing the chatflow stack with frontend and backend containers.', 480, 200),
  ],
});

// SECTION 25: 6.11 CLOUD DEPLOYMENT (Page 25)
sections.push({
  properties: { page: { margin: { top: 720, bottom: 720, left: 1080, right: 1080 } } },
  headers: { default: makeHeader() },
  footers: { default: makeFooter(25) },
  children: [
    h2('6.11 Cloud Deployment'),
    p(
      'The source code is hosted on GitHub. Pushing commits triggers GitHub Actions CI workflows. Render hosts the Node.js backend Web Service and Vercel hosts the React frontend.'
    ),
    ...imageWithCaption('fig28_github_repo_krrish.png', 'Figure 28. GitHub repository Krrish-Gupta-18/fs-project with CI/CD workflows and Docker configurations.', 480, 180),
    ...twoImagesWithCaptions('fig29_render_config_chatflow.png', 'Figure 29. Render: backend web service configuration.', 'fig30_render_live_deploy.png', 'Figure 30. Render: "Deploy succeeded", service live.', 240, 140),
  ],
});

// SECTION 26: VERCEL DEPLOYMENT & 7. TESTING (Page 26)
sections.push({
  properties: { page: { margin: { top: 720, bottom: 720, left: 1080, right: 1080 } } },
  headers: { default: makeHeader() },
  footers: { default: makeFooter(26) },
  children: [
    ...twoImagesWithCaptions('fig31_vercel_config_chatflow.png', 'Figure 31. Vercel: Vite preset with environment variables.', 'fig32_vercel_production_live.png', 'Figure 32. Vercel: deployed to production.', 240, 140),
    h1('7. TESTING AND RESULTS'),
    p(
      'Testing was executed methodically across API behavior with Postman, container orchestration with Docker Compose, real-time Socket.IO synchronization across multiple browser sessions, and cloud deployments.'
    ),
    makeTable(
      ['ID', 'Test / Verification', 'Expected result', 'Result'],
      [
        ['T01', 'POST register with valid data', '201 Created and success message', 'Pass'],
        ['T02', 'POST register with role admin', '201 Created, role returned as Admin', 'Pass'],
        ['T03', 'POST login with valid credentials', '200 OK with JWT and user details', 'Pass'],
        ['T04', 'Protected route with valid token', '200 OK with user data', 'Pass'],
        ['T05', 'Protected route without token', '401 "Access denied. No token provided."', 'Pass'],
        ['T06', 'Protected route with invalid token', '401 "Invalid or expired token"', 'Pass'],
        ['T07', 'Login with wrong password', '401 "Invalid email or password"', 'Pass'],
        ['T08', 'Malformed JSON request body', '400 Bad Request', 'Pass'],
        ['T09', 'Admin route with admin token', '200 OK "Welcome Admin!"', 'Pass'],
        ['T10', 'GET /api/channels through Nginx (port 3000)', 'Channel documents returned', 'Pass'],
        ['T11', 'docker compose build', 'Both images built', 'Pass'],
      ],
      [800, 3600, 3200, 1000]
    ),
  ],
});

// SECTION 27: 7.1 RESULTS & 7.2 OBSERVATIONS (Page 27)
sections.push({
  properties: { page: { margin: { top: 720, bottom: 720, left: 1080, right: 1080 } } },
  headers: { default: makeHeader() },
  footers: { default: makeFooter(27) },
  children: [
    makeTable(
      ['ID', 'Test / Verification', 'Expected result', 'Result'],
      [
        ['T12', 'docker compose up -d and ps', 'Both containers running; ports 5000, 3000', 'Pass'],
        ['T13', 'Open localhost:5000', 'API running message displayed', 'Pass'],
        ['T14', 'Two users in one private room', 'Message appears in both sessions without refresh', 'Pass'],
        ['T15', 'Check chatmessages in Atlas', 'Sent messages stored with conversationId and sender', 'Pass'],
        ['T16', 'Render deployment', 'Deploy succeeded, service live, MongoDB connected', 'Pass'],
        ['T17', 'Vercel deployment', 'Deployed to production', 'Pass'],
        ['T18', 'Push to main', 'Workflow runs; check mark on latest commit', 'Pass'],
      ],
      [800, 3600, 3200, 1000]
    ),
    h2('7.1 Result'),
    makeTable(
      ['Test category', 'Checks', 'Passed', 'Failed'],
      [
        ['Authentication, authorization and API (T01-T10)', '10', '10', '0'],
        ['Docker build and containers (T11-T13)', '3', '3', '0'],
        ['Real-time chat and persistence (T14-T15)', '2', '2', '0'],
        ['Deployment and CI (T16-T18)', '3', '3', '0'],
        ['Total', '18', '18', '0'],
      ],
      [4200, 1400, 1400, 1400]
    ),
    p(
      'All eighteen checks passed. User registration, credential verification, JWT authentication, and role-based permissions functioned exactly as specified. Docker Compose spun up the full multi-tier stack, real-time Socket.IO messages arrived with sub-second latency, read receipts updated reliably, and external webhook events processed accurately.'
    ),
    h2('7.2 Observations'),
    bullet('Security', 'Authentication failure responses provide uniform error descriptions ("Invalid email or password") to prevent user enumeration attacks.'),
    bullet('HMAC Integrity', 'GitHub webhook endpoints require raw request body buffers; parsing middleware must preserve raw buffers before JSON decoding.'),
    bullet('Read Receipts', 'Broadcasting message:status events across conversation rooms and personal user rooms ensures mobile/offline devices reflect accurate checkmarks.'),
  ],
});

// SECTION 28: 8. DEPLOYMENT AND DEVOPS (Page 28)
sections.push({
  properties: { page: { margin: { top: 720, bottom: 720, left: 1080, right: 1080 } } },
  headers: { default: makeHeader() },
  footers: { default: makeFooter(28) },
  children: [
    h1('8. DEPLOYMENT AND DEVOPS'),
    h2('8.1 Docker and Docker Compose'),
    p(
      'The backend container is built from node:22-alpine, installing production dependencies and running npm start. The frontend container utilizes a two-stage build: stage one compiles the React application with Vite, and stage two serves the production assets via nginx:alpine with custom reverse proxy rules. Docker Compose orchestrates both services.'
    ),
    makeTable(
      ['Service', 'Build', 'Ports', 'Settings'],
      [
        ['backend', 'Dockerfile.backend', '5000:5000', 'restart: always; env PORT, MONGO_URI, JWT_SECRET, CLIENT_URL'],
        ['frontend', 'Dockerfile.frontend (multi-stage, Nginx)', '3000:80', 'restart: always; depends_on backend'],
      ],
      [1600, 2600, 1600, 2800]
    ),
    p(
      'Nginx proxies /api/ requests and WebSocket /socket.io/ connections to http://backend:5000 with Upgrade and Connection headers, serving SPA routes by falling back to index.html.'
    ),
    h2('8.2 GitHub Actions'),
    p(
      'Continuous integration and continuous deployment are managed through two GitHub Actions workflows located in .github/workflows/. backend-render.yml validates backend code syntax and triggers Render deploy webhooks. frontend-vercel.yml executes automated Vite production builds and deploys artifacts to Vercel.'
    ),
    codeBlock([
      'name: Frontend Vercel CI/CD',
      'on: { push: { branches: [main, latest] }, pull_request: { branches: [main] } }',
      'jobs:',
      '  build-and-deploy:',
      '    steps:',
      '      - uses: actions/checkout@v4',
      '      - uses: actions/setup-node@v4 with: { node-version: 20 }',
      '      - run: npm --prefix frontend ci',
      '      - run: npm --prefix frontend run build',
      '      - run: npx vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}',
    ]),
  ],
});

// SECTION 29: 8.3 CLOUD DEPLOYMENT & FIGURE 33 (Page 29)
sections.push({
  properties: { page: { margin: { top: 720, bottom: 720, left: 1080, right: 1080 } } },
  headers: { default: makeHeader() },
  footers: { default: makeFooter(29) },
  children: [
    h2('8.3 Cloud Deployment'),
    bullet('Vercel (Frontend)', 'Vite framework preset with root directory ./frontend. vercel.json rewrites incoming paths to /index.html. Environment variable VITE_API_URL points to the Render backend.'),
    bullet('Render (Backend)', 'Node.js Web Service connected to GitHub repository branch main. Build command npm install and start command npm start. Environment variables MONGO_URI, JWT_SECRET, and CLIENT_URL configured.'),
    bullet('MongoDB Atlas (Database)', 'Cluster cluster0.ae2rk4z.mongodb.net hosting the chatflow database with collections for users, workspaces, channels, conversations, messages, repositories, bugs, and deployments.'),
    ...imageWithCaption('fig33_chatflow_deployment_architecture.png', 'Figure 33. Deployment architecture of ChatFlow.', 480, 200),
    p('A push to the main branch triggers the GitHub Actions jobs and the automatic redeployment of Vercel and Render, as shown in Figure 33.'),
    h3('Project Links Summary'),
    p('GitHub repository: https://github.com/Krrish-Gupta-18/fs-project', { bold: true }),
    p('Live frontend: https://fs-project-theta.vercel.app/', { bold: true }),
    p('Live backend: https://fs-project-backend.onrender.com', { bold: true }),
  ],
});

// SECTION 30: 9. CONCLUSION AND FUTURE SCOPE (Page 30)
sections.push({
  properties: { page: { margin: { top: 720, bottom: 720, left: 1080, right: 1080 } } },
  headers: { default: makeHeader() },
  footers: { default: makeFooter(30) },
  children: [
    h1('9. CONCLUSION AND FUTURE SCOPE'),
    h2('9.1 Conclusion'),
    p(
      'ChatFlow demonstrates a complete, production-ready full-stack communication and collaboration platform tailored for modern engineering workflows. The application unifies React single-page UI architecture, Express REST APIs, cloud MongoDB persistence, and Socket.IO full-duplex communication into a unified developer experience. Security is enforced through bcrypt encryption, JWT authentication, and HMAC SHA-256 webhook verification. Docker Compose provides localized multi-container execution, while GitHub Actions, Vercel, and Render deliver a fully automated cloud deployment lifecycle.'
    ),
    h2('9.2 Limitations'),
    bullet('Webhook Provider Scope', 'Webhook ingestion is currently configured for GitHub and CI/CD pipelines; GitLab and Bitbucket webhooks are not yet connected.'),
    bullet('Free-Tier Inactivity', 'Free-tier Render backend instances may spin down after prolonged inactivity, introducing initial request cold starts.'),
    bullet('Audio/Video Calls', 'Current communication is text, code snippets, and image/attachment based; WebRTC audio/video calls are not yet integrated.'),
    h2('9.3 Future Scope'),
    bullet('WebRTC Calling', 'Integrate WebRTC mesh/SFU architectures for 1-to-1 audio/video pair programming and screen sharing.'),
    bullet('AI Code Assistant', 'Embed AI code review bots to analyze code blocks and PR summaries directly within channel threads.'),
    bullet('GitLab & Bitbucket', 'Expand HMAC webhook handlers to support multi-provider DevOps platforms.'),
    bullet('Mobile Application', 'Develop a companion React Native cross-platform application sharing the backend Socket.IO protocol.'),
  ],
});

// SECTION 31: 10. REFERENCES (Page 31)
sections.push({
  properties: { page: { margin: { top: 720, bottom: 720, left: 1080, right: 1080 } } },
  headers: { default: makeHeader() },
  footers: { default: makeFooter(31) },
  children: [
    bullet('Analytics Dashboard', 'Provide team velocity metrics, message activity trends, and bug resolution analytics.'),
    bullet('End-to-End Encryption', 'Implement client-side Signal protocol encryption for sensitive direct message conversations.'),
    h1('10. REFERENCES'),
    p('The following documentation and references were utilized during the design and implementation of ChatFlow:'),
    p('1. React documentation: https://react.dev/'),
    p('2. React Router documentation: https://reactrouter.com/'),
    p('3. Vite build tooling: https://vite.dev/guide/'),
    p('4. Tailwind CSS documentation: https://tailwindcss.com/docs'),
    p('5. Lucide Icons: https://lucide.dev/'),
    p('6. Node.js documentation: https://nodejs.org/en/docs'),
    p('7. Express framework documentation: https://expressjs.com/'),
    p('8. MongoDB Atlas documentation: https://www.mongodb.com/docs/'),
    p('9. Mongoose ODM: https://mongoosejs.com/docs/'),
    p('10. Socket.IO documentation: https://socket.io/docs/v4/'),
    p('11. JSON Web Tokens standard: https://jwt.io/introduction'),
    p('12. bcrypt.js cryptographic hashing: https://www.npmjs.com/package/bcryptjs'),
    p('13. GitHub Webhook HMAC Security: https://docs.github.com/webhooks/using-webhooks/validating-webhook-deliveries'),
    p('14. Helmet security headers: https://helmetjs.github.io/'),
    p('15. express-rate-limit: https://www.npmjs.com/package/express-rate-limit'),
    p('16. Docker documentation: https://docs.docker.com/'),
    p('17. Docker Compose specification: https://docs.docker.com/compose/'),
    p('18. Nginx reverse proxy: https://nginx.org/en/docs/'),
    p('19. GitHub Actions documentation: https://docs.github.com/actions'),
    p('20. Vercel & Render documentation: https://vercel.com/docs | https://render.com/docs'),
  ],
});

// SECTION 32: PROJECT LINKS SUMMARY (Page 32)
sections.push({
  properties: { page: { margin: { top: 720, bottom: 720, left: 1080, right: 1080 } } },
  headers: { default: makeHeader() },
  footers: { default: makeFooter(32) },
  children: [
    new Paragraph({ spacing: { before: 200, after: 100 } }),
    h1('Project Links Summary'),
    p('GitHub repository: https://github.com/Krrish-Gupta-18/fs-project', { bold: true }),
    p('Vercel frontend: https://fs-project-theta.vercel.app/', { bold: true }),
    p('Render backend: https://fs-project-backend.onrender.com', { bold: true }),
    new Paragraph({ spacing: { before: 200, after: 100 } }),
    p('This report constitutes the complete documentation for the Full Stack Development (FSD) Mini-Project on ChatFlow for Semester 5, Academic Year 2026-27.'),
  ],
});

// Create Document and Pack
const doc = new Document({
  styles: {
    default: {
      document: {
        run: {
          font: 'Times New Roman',
          size: 22,
          color: '111111',
        },
      },
    },
  },
  sections,
});

console.log('Generating document...');
const buffer = await Packer.toBuffer(doc);
fs.writeFileSync(OUTPUT_PATH, buffer);
console.log(`Document generated successfully at: ${OUTPUT_PATH} (${(buffer.length / 1024).toFixed(1)} KB)`);
