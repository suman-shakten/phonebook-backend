const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('tiny'));

let persons = [
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

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map((person) => person.id))
        : 0;
    return maxId + 1;
}

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'Name or number is missing'
        });
    };

    const duplicatePerson = persons.find((person) => person.name === body.name);
    if (duplicatePerson) {
        return response.status(400).json({
            error: 'Name must be unique'
        });
    };

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    };

    persons = persons.concat(person);
    response.json(person);
})

app.get('/', (request, response) => {
    response.send('<h1>Phonebook-Backend</h1>');
});

app.get('/api/persons', (request, response) => {
    response.json(persons);
});

app.get('/info', (request, response) => {
    response.send(`<div>
    <p>Phonebook has info for ${persons.length} people.</p>
     <p>${new Date()}</p>
     </div>`);
});

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find((person) => person.id === id)

    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
});

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter((person) => person.id !== id);

    response.status(204).end();
});


const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
