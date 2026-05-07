import { SignUp } from "@clerk/nextjs"
import { AuthSidebar } from "@/components/auth/auth-sidebar"

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-bg-base flex font-sans">
      <AuthSidebar />
      <div className="flex flex-1 items-center justify-center px-4">
        <SignUp />
      </div>
    </div>
  )
}
