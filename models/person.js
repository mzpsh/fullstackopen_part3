const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()
const url = process.env.MONGO_URL

mongoose.set('strictQuery', false)
mongoose.connect(url)
  .then(() => {
    console.log('connected to database')
  })
  .catch(error => {
    console.log('error connecting to database: ', error.messagr)
  })

const personScheme = new mongoose.Schema({
  id: String,
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: {
      minlength: 8,
      validator: function(v) {
        return /\d{2,3}-\d{4,8}/.test(v)
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'User phone number required']
  },
})

personScheme.set('toJSON', {
  transform: (doc, retObj) => {
    retObj.id = retObj._id.toString()
    delete retObj._id
    delete retObj.__v
  }
})

module.exports = mongoose.model('Person', personScheme)

