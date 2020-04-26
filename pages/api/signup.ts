import { PrismaClient } from '@prisma/client';
import { RequestHandler } from 'express';

const signUp: RequestHandler = async (req, res) => {
  console.log({ body: req.body });
  if (req.method === 'POST') {
    const prisma = new PrismaClient();
    const { name, email, password } = req.body;
    const user = await prisma.user.create({ data: { name, email, password } });
    res.send(JSON.stringify(user));
  }
};

export default signUp;
