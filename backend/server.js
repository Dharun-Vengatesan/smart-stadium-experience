import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Basic status endpoint
app.get('/', (req, res) => {
  res.send('Smart Stadium Backend Running');
});

// Real-time queue data endpoint
app.get('/api/queues', (req, res) => {
  const mockQueues = [
    { id: '1', name: 'North Concession', wait: 4, level: 'low', insight: 'Optimal Flow' },
    { id: '2', name: 'South Concession', wait: 15, level: 'medium', insight: 'Moderate Demand' },
    { id: '3', name: 'Main Gate Bar', wait: 32, level: 'high', insight: 'Peak Traffic' }
  ];
  res.json(mockQueues);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
