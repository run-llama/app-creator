import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const tasks = await prisma.task.findMany();
    res.status(200).json(tasks);
  } else if (req.method === 'POST') {
    const { title } = req.body;
    const task = await prisma.task.create({
      data: { title, completed: false },
    });
    res.status(201).json(task);
  } else if (req.method === 'DELETE') {
    const { id } = req.body;
    await prisma.task.delete({
      where: { id },
    });
    res.status(204).end();
  } else if (req.method === 'PATCH') {
    const { id, completed } = req.body;
    const task = await prisma.task.update({
      where: { id },
      data: { completed },
    });
    res.status(200).json(task);
  } else {
    res.status(405).end();
  }
}
