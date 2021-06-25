import express from 'express'
import bodyParser from 'body-parser'
import logger from './logger.js'

const app = express()
const port = 80
app.use(bodyParser.json())

app.post('/callback', async (req, res) => {
  const body = req.body;
  logger.debug('got body', {body})
  if (body.hasOwnProperty('type')) {
    res.status(200).send('b68706e2')
    return ;
  }
  res.status(200).send();
})

app.get('/', async (req, res) => {
    res.status(200).send();
})

app.listen(port)
