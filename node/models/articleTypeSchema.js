const mongoose = require('mongoose')

let articleTypeSchema = mongoose.Schema({
  typeName: String, // 类型名
  articles: Array, //文章
})

module.exports = mongoose.model('article_type', articleTypeSchema)