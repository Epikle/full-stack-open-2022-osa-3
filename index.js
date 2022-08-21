const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

morgan.token('postdata', (req, res) => JSON.stringify(req.body));
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :postdata'
  )
);
app.use(express.json());
app.use(cors());

app.use(express.static('build'));

//DUMMY DATA
let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1,
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: 2,
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: 3,
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: 4,
  },
];

app.get('/info', (req, res) => {
  const personsArrayLength = persons.length;
  res.send(`
  Phonebook has info for ${personsArrayLength} people<br />
  ${Date()}
  `);
});

//API
//CREATE new person
app.post('/api/persons', (req, res) => {
  const body = req.body;
  const existingPerson = persons.find((person) => person.name === body.name);
  const errors = [];

  !body.name && errors.push('name is missing');
  !body.number && errors.push('number is missing');
  existingPerson && errors.push('name must be unique');

  if (errors.length > 0) {
    return res.status(400).json({
      error: errors.join(', '),
    });
  }

  const newPerson = {
    name: body.name,
    number: body.number,
    id: Math.random(),
  };

  persons = persons.concat(newPerson);
  res.json(newPerson);
});

//READ all
app.get('/api/persons', (req, res) => {
  res.json(persons);
});

//READ by id
app.get('/api/persons/:id', (req, res) => {
  const { id } = req.params;
  const person = persons.find((person) => person.id === +id);
  if (!person) {
    return res.status(404).end();
  }
  res.json(person);
});

//DELETE by id
app.delete('/api/persons/:id', (req, res) => {
  const { id } = req.params;
  persons = persons.filter((person) => person.id !== +id);
  res.status(204).end();
});

//NOT FOUND
app.use((req, res) => {
  res.status(404).json({ error: 'unknown endpoint' });
});

//SERVER
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
