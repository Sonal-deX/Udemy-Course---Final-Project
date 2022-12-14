const express = require('express')
const app = express()
const session = require('express-session')
const flash = require('connect-flash')
const path = require('path')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const passport = require('passport')
const mongoSanitize = require('express-mongo-sanitize')
const localStrategy = require('passport-local')

const MongoDBStore = require('connect-mongo');

const expressError = require('./server/error/expressErrors')
const User = require('./server/model/user')
const connectdb = require('./server/database/connection')

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const PORT = process.env.PORT || 3000

// log requests
app.use(morgan('tiny'))

// mongodb connection
connectdb()

// parse request to bodyParser
app.use(bodyParser.urlencoded({ extended: true }))

// method override
app.use(methodOverride('_method'))

// axios json request
app.use(express.json())

// mongo sanitize
app.use(mongoSanitize())

// set view engine
app.set('view engine', 'ejs');

// load assets
app.use('/css', express.static(path.join(__dirname, 'assets/css')));
app.use('/js', express.static(path.join(__dirname, 'assets/js')));
app.use('/img', express.static(path.join(__dirname, 'assets/img')));

// mongo store

const store = MongoDBStore.create({
    mongoUrl: process.env.MONGODB_URI,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const secret = process.env.SECRET || 'sonalAttanayake!'

// session config
const sessionConfig = {
    store,
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true, remove comment type when deploying
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success');
    res.locals.deletee = req.flash('delete');
    res.locals.error = req.flash('error');
    next();
})

// load routers
app.use('/', require('./server/routes/router'))

// errors handling
app.all('*', (req, res, next) => {
    next(new expressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went Wrong!'
    res.status(statusCode).render('error', { err: err, errCode: statusCode })
})


// PORT
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})
