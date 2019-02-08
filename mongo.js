const mongoose = require('mongoose')

if ( process.argv.length<3 ) {
    console.log('give password as argument')
    process.exit(1)
} else {
    const password = process.argv[2]

    const url = process.env.MONGODB_URI

    console.log('connecting to', url)

    mongoose.connect(url, { useNewUrlParser: true})
        .then(result => {
            console.log('connected to MondoDB')
        })
        .catch((error) => {
            console.log('error connection to MongoDB:', error.message)
        })

    const personSchema = new mongoose.Schema({
        name: String,
        number: String
    })

    personSchema.set('toJSON', {
        transform: (document, returnedObject) => {
            delete returnedObject._id
            delete returnedObject._v
        }
    })

    const Person = mongoose.model('Person', personSchema)
        
    if (process.argv.length===5) { 
        const person = new Person({
            name: process.argv[3],
            number: process.argv[4]
        })

        person.save().then(response => {
            console.log(`lisätään ${person.name} numero ${person.number} luetteloon`)
            mongoose.connection.close()
        })
    } else if (process.argv.length===3) {
        Person.find({}).then(result => {
            result.forEach(note => {
                console.log(note)
            })
            mongoose.connection.close()
        })
    }  
}   
