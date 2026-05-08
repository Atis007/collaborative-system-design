import { Liveblocks } from "@liveblocks/node"

const CURSOR_COLORS = [
  "#E63946",
  "#2196F3",
  "#4CAF50",
  "#FF9800",
  "#9C27B0",
  "#00BCD4",
  "#FF5722",
  "#607D8B",
  "#F06292",
  "#AED581",
]

export function getCursorColor(userId: string): string {
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) >>> 0
  }
  return CURSOR_COLORS[hash % CURSOR_COLORS.length]
}

const globalForLiveblocks = global as unknown as { liveblocks?: Liveblocks }

function createLiveblocks(): Liveblocks {
  const secret = process.env.LIVEBLOCKS_SECRET_KEY
  if (!secret) throw new Error("LIVEBLOCKS_SECRET_KEY is required at startup")
  return new Liveblocks({ secret })
}

export const liveblocks = globalForLiveblocks.liveblocks ?? createLiveblocks()

if (process.env.NODE_ENV !== "production") {
  globalForLiveblocks.liveblocks = liveblocks
}
