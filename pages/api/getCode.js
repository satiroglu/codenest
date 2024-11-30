import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const code = await prisma.codeSnippet.findUnique({
      where: { id: parseInt(id) },
    });

    if (!code) {
      return res.status(404).json({ message: 'Code not found' });
    }

    return res.status(200).json({ code: code.code });
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving code' });
  }
}