import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/serverAuth";

// export handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // limit to GET Api call request method
    if (req.method !== 'GET') {
      return res.status(405).end();
    }

    await serverAuth(req, res);

    // load all movies from database
    const movies = await prismadb.movie.findMany();

    return res.status(200).json(movies);
  } catch (error) {
    console.log({ error })
    return res.status(500).end();
  }
}
