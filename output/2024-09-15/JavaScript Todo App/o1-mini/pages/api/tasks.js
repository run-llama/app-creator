import prisma from '../../lib/db'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: 'desc' },
    })
    res.status(200).json(tasks)
  } else if (req.method === 'POST') {
    const { title } = req.body
    if (!title) {
      return res.status(400).json({ error: 'Title is required' })
    }
    const task = await prisma.task.create({
      data: { title },
    })
    res.status(201).json(task)
  } else if (req.method === 'PUT') {
    const { id, completed } = req.body
    if (id === undefined || completed === undefined) {
      return res.status(400).json({ error: 'ID and completed status are required' })
    }
    const task = await prisma.task.update({
      where: { id: Number(id) },
      data: { completed: Boolean(completed) },
    })
    res.status(200).json(task)
  } else if (req.method === 'DELETE') {
    const { id } = req.body
    if (id === undefined) {
      return res.status(400).json({ error: 'ID is required' })
    }
    await prisma.task.delete({
      where: { id: Number(id) },
    })
    res.status(204).end()
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
