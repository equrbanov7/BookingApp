const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());

let reservations = []; 

app.get('/reservations', (req, res) => {
  res.json(reservations);
});

app.post('/reservations', (req, res) => {
  const newReservation = req.body;
  reservations.push(newReservation);
  res.status(201).json(newReservation);
});

app.listen(5000, () => {
  console.log('Mock server running on port 5000');
});
