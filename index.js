require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const Person = require('./models/person');

const app = express();

morgan.token('postdata', (req) => JSON.stringify(req.body));
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :postdata'
  )
);
app.use(express.json());
app.use(cors());
app.use(express.static('build'));

//info page
app.get('/info', (req, res, next) => {
  let personsArrayLength = 0;
  Person.find({})
    .then((person) => {
      personsArrayLength = person.length;
      res.send(`
      Phonebook has info for ${personsArrayLength} people<br />
      ${Date()}
      `);
    })
    .catch((error) => next(error));
});

//API
//CREATE new person
app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body;

  const person = new Person({
    name: name,
    number: number,
  });

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((error) => next(error));
});

//READ all
app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then((person) => {
      res.json(person);
    })
    .catch((error) => next(error));
});

//READ by id
app.get('/api/persons/:id', (req, res, next) => {
  const { id } = req.params;

  Person.findById(id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

//UPDATE by id
app.put('/api/persons/:id', (req, res, next) => {
  const { id } = req.params;
  const { name, number } = req.body;

  const person = {
    name: name,
    number: number,
  };

  Person.findByIdAndUpdate(id, person, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((updatedPerson) => {
      if (updatedPerson) {
        res.json(updatedPerson);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

//DELETE by id
app.delete('/api/persons/:id', (req, res, next) => {
  const { id } = req.params;

  Person.findByIdAndRemove(id)
    .then(() => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

//NOT FOUND
app.use((req, res) => {
  res.status(404).json({ error: 'unknown endpoint' });
});

//ERROR HANDLING
app.use((error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'check id format' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  } else if (error.name === 'MongoServerError' && error.code === 11000) {
    return res.status(400).json({ error: 'duplicate value' });
  }

  res.status(500).json({ error: 'something went wrong' });
});

//SERVER
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
