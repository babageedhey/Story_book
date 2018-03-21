const express                       = require('express');
const mongoose                      = require('mongoose');
const passport                      = require('passport');
const session                       = require('express-session');
const cookieParser                  = require('cookie-parser');
const app                           = express();
const port                          = process.env.PORT || 3000;

const auth                          = require('./routes/auth');
const keys                          = require('./config/keys');
const User                          = require('./models/Users');

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Setting global var
app.use((req, res, next) =>{
    res.locals.user = req.user || null;
    next();
})


require('./config/passport')(passport);



mongoose.Promise = global.Promise;
//Monoose connect
mongoose.connect(keys.mongoURI, {}) 
    .then (()=>{
        console.log('MongoDB Connected');
    })
    .catch(err => console.log(err));


//Index Page route
app.get('/', (req, res)=>{
    res.send('Index page loading');
})


app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

//Use Routes
app.use ('/auth', auth);

// Starting the server
app.listen(port, ()=>{
    console.log(`Server started on port ${port}`)
});