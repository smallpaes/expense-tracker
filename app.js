// Include modules
const express = require('express')
const app = express()

// Set up server related variable
const port = 3000

app.get('/', (req, res) => {
  res.send('landing page')
})

// Start and listen to server
app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})