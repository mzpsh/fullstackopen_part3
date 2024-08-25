const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()
const url = process.env.MONGO_URL

mongoose.set('strictQuery', false)
mongoose.connect(url)
    .then(result => {
        console.log('connected to database')
    })
    .catch(error => {
        console.log('error connecting to database: ', error.messagr)
    })

const personScheme = new mongoose.Schema({
    id: String,
    name: String,
    number: String,
})

personScheme.set('toJSON', {
    transform: (doc, retObj) => {
        retObj.id = retObj._id.toString()
        delete retObj._id 
        delete retObj.__v 
    }
})

module.exports = mongoose.model('Person', personScheme)

