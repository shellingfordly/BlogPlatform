const mongoose = require('mongoose')

// 数据格式
let userSchema = mongoose.Schema({
  account: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  headId: {
    type: Number,
    default: 1
  },
  name: String,
  signature: String,
  about: String,
  num: Number,
  articleList: String,
  likeArticle: Array,
  collectArticle: Array,
  likeUser: Array,
  follow: Array,
  other: {
    type: Object,
    default: {
      weibo: "",
      boke: "",
      github: "",
      bilibili: ""
    }
  }
})

// 对users下的commonUsers集合运用userSchema数据格式
// 并暴露出去
module.exports = mongoose.model('common_users', userSchema)