import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // limit to GET request Api call
    if (req.method !== 'GET') {
      return res.status(405).end();
    }

    await serverAuth(req, res);

    // get movie id from request.query which is defined by [movieid] route name
    const { movieId } = req.query;

    // check if string
    if (typeof movieId !== 'string') {
      throw new Error('Invalid Id');
    }

    // check if movie id exists
    if (!movieId) {
      throw new Error('Missing Id');
    }

    // find movies 
    const movies = await prismadb.movie.findUnique({
      where: {
        id: movieId
      }
    });

    // return movies
    return res.status(200).json(movies);
    // error handling
  } catch (error) {
    console.log(error);
    return res.status(500).end();
  }
}
