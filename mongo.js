require('dotenv').config();
const mongoose = require('mongoose');

const url = process.env.MONGODB_URI || 'mongodb://localhost:27017';

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length < 3) {
  Person.find({}).then((result) => {
    console.log('phonebook:');
    result.forEach((person) => {
      console.log(person.name, ' ', person.number);
    });
    mongoose.connection.close();
    process.exit(1);
  });
} else {
  const name = process.argv[2];
  const number = process.argv[3];

  const person = new Person({
    name: name,
    number: number,
  });

  person.save().then(() => {
    console.log('Saved...');
    mongoose.connection.close();
    process.exit(1);
  });
}
