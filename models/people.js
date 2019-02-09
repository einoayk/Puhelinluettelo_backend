const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
    
const url = 'mongodb://fullstack:salaisuus1@ds163164.mlab.com:63164/fullstack2019-people'

console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true })
    .then(result => {
        console.log('connected to MondoDB')
    })
    .catch((error) => {
        console.log('error connection to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({      
    name: { type: String, minlength: 3, required: true, unique: true },
    number: { type: String, minlength: 8, required: true, unique: false }
})

personSchema.plugin(uniqueValidator, { type: 'mongoose-unique-validator' })

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Person = mongoose.model('Person', personSchema)    
 
module.exports = mongoose.model('Person', personSchema)