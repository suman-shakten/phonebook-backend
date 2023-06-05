const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

const Person = require('./models/person');


app.use(cors());
app.use(express.json());
app.use(express.static('build'));

const morgan = require('morgan');
morgan.token('body', request => {
    return JSON.stringify(request.body);
});
app.use(morgan(':method :url :status :response-time ms :body'));



app.get('/api/persons', (request, response) => {
    Person.find({}).then((persons) => {
        response.json(persons);
    });
});

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number is missing'
        });
    }

    const person = new Person({
        name: body.name,
        number: body.number
    });

    person.save().then((savedPerson) => {
        response.json(savedPerson);
    });
});

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
        .then((person) => {
            if (person) {
                response.json(person);
            } else {
                response.status(404).end();
            }
        })
        .catch((error) => {
            console.log(error);
            response.status(400).send({ error: 'malformed id' });
        })
});

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id)
        .then((result) => {
            response.status(204).end()
        })
        .catch((error) => {
            response.status(404).end()
        })
});


const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
