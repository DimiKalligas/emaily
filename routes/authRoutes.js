const passport = require('passport')

module.exports = (app) => {
    app.get('/auth/google', passport.authenticate('google', {
        scope: ['profile', 'email'] // specify what access (permission) we want to have from this user's profile (account)
        // ^ we ask Google for user's profile and email info (but we don't need them in this case)      
    }))

    app.get('/auth/google/callback', passport.authenticate('google'))

    app.get('/api/logout', (req, res) => {
        req.logout() // kills the cookie
        res.send(req.user)
    })

    app.get('/api/current_user', (req, res) => {
        // req.send(req.session) = {passport: {user: "kjhkjhkjh"}}
        res.send(req.user)
    })
}
