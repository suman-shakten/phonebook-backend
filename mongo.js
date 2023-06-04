const mongoose = require('mongoose');

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

if (!password) {
    console.log('give password as argument');
    process.exit(1);
}

const url = `mongodb+srv://fullstack:${password}@cluster0.8pwqipz.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    number: Number,
})

const Person = mongoose.model('Person', personSchema);

if (name && number) {
    const person = new Person({
        name: name,
        number: number,
    });

    person.save().then((result) => {
        console.log(`added ${name} number ${number} to phonebook`);
        mongoose.connection.close();
    });
} else {
    Person.find({}).then((result) => {
        console.log('phonebook')
        result.forEach((person) => {
            console.log(`${person.name} ${person.number}`);
        })
        mongoose.connection.close();
    })
}

