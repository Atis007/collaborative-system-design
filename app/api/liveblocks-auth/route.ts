import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getProjectWithAccess } from "@/lib/project-access";
import { liveblocks, getCursorColor } from "@/lib/liveblocks";

export async function POST(request: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const room: string | undefined = body?.room;
  if (!room) {
    return NextResponse.json({ error: "room is required" }, { status: 400 });
  }

  const access = await getProjectWithAccess(room);
  if (!access) {
    return NextResponse.json(
      { error: "forbidden", reason: "No access to this project" },
      { status: 403 },
    );
  }

  await liveblocks.getOrCreateRoom(room, { defaultAccesses: [] });

  const name =
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.emailAddresses[0]?.emailAddress ||
    user.id;
  const avatar = user.imageUrl ?? "";
  const color = getCursorColor(user.id);

  const session = liveblocks.prepareSession(user.id, {
    userInfo: { name, avatar, color },
  });
  session.allow(room, session.FULL_ACCESS);

  const { status, body: sessionBody } = await session.authorize();
  return new Response(sessionBody, { status });
}
