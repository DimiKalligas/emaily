const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy // we only want Strategy
const mongoose = require('mongoose')
const keys = require('../config/keys')
const User = mongoose.model('users') // so, User is our Model Class (gives us a handle to mongo collection)

// returns a token confirming that you are certified user (by id)
// we turn the user model into an id
// this is after we succesfully log in - 'user' is retreived from GoogleStrategy callback
passport.serializeUser((user, done) => {
    done(null, user.id) // user.id is the automatic mongo _id ->
    // we use this instead of Google Profile Id, because user may not have a google id (they may have facebook or linkedin) ->
    // OAuth flow: We care about Google id ONLY for the sign-in. After that, we only care for mongo id
    // Passport will then automatically stuff this token into user's cookie
})

// each time user requests sth, Passport takes the is from the cookie, and turns it into a user
// we turn an id into a user model instance
passport.deserializeUser((id, done) => { // id is the user.id^ that we stuffed into the cookie
    User.findById(id)
        .then(user => {
            done(null, user) // error, & the user that we pulled out
        })
})

// in https://console.cloud.google.com we "Created Project":Emaily, in API's & Services we consented to associate an External User Type to our project,
// then we Created Credentials: "OAuth client ID" for "Web Application", with
// Authorized Javascript Origins: http://localhost:5000
// Authorized redirect URI: http://localhost:5000/auth/google/callback
passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback' // where the user will be redirected to, after they are granted permission from Google
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({ googleId: profile.id })
        .then(result => {
            if (!result) {
                // 1. this User is sent to db
                new User({ googleId: profile.id }) // creates a Model Instance, but does not save ('persist)
                    .save() // NOW it will save it
                    // 2. and this user is returned from the db, enhanced with extra info -- and this is the user we will be using from now on
                    .then(user => done(null, user)) // this is how you EXIT mongo call 
            } else {
                console.log('User already exists!')
                // return // should use done() !
                done(null, result)
            }
        })
    // console.log('access token ', accessToken) // with this token we may have access to user's google profile
    // console.log('refresh token ', refreshToken) // with this token we may have access to accessToken after it expires, so it 'extends' time given
    // console.log('profile ', profile) // all of user's identifying information
})
)