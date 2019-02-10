if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/people')


morgan.token('content', getContent = (req) => {
    const body = req.body    
    return JSON.stringify(body)        
})

app.use(cors())

app.use(express.static('build'))

app.use(bodyParser.json())

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))


let persons = [
    {
        id:1,
        name: "Arto Hellas",
        number: "045-1236543"  
    },
    {
        id: 2,
        name: "Arto Järvinen",
        number: "041-21423123"
    },
    {
        id: 3,
        name: "Lea Kutvonen",
        number: "040-4323234"        
    },
    {
        id: 4,
        name: "Martti Tienari",
        number: "09-784232"
    }
]    

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons.map(person => person.toJSON()))
    })
})

app.get('/info', (req, res) => {
    Person.find({}).then(persons => {
        res.send(`PUhelinluettelossa ${persons.length} henkilön tiedot ${Date()}`)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person.toJSON())
            } else {
            response.status(404).end()}
        })
        .catch(error => next(error))    
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {            
            response.status(204).end()
        })
        .catch(error => next(error))
})

const generateId = () => {
    return(
        Math.floor(Math.random() * Math.floor(1000))
    )    
}

app.post('/api/persons', (request, response, next) => {
    const body = request.body

   /* if (body.name === undefined || body.number === undefined) {
        return response.status(404).json({
            error: 'content missing'
        })
    } 
    
    if (persons.find(pers => pers.name === body.name)) {
        return response.status(404).json({
            error: 'name must be unique'
        })
    } */

    const person = new Person({        
        name: body.name,
        number: body.number        
    })
    

    person.save().then(savedPerson => {
        response.json(savedPerson.toJSON())
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    
    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true})
        .then(updatedPerson => {
            response.json(updatedPerson.toJSON())
            console.log('lol')
        })
        .catch(error => next(error))            
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError' && error.kind == 'ObjectId') {
        return response.status(400).send({ error: 'malformatted id'})
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})