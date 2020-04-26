import { PrismaClient } from '@prisma/client';
import { RequestHandler } from 'express';

const signUp: RequestHandler = async (req, res) => {
  if (req.method === 'POST') {
    const prisma = new PrismaClient({ errorFormat: 'pretty' });
    const { name, email, password } = req.body;
    if (!name) {
      res.status(400).json([{ message: 'required', ref: 'name' }]);
      return;
    }

    if (!password) {
      res.status(400).json([{ message: 'required', ref: 'password' }]);
      return;
    }

    try {
      const user = await prisma.user.create({ data: { name, email, password } });
      res.json(user);
    } catch (e) {
      res.status(400).json(e.meta.target.map((t: string) => ({ message: `please check ${t}`, ref: t })));
    }
  }
};

export default signUp;
