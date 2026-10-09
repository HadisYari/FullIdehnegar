import "server-only";
import fs from "node:fs/promises";
import path from "node:path";

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  locale: string;
  createdAt: string;
  emailSent: boolean;
};

const DATA_FILE = path.join(process.cwd(), "src", "data", "messages.json");

async function ensureFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "[]\n", "utf-8");
  }
}

export async function getMessages(): Promise<ContactMessage[]> {
  await ensureFile();
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  try {
    return JSON.parse(raw) as ContactMessage[];
  } catch {
    return [];
  }
}

export async function addMessage(msg: ContactMessage): Promise<void> {
  const messages = await getMessages();
  messages.unshift(msg);
  await fs.writeFile(DATA_FILE, JSON.stringify(messages, null, 2) + "\n", "utf-8");
}
