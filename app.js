const express                       = require('express');
const mongoose                      = require('mongoose');
const passport                      = require('passport');
const session                       = require('express-session');
const cookieParser                  = require('cookie-parser');
const exphbs                        = require('express-handlebars');
const path                          = require('path');
const bodyParser                    = require('body-parser');
const methodOverride                = require('method-override');
const app                           = express();
const port                          = process.env.PORT || 3000;

const auth                          = require('./routes/auth');
const index                         = require('./routes/index');
const keys                          = require('./config/keys');
const stories                       = require('./routes/stories');
const User                          = require('./models/Users');
const Story                         = require('./models/Story');

const {truncate, stripTags, formatDate, select}         = require('./helpers/hbs'); 


app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(methodOverride('_method'));



//Express Handle Bars
app.engine('handlebars', exphbs({
    helpers: {
        truncate: truncate,
        stripTags: stripTags,
        formatDate: formatDate,
        select: select
    },
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));

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



//Use Routes
app.use ('/auth', auth);
app.use ('/', index);
app.use('/stories', stories);





// Starting the server
app.listen(port, ()=>{
    console.log(`Server started on port ${port}`)
});