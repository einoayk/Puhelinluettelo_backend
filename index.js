const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')



morgan.token('content', getContent = (req) => {
    const body = req.body    
    return JSON.stringify(body)        
})

app.use(cors())

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
    res.json(persons)
})

app.get('/info', (req, res) => {
    res.send(`Puhelinluettelossa ${persons.length} henkilön tiedot ${Date()}`)
    
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if(person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
    
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateId = () => {
    return(
        Math.floor(Math.random() * Math.floor(1000))
    )    
}



app.post('/api/persons', (request, response) => {
    const body = request.body

    if (body.name === undefined || body.number === undefined) {
        return response.status(404).json({
            error: 'content missing'
        })
    } 
    
    if (persons.find(pers => pers.name === body.name)) {
        return response.status(404).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number        
    }

    persons = persons.concat(person)

    response.json(person)
})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})