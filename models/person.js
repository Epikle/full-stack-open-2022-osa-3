const mongoose = require('mongoose');

const url = process.env.MONGODB_URI || 'mongodb://localhost:27017';

mongoose
  .connect(url)
  .then(() => {
    console.log('connected to db...');
  })
  .catch((err) => {
    console.log('error connecting to db: ', err.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    minlength: 3,
    required: true,
  },
  number: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
      validator: (v) => {
        return /^\d{2,3}-\d{4,}/.test(v);
      },
      message: (props) =>
        `${props.value} is not a valid phone number! (555-5555)`,
    },
  },
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Person', personSchema);
