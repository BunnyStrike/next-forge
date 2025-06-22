import { auth } from "@repo/auth/server"
import { toNextJsHandler } from "better-auth/next-js"

const handler = toNextJsHandler(auth.handler)

export { handler as GET, handler as POST } 