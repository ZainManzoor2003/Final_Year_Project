require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const connection = require('./db')
const router = require('./routers/router')
const app = express();
app.use(express.json())
app.use(bodyParser.json());
const corsOptions = {
  origin: ['http://localhost:5173'], // Replace with your allowed origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedhallowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Allowed methods
};

app.use(cors(corsOptions));
app.use('/', router);
const port = 3001;


connection().then(() => {
    app.listen(port, () => {
        console.log('Server Connected at port', port);
    });

})

