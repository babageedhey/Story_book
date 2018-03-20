const express                       = require('express');
const mongoose                      = require('mongoose');
const passport                      = require('passport');

const app                           = express();
const port                          = process.env.PORT || 3000;

//Passport Config
require('./config/passport')(passport);
//Load ROutes
const auth                          = require('./routes/auth');



//Index Page route
app.get('/', (req, res)=>{
    res.send('Index page loading');
})

//Use Routes
app.use ('/auth', auth);



// Starting the server
app.listen(port, ()=>{
    console.log(`Server started on port ${port}`)
});