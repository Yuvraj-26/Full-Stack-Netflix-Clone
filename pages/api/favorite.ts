import { NextApiRequest, NextApiResponse } from "next";
import { without } from "lodash";

import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // handle POST method
    if (req.method === 'POST') {
      // get current user
      const { currentUser } = await serverAuth(req, res);

      // get movie id
      const { movieId } = req.body;

      // find a movie using the movie id
      const existingMovie = await prismadb.movie.findUnique({
        where: {
          id: movieId,
        }
      });

      // if no existing movie
      if (!existingMovie) {
        throw new Error('Invalid ID');
      }

      // update user and push favourited movie to prisma schema 
      const user = await prismadb.user.update({
        where: {
          email: currentUser.email || '',
        },
        data: {
          favoriteIds: {
            push: movieId
          }
        }
      });

      // return updated user
      return res.status(200).json(user);
    }

    // handle delete request
    if (req.method === 'DELETE') {
      // get current user
      const { currentUser } = await serverAuth(req, res);

      // get movie id
      const { movieId } = req.body;

      // find existing movie
      const existingMovie = await prismadb.movie.findUnique({
        where: {
          id: movieId,
        }
      });

      // if no existing movie
      if (!existingMovie) {
        throw new Error('Invalid ID');
      }

      // update favourite ids
      const updatedFavoriteIds = without(currentUser.favoriteIds, movieId);

      // update user using prisma db schema
      const updatedUser = await prismadb.user.update({
        where: {
          email: currentUser.email || '',
        },
        data: {
          favoriteIds: updatedFavoriteIds,
        }
      });

      // return updated  user
      return res.status(200).json(updatedUser);
    }

    // handle if not POST OR DELETE method
    return res.status(405).end();
    // error handling
  } catch (error) {
    console.log(error);

    return res.status(500).end();
  }
}
