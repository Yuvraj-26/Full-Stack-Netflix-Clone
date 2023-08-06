import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import prismadb from '@/lib/prismadb';
import { authOptions } from "@/pages/api/auth/[...nextauth]";

// serverAuth will be reused to see if user exists and is signed in
// ServerAuth used in Api controllers
// Pass the request parameter which holds the JSON jvt web token which get session can use to locate our user that is signed in

const serverAuth = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  // if no session
  if (!session?.user?.email) {
    throw new Error('Not signed in');
  }

  // fetch current user
  const currentUser = await prismadb.user.findUnique({
    where: {
      email: session.user.email,
    }
  });
  
  // if no current user
  if (!currentUser) {
    throw new Error('Not signed in');
  }

  return { currentUser };
}

export default serverAuth;