import { NextApiRequest, NextApiResponse } from "next";
import serverAuth from "@/lib/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // limit function to only GET requests
    if (req.method !== 'GET') {
      // status 405 for wrong method
      return res.status(405).end();
    }

    // fetch current user
    const { currentUser } = await serverAuth(req, res);

    return res.status(200).json(currentUser);
  } catch (error) {
    console.log(error);
    return res.status(500).end();
  }
}