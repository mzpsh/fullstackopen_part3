const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please enter password as first argument.')
    process.exit(1);
}

const password = process.argv[2]

const url = `mongodb+srv://gamer:${password}@cluster0.wiqwb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personScheme = new mongoose.Schema({
    id: String,
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personScheme)

if (process.argv.length === 5 || process.argv.length === 3) {
    if (process.argv.length === 3) {
        console.log('Retrieving all phonebook entries...');
        Person.find({}).then(result => {
            if (result < 1) {
                console.log('Phonebook is empty.')
            } else {
                result.forEach(person => console.log(person))
            }
            mongoose.connection.close()
            process.exit(1)
        })
    } else {
        const newPerson = new Person({
            id: Math.floor(Math.random() * 1000),
            name: process.argv[3],
            number: process.argv[4],
        })
        console.log('Submitting new entry...')
        newPerson.save().then(result => {
            console.log(newPerson)
            console.log('New entry added.')
            mongoose.connection.close()
            process.exit(1)
        })
    }
} else {
    console.log('Provide password, name, and number as argument to add a new phonebook entry. Or only provide password to view all phonebook entries.')
    mongoose.connection.close()
    process.exit(1)
}