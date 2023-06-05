require('dotenv').config();

const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static('build'));

const morgan = require('morgan');
morgan.token('body', request => {
    return JSON.stringify(request.body);
});
app.use(morgan(':method :url :status :response-time ms :body'));

const cors = require('cors');
app.use(cors());

const mongoose = require('mongoose');
const Person = require('./models/person');

app.get('/api/persons', (request, response) => {
    Person.find({}).then((persons) => {
        response.json(persons);
    });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
