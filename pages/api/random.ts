import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // if req method is not GET
    // limit function to work only on GET request
    if (req.method !== 'GET') {
      return res.status(405).end();
    }

    // send request
    // check if signed in user exists
    await serverAuth(req, res);

    // movie count of all movies in database without loading them
    const moviesCount = await prismadb.movie.count();
    // create random index to generate random integer from user count
    const randomIndex = Math.floor(Math.random() * moviesCount);
    // find random movie object from database using pagination
    const randomMovies = await prismadb.movie.findMany({
      take: 1,
      skip: randomIndex
    });

    return res.status(200).json(randomMovies[0]);
    // error handling
  } catch (error) {
    console.log(error);

    return res.status(500).end();
  }
}