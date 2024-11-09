const express = require('express')
const morgan = require('morgan')

const app = express()

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

const generateId = () => {
  const id = Math.floor(Math.random() * 10000);
  return String(id)
}

app.use(express.json())
app.use(morgan('tiny'))


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
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)

  person ? response.json(person) : response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const { name = '', number = ''} = request.body
  const isNameInPhoneBook = persons.find(person => person.name === name)

  if (!name || !number) {
    // calling return is crucial to stop the execution of the function
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  }

  if (isNameInPhoneBook) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  const person = {
    name,
    number,
    id: generateId(),
  }

  person.id = generateId()
  persons = persons.concat(person)

  response.json(person)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const PORT = 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})