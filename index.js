const { response } = require('express')
const express = require('express')
const nodemon = require('nodemon')
const morgan = require('morgan')

morgan.token('newname', req => req.body.name)
morgan.token('number', req => req.body.number)

const app = express()

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms {"name":":newname", "number":":number"}'))

let notes = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/info', (req, res) => {
  const date = new Date()
  res.send(`Phonebook has info for ${notes.length} people. The date is ${date}`)
})

app.get('/api/persons', (req, res) => {
  res.json(notes)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const note = notes.find(note => note.id === id)

  if (note) {
    res.json(note)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  notes = notes.filter(note => note.id !== id)

  res.status(204).end()
})

app.post('/api/persons/', (req, res) => {
  const note = req.body

  // Generate ID
  const max = 10000
  const min = 1
  const id = Math.floor(Math.random() * (max - min) + min)

  // Error handling
  if (!note.hasOwnProperty('name')) {
    res.status(404).end(`Error: name is missing in request!`)
  } else if (notes.find(entries => entries.name === note.name)) {
    res.status(404).end(`Error: the name ${note.name} already exists!`)
  } else {
    note.id = id
    notes = notes.concat(note) 
    res.json(notes)
  }
})


const PORT = 3001
app.listen(PORT, console.log(`Successfully connected to port ${PORT}`))