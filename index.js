require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(express.json())
app.use(morgan('method :url :status :res[content-length] - :response-time ms :body'));
app.use(cors())
app.use(express.static('dist'))

morgan.token('body', (request) => JSON.stringify(request.body))

app.get('/', (request, response) => {
  response.send('<h1>Phonebook API</h1>')
})

app.get('/info', (request, response) => {
  response.send(
    `<div>
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date()}</p>
    </div>`
  )
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const { name = '', number = ''} = request.body

  if (!name || !number) {
    return response.status(400).json({ error: 'missing name or number' })
  }

  const person = new Person({ name, number })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})