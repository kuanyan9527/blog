const express = require('express')
const jwt = require('jsonwebtoken')
const cors = require('cors')

const app = express()
const port = 3000

app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "X-Requested-With, accept, origin, content-type, Authorization")
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
  res.header("X-Powered-By", ' 3.2.1')
  res.header("Access-Control-Max-Age", 60)
  next()
})

app.get('/', (req, res) => {
  const token = jwt.sign({ foo: 'bar' }, 'shhhhh')
  res.send(token)
})

app.post('/login', (req, res) => {
  const token = req.headers.authorization
  let result
  jwt.verify(token, 'shhhhh', function(err, decoded) {
    if (err) {
      console.log(err);
      res.send(500)
    } else {
      result = 'success'
      res.send(result)
    }
  });
  
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})