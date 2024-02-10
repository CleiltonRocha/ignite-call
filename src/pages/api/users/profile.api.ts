import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../auth/[...nextauth].api'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'

const uppdateProfileBodySchema = z.object({
  bio: z.string(),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'PUT') {
    return res.status(405).end()
  }

  try {
    const session = await getServerSession(
      req,
      res,
      buildNextAuthOptions(req, res),
    )

    if (!session) {
      return res.status(401).end()
    }

    const { bio } = uppdateProfileBodySchema.parse(req.body)

    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        bio,
      },
    })

    return res.status(204).end()
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).end()
    // Retorne o que desejar caso ocorra algum erro
  }
}
