import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: "/auth/signin",
  },
})

// This middleware applies only to the root route
export const config = {
  matcher: ["/"],
};

