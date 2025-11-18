export type Product = {
  id: string;
  name: string;
  description: string;
  image: string;
  authorId: string;
  launchEndDate?: string;
};

export const currentUserId = "user-1";

export const launchingNow: Product[] = [
  {
    id: "ln-1",
    name: "FocusFlow",
    description: "Minimal Pomodoro timer with team sharing.",
    image: "/images/focusflow.webp",
    authorId: "user-2",
    launchEndDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ln-2",
    name: "SnapShelf",
    description: "Screenshot organizer that auto-tags by content.",
    image: "/images/snapshelf.webp",
    authorId: "user-3",
    launchEndDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ln-3",
    name: "MailSketch",
    description: "AI drafts for outreach with human edit-first UX.",
    image: "/images/mailsketch.webp",
    authorId: "user-4",
    launchEndDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 3600_000).toISOString(),
  },
];

export const products: Product[] = [
  {
    id: "p-1",
    name: "TaskBeacon",
    description: "Simple task lists with shareable, public boards.",
    image: "/images/taskbeacon.webp",
    authorId: "user-1",
  },
  {
    id: "p-2",
    name: "ChartLite",
    description: "Lightweight charts for dashboards and reports.",
    image: "/images/chartlite.webp",
    authorId: "user-3",
  },
  {
    id: "p-3",
    name: "DocPilot",
    description: "Generate clean docs from code automatically.",
    image: "/images/docpilot.webp",
    authorId: "user-2",
  },
  {
    id: "p-4",
    name: "MeetLoop",
    description: "Record meetings and summarize decisions.",
    image: "/images/meetloop.webp",
    authorId: "user-1",
  },
];

export const userProducts: Product[] = products.filter(p => p.authorId === currentUserId);