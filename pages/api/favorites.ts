import { NextApiRequest, NextApiResponse } from "next";

import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/serverAuth";

// handler accepts request and response
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // limit route only to GET api request call
    if (req.method !== 'GET') {
      return res.status(405).end();
    }

    // get current user
    const { currentUser } = await serverAuth(req, res);

    // get favourited movies
    const favoritedMovies = await prismadb.movie.findMany({
      where: {
        id: {
          in: currentUser?.favoriteIds,
        }
      }
    });

    // return favourited movies
    return res.status(200).json(favoritedMovies);
    // error handling
  } catch (error) {
    console.log(error);
    return res.status(500).end();
  }
}
