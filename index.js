const express = require('express') // common JS modules syntax
const mongoose = require('mongoose')
const cookieSession = require('cookie-session')
const passport = require('passport') // passport will handle cookies ^
const authRoutes = require('./routes/authRoutes')
// import express from ('express') uses es15 modules - better used in React
require('./models/User') // this line MUST supersede the next one, so that passport.js will know we have a model
require('./services/passport') // because passport does not return anything - so this is just an include
const keys = require('./config/keys')

mongoose.connect(keys.mongoURI)

const app = express()

// follows Passport flow:
// Cookie Session: extract cookie data - and assigns it to req.session
// Passport: pull User ID out of cookie data (precisely: out of req.session) - so, Passport is a property of session
// deserialize User: our function to turn User ID into a user
// TΕΛΙΚΟ ΑΠΟΤΕΛΕΣΜΑ ΤΟΥ AUTHENTICATION: User model instance added to req object as 'req.user'
app.use(  // αν θέλαμε session, θα λέγαμε app.use(session({ store: sessionStore, cookie: maxAge: κλπ}))
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        keys: [keys.cookieKey] // encrypt cookie with this key
    })
)
// tell passport we need it to handle our cookies
app.use(passport.initialize())
app.use(passport.session())

// otherwise: const authRoutes = require('./routes/authRoutes') 
require('./routes/authRoutes')(app)
console.log('google scope is ', authRoutes.scope)

const PORT = process.env.PORT || 5000
app.listen(PORT)