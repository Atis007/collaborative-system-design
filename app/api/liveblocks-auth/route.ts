import { currentUser } from "@clerk/nextjs/server"
import { type NextRequest, NextResponse } from "next/server"
import { getCursorColor, liveblocks } from "@/lib/liveblocks"
import { getProjectWithAccess } from "@/lib/project-access"

export async function POST(request: NextRequest) {
  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 })
  }
  const room: string | undefined = (body as Record<string, unknown>)?.room as
    | string
    | undefined
  if (!room) {
    return NextResponse.json({ error: "room is required" }, { status: 400 })
  }

  const access = await getProjectWithAccess(room)
  if (!access) {
    return NextResponse.json(
      { error: "forbidden", reason: "No access to this project" },
      { status: 403 },
    )
  }

  await liveblocks.getOrCreateRoom(room, { defaultAccesses: [] })

  const name =
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.emailAddresses[0]?.emailAddress ||
    user.id
  const avatar = user.imageUrl ?? ""
  const color = getCursorColor(user.id)

  const session = liveblocks.prepareSession(user.id, {
    userInfo: { name, avatar, color },
  })
  session.allow(room, session.FULL_ACCESS)

  const { status, body: sessionBody } = await session.authorize()
  return new Response(sessionBody, { status })
}
