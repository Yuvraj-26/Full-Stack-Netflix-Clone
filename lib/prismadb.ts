import { PrismaClient } from '@prisma/client'

// Save primsa client in a global file to prevent hot relouding during development
const client = global.prismadb || new PrismaClient()
if (process.env.NODE_ENV !== 'production') global.prismadb = client

export default client