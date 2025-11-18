export type Product = {
  id: string;
  name: string;
  description: string;
  image: string;
  authorId: string;
  launchEndDate?: string;
  category?: string;
  upvotes?: number;
  comments?: number;
  target?: "B2C" | "B2B";
};

export const currentUserId = "user-1";


export const products: Product[] = [
  {
    id: "p-1",
    name: "TaskBeacon",
    description: "Simple task lists with shareable, public boards.",
    image: "/images/taskbeacon.webp",
    authorId: "user-1",
    category: "Productivity",
    upvotes: 142,
    comments: 23,
    target: "B2C",
  },
  {
    id: "p-2",
    name: "ChartLite",
    description: "Lightweight charts for dashboards and reports.",
    image: "/images/chartlite.webp",
    authorId: "user-3",
    category: "Analytics",
    upvotes: 89,
    comments: 12,
    target: "B2B",
  },
  {
    id: "p-3",
    name: "DocPilot",
    description: "Generate clean docs from code automatically.",
    image: "/images/docpilot.webp",
    authorId: "user-2",
    category: "Documentation",
    upvotes: 67,
    comments: 8,
    target: "B2B",
  },
  {
    id: "p-4",
    name: "MeetLoop",
    description: "Record meetings and summarize decisions.",
    image: "/images/meetloop.webp",
    authorId: "user-1",
    category: "Communication",
    upvotes: 234,
    comments: 41,
    target: "B2B",
  },
  {
    id: "p-5",
    name: "FitTrack",
    description: "Personal fitness tracking with social challenges.",
    image: "/images/fittrack.webp",
    authorId: "user-2",
    category: "Health",
    upvotes: 312,
    comments: 55,
    target: "B2C",
  },
  {
    id: "p-6",
    name: "InvoiceFlow",
    description: "Automated invoicing and payment reminders for freelancers.",
    image: "/images/invoiceflow.webp",
    authorId: "user-3",
    category: "Finance",
    upvotes: 178,
    comments: 29,
    target: "B2C",
  },
  {
    id: "p-7",
    name: "DataSift",
    description: "Real-time data streaming and analytics pipeline.",
    image: "/images/datasift.webp",
    authorId: "user-1",
    category: "Analytics",
    upvotes: 95,
    comments: 14,
    target: "B2B",
  },
  {
    id: "p-8",
    name: "CodeCollab",
    description: "Live collaborative code editor with voice chat.",
    image: "/images/codecollab.webp",
    authorId: "user-3",
    category: "Development",
    upvotes: 267,
    comments: 48,
    target: "B2B",
  },
];

export const userProducts: Product[] = products.filter(p => p.authorId === currentUserId);