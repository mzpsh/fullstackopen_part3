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

app.get('/info', (req, res, next) => {
    const now = new Date()
    Person.find({})
      .then(result => {
        const count = result.length
        res.send(
          `
          <p> Phonebook has info for ${count} people</p>
          <p>${now.toString()}</p>
          `
      )
      })
      .catch(error => {
        next(error)
      })
})

app.get('/api/persons', (req, res) => {
    Person.find({})
      .then(result => {
        res.json(result)
      })
      .catch(error => {
        next(error)
      })
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findById(id).then(result => {
    res.json(result)
  }).catch(error => {
    next(error)
  })
})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id

  Person.findByIdAndDelete(id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => {
      next(error)
    })

})

app.post('/api/persons', (req, res, next) => {
  const name = req.body.name
  const personJson = {
    ...req.body
  }

  Person.findOneAndUpdate({name: name}, personJson, { new: true, runValidators: true, context: 'query'})
    .then(result => {
      if (result !== null) {
        return result
      }
      const newPerson = new Person(personJson);
      return newPerson.save()
    })
    .then(result => {
      console.log(result)
      res.json(result)
    })
    .catch(error => {
      next(error)
    })

})

const erorrHandler = (error, req, res, next) => {
  console.log(error.name)
  console.log(error.message)

  if(error.name === 'CastError') {
    res.status(400).send({
      error: 'malformatted id'
    })
  } else if(error.name === 'ValidationError') {
    res.status(400).send({
      error: error.message,
    })
  } else {
    res.status(500).end() 
  }
  // return res.status(500).end()
}

app.use(erorrHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`)
})
