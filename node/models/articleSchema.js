const mongoose = require('mongoose')

let articleSchema = mongoose.Schema({
  title: String, // 文章标题
  content: String, // 文章内容
  articleList: { // 文章对应作者
    type: String,
    required: true,
  },
  articleId: { // 文章id
    type: String,
    required: true,
  },
  author: { // 作者
    type: String,
    required: true,
  },
  time: { // 发布时间
    type: String,
    required: true,
  },
  num: { // 编号
    type: Number,
    required: true,
  },
  like: Array, // 点赞者
  collect: Array, // 收藏者
  comments: Array, // 评论
  typeList: Array, //文章类型
})

module.exports = mongoose.model('user_articles', articleSchema)