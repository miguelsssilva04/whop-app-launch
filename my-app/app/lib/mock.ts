export type Product = {
  id: string;
  name: string;
  description: string;
  pageDescription?: string;
  image: string;
  authorId: string;
  launchEndDate?: string;
  category?: string;
  upvotes?: number;
  comments?: number;
  target?: "B2C" | "B2B";
  creatorName?: string;
  creatorUsername?: string;
  testAppUrl?: string;
};

export const currentUserId = "user-1";


export const products: Product[] = [
  {
    id: "p-1",
    name: "TaskBeacon",
    description: "Simple task lists with shareable, public boards.",
    pageDescription: `TaskBeacon is the fastest way to turn ideas into action.

**What you get:**
- Unlimited public boards – share a link, no sign-up required
- Unlimited private lists – keep personal goals under wraps
- Real-time sync – changes appear instantly for every viewer
- Markdown & checklists – rich formatting with zero learning curve
- Mobile-first PWA – works offline, installs like a native app
- One-click duplicate – fork any board and make it yours
- Custom themes – light, dark, or your brand colors
- Embeddable widgets – drop a board into Notion, Confluence, or your blog

**Built for:**
- Freelancers juggling client deliverables
- Students organizing group projects
- Remote teams running weekly sprints
- Families planning vacations
- Creators publishing public roadmaps

**Power features:**
⚡ Sub-task nesting – break big items into bite-size steps  
⚡ Comment threads – discuss tasks without leaving the board  
⚡ Due-date reminders – get gentle nudges via email or push  
⚡ Activity feed – see who did what, when  
⚡ CSV & JSON export – take your data anywhere  
⚡ REST API – integrate with Zapier, Make, or your own stack

**Zero friction:**
No accounts, no passwords, no credit card. Create a board in 5 seconds, share it in 1. When you need more, upgrade in two clicks and keep every link alive.

Join 40 000+ makers who replaced Trello, Google Docs, and sticky notes with one lightweight tool that just works.`,
    image: "/images/taskbeacon.webp",
    authorId: "user-1",
    category: "Productivity",
    upvotes: 142,
    comments: 23,
    target: "B2C",
    creatorName: "Miguel Silva",
    creatorUsername: "miguelstsilva",
  },
  {
    id: "p-2",
    name: "ChartLite",
    description: "Lightweight charts for dashboards and reports.",
    pageDescription: "ChartLite delivers pixel-perfect charts that load in milliseconds. Drop them into any dashboard, embed in reports, or render thousands on a single page without lag. One npm install gives you line, bar, area, and donut charts with full TypeScript support and zero dependencies.",
    image: "/images/chartlite.webp",
    authorId: "user-3",
    category: "Analytics",
    upvotes: 89,
    comments: 12,
    target: "B2B",
    creatorName: "Jordan Kim",
  },
  {
    id: "p-3",
    name: "DocPilot",
    description: "Generate clean docs from code automatically.",
    pageDescription: "DocPilot scans your repo every push and turns comments, type hints, and README fragments into a polished documentation site. Keep docs in sync without writing markdown—just annotate code and let DocPilot handle the rest. Ideal for open-source maintainers and fast-moving teams.",
    image: "/images/docpilot.webp",
    authorId: "user-2",
    category: "Documentation",
    upvotes: 67,
    comments: 8,
    target: "B2B",
    creatorName: "Sam Patel",
  },
  {
    id: "p-4",
    name: "MeetLoop",
    description: "Record meetings and summarize decisions.",
    pageDescription: "MeetLoop joins your Zoom, Teams, or Meet calls, records every word, and emails you a concise summary with action items and owner tags. Search across past meetings, jump to key moments, and sync tasks to Jira, Trello, or Slack. Never ask “Who said that?” again.",
    image: "/images/meetloop.webp",
    authorId: "user-1",
    category: "Communication",
    upvotes: 234,
    comments: 41,
    target: "B2B",
    creatorName: "Taylor Nguyen",
  },
  {
    id: "p-5",
    name: "FitTrack",
    description: "Personal fitness tracking with social challenges.",
    pageDescription: "FitTrack turns workouts into bite-sized challenges you can share with friends. Track runs, lifts, and yoga sessions, earn badges, and climb leaderboards. Weekly community races keep motivation high, while private dashboards give deep insights into heart-rate zones, calorie burn, and recovery.",
    image: "/images/fittrack.webp",
    authorId: "user-2",
    category: "Health",
    upvotes: 312,
    comments: 55,
    target: "B2C",
    creatorName: "Morgan Blake",
  },
  {
    id: "p-6",
    name: "InvoiceFlow",
    description: "Automated invoicing and payment reminders for freelancers.",
    pageDescription: "InvoiceFlow watches your calendar and GitHub commits to auto-generate invoices the moment a milestone ends. Send polite reminders via email and SMS, accept cards, ACH, or crypto, and reconcile everything in QuickBooks or Xero. Spend minutes, not Mondays, on billing.",
    image: "/images/invoiceflow.webp",
    authorId: "user-3",
    category: "Finance",
    upvotes: 178,
    comments: 29,
    target: "B2C",
    creatorName: "Casey Morgan",
  },
  {
    id: "p-7",
    name: "DataSift",
    description: "Real-time data streaming and analytics pipeline.",
    pageDescription: "DataSift ingests millions of events per second from Kafka, Kinesis, or Pub/Sub, enriches them with ML models, and streams clean data to Snowflake, BigQuery, or Redshift. Built-in anomaly detection alerts you before KPIs drift. Scale from startup to enterprise without rewriting code.",
    image: "/images/datasift.webp",
    authorId: "user-1",
    category: "Analytics",
    upvotes: 95,
    comments: 14,
    target: "B2B",
    creatorName: "Riley Chen",
  },
  {
    id: "p-8",
    name: "CodeCollab",
    description: "Live collaborative code editor with voice chat.",
    pageDescription: "CodeCollab combines VS Code-grade IntelliSense with multiplayer cursors and crystal-clear voice chat. Share a URL and pair-program instantly—no repo clone, no setup. AI autocomplete learns from your codebase and suggests context-aware snippets while you talk.",
    image: "/images/codecollab.webp",
    authorId: "user-3",
    category: "Development",
    upvotes: 267,
    comments: 48,
    target: "B2B",
    creatorName: "Drew Thompson",
  },
];

export const userProducts: Product[] = products.filter(p => p.authorId === currentUserId);