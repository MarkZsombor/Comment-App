'use strict'

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Comment = require('./model/comments')

const app = express()
const router = express.Router()

const port = process.env.API_PORT || 3001

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const mongoDB = 'mongodb://mark:mark@ds247699.mlab.com:47699/mzcommentapp'
mongoose.connect(mongoDB)
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

//Deal with CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Acecc-Control-Request-Method, Access-Control-Request-Headers');
  res.setHeader('Cache-Control', 'no-cache');
  next();
})

router.get('/', (req, res) => {
  res.json({ message: 'API Initialized!' })
})

router.route('/comments')
  .get((req, res) => {
    Comment.find((err, comments) => {
      if(err) {
        res.send(err)
      }
      res.json(comments)
    })
  })
  .post((req, res) => {
    const comment = new Comment()
    comment.author = req.body.author
    comment.text = req.body.text
    comment.save(err => {
      if(err) {
        res.send(err)
      }
      res.json({ message: "Comment Added" })
    })
  })

router.route('/comments/:comment_id')
  .put((req,res) => {
    Comment.findById(req.params.comment_id, (err, comment) => {
      if(err) {
        res.send(err)
      }
      (req.body.author) ? comment.author = req.body.author : null
      (req.body.text) ? comment.text = req.body.text : null
      comment.save(err => {
        if(err) {
          res.send(err)
        }
        res.json({ message: "Comment Updated"})
      })
    })
  })
  .delete((req, res) => {
    Comment.remove({ _id: req.params.comment_id }, (err, comment) => {
      if(err) {
        res.send(err)
      }
      res.json({ message: "Comment Deleted" })
    })
  })

app.use('/api', router)

app.listen(port, () => {
  console.log(`api running on port ${port}`)
})