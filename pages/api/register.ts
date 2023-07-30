import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';

// Register Api route
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // limit handler to POST call only to register route
        if (req.method !== 'POST') {
            return res.status(405).end();
        }

        // extract required values from req body
        const { email, name, password } = req.body;

        // check if email is taken
        const existingUser = await prismadb.user.findUnique({
            where: {
                email
            }
        })

        // if existing user exists
        if (existingUser) {
            return res.status(422).json({ error: 'Email taken' });
        }

        // hash user password
        const hashedPassword = await bcrypt.hash(password, 12);

        // save hashpassword in new user model
        const user = await prismadb.user.create({
            data: {
                email,
                name,
                hashedPassword,
                image: '',
                emailVerified: new Date(),
            }
        })

        return res.status(200).json(user);
        // handler error
    }   catch (error) {
        return res.status(400).json({ error: `Something went wrong: ${error}` });
    }
}