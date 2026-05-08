import { clerkClient } from "@clerk/nextjs/server"

export interface ClerkUserInfo {
  email: string
  name: string | null
  imageUrl: string | null
}

export async function enrichEmailsWithClerkData(
  emails: string[],
): Promise<ClerkUserInfo[]> {
  if (emails.length === 0) return []

  try {
    const client = await clerkClient()
    const { data: users } = await client.users.getUserList({
      emailAddress: emails,
    })

    const userByEmail = new Map<string, (typeof users)[number]>()
    for (const user of users) {
      for (const ea of user.emailAddresses) {
        if (emails.includes(ea.emailAddress)) {
          userByEmail.set(ea.emailAddress, user)
        }
      }
    }

    return emails.map((email) => {
      const user = userByEmail.get(email)
      if (!user) return { email, name: null, imageUrl: null }
      const name =
        [user.firstName, user.lastName].filter(Boolean).join(" ") || null
      return { email, name, imageUrl: user.imageUrl ?? null }
    })
  } catch {
    return emails.map((email) => ({ email, name: null, imageUrl: null }))
  }
}
