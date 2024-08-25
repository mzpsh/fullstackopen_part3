const express = require("express")
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/info', (req, res) => {
    const now = new Date()
    res.send(
        `
        <p> Phonebook has info for ${persons.length} people</p>
        <p>${now.toString()}</p>
        `
    )
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(result => {
        res.json(result)
      })
})

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  Person.findById(id).then(result => {
    res.json(result)
  }).catch(error => {
    res.status(404).end()
    console.log(error.message)
  })
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  persons = persons.filter(person => person.id !== id);

  // console.log(persons)
  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const personJson = {
    id: Math.floor((Math.random() * 1000)).toString(),
    ...req.body
  }

  const newPerson = new Person(personJson)

  newPerson.save()
    .then(result => {
      res.json(result)
    })

  // if (person.name && person.number) {
  //   if (persons.filter((insidePerson) => insidePerson.name === person.name).length > 0) {
  //     res
  //       .status(400)
  //       .json({
  //         "error": "name already exists"
  //       })
  //   } else {
  //     persons.push(person)
  //     res.json(person)
  //   }
  // } else {
  //   res
  //     .status(400)
  //     .json({
  //       "error": "name or number is missing"
  //     })
  // }

})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`)
})
