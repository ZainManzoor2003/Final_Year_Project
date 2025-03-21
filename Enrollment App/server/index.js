require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const cors = require('cors');
const connection = require('./db')
const router = require('./routers/router')
const app = express();
const corsOptions = {
  origin: ['http://localhost:5173', 'https://fyp-enrollment-client.vercel.app'], // Replace with your allowed origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedhallowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Allowed methods
};
app.use(express.json())
app.use(bodyParser.json());
app.use(cookieParser())
app.use(cors(corsOptions));
app.use('/', router);
const port = 3001;


connection().then(() => {
    app.listen(port, () => {
        console.log('Server Connected at port', port);
    });

})