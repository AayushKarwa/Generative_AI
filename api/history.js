let history = [];  // In-memory storage; consider using a database for production

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(history);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
