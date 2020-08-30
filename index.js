const express = require('express') // common JS modules syntax
// import express from ('express') uses es15 modules - better used in React
const app = express()

app.get('/', (req, res) => {
    res.send({ hi: 'there' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT)