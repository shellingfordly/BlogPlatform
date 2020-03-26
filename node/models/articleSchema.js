const mongoose = require('mongoose')

let articleSchema = mongoose.Schema({
  title: String,
  content: String,
  articleList: {
    type: String,
    required: true,
  },
  articleId: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  num: {
    type: Number,
    required: true,
  },
  like: Array,
  collect: Array,
  comments: Array
})

module.exports = mongoose.model('user_articles', articleSchema)