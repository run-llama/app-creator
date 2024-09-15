import db from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { rows } = await db.query('SELECT * FROM tasks');
    return res.status(200).json(rows);
  }

  if (req.method === 'POST') {
    const { task } = req.body;
    const { rows } = await db.query('INSERT INTO tasks (task, completed) VALUES ($1, $2) RETURNING *', [task, false]);
    return res.status(201).json(rows[0]);
  }

  if (req.method === 'DELETE') {
    const { id } = req.body;
    await db.query('DELETE FROM tasks WHERE id = $1', [id]);
    return res.status(204).json({});
  }

  if (req.method === 'PUT') {
    const { id, completed } = req.body;
    await db.query('UPDATE tasks SET completed = $1 WHERE id = $2', [completed, id]);
    return res.status(204).json({});
  }

  res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PUT']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
