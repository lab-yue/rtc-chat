import { PrismaClient } from '@prisma/client';
import { RequestHandler } from 'express';

const signUp: RequestHandler = async (req, res) => {
  if (req.method === 'POST') {
    const prisma = new PrismaClient({ errorFormat: 'pretty' });
    const { email, password } = req.body;
    if (!email) {
      res.status(400).json([{ message: 'is required', ref: 'email' }]);
      return;
    }

    if (!password) {
      res.status(400).json([{ message: 'is required', ref: 'password' }]);
      return;
    }

    try {
      const user = await prisma.user.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json([{ message: 'no user related to email', ref: 'email' }]);
      }
      if (user.password !== password) {
        res.status(400).json([{ message: 'is wrong', ref: 'password' }]);
        return;
      }
      res.json(user);
    } catch (e) {
      res.status(400).json(e.meta.target.map((t: string) => ({ message: `please check ${t}`, ref: t })));
    }
  }
};

export default signUp;
