const User = require('../models/userSchema')
const Article = require('../models/articleSchema')

module.exports = {
  // 增加文章
  "POST /addArticle": async cxt => {
    const { title, content, articleList, author } = cxt.request.body
    const date = new Date()
    const article = await Article.create({
      title,
      content,
      articleList,
      articleId: articleList + date.getTime(),
      author,
      num: date.getTime(),
      time: date.toLocaleDateString() + " " + date.toLocaleTimeString()
    })
    cxt.body = 1
  },
  // 或者某用户的所有文章
  "GET /getUserAllArticles": async cxt => {
    const { articleList } = cxt.request.query
    const articles = await Article.find({ articleList })
    cxt.body = articles
  },
  // 获取所有文章信息
  "GET /getAllArticles": async cxt => {
    const articles = await Article.find()
    cxt.body = articles
  },
  // 获取单篇文章内容
  "GET /getSingleArticle": async cxt => {
    const { articleId } = cxt.request.query
    const article = await Article.find({ articleId })
    cxt.body = article[0]
  },
  // 点赞某文章
  "POST /likeArticle": async cxt => {
    const { type, account, articleId } = cxt.request.body
    const article = await Article.findOne({ articleId })
    const user = await User.findOne({ account })
    const find_article = article.like.indexOf(account)
    const find_user = user.likeArticle.indexOf(articleId)
    if (type) {
      if (find_article === -1) {
        Article.update({
          articleId
        }, {
          '$push': {
            like: account
          }
        }, function (err, data) {
          if (err) {
            console.log(err);
          } else {
            console.log(data);
          }
        });
      }
      if (find_user === -1) {
        User.update({
          account
        }, {
          '$push': {
            likeArticle: articleId
          }
        }, function (err, data) {
          if (err) {
            console.log(err);
          } else {
            console.log(data);
          }
        });
      }
    } else {
      // 取消like
      Article.update({
        articleId
      }, {
        '$pull': {
          like: account
        }
      }, function (err, data) {
        if (err) {
          console.log(err);
        } else {
          console.log(data);
        }
      });
      User.update({
        account
      }, {
        '$pull': {
          likeArticle: articleId
        }
      }, function (err, data) {
        if (err) {
          console.log(err);
        } else {
          console.log(data);
        }
      });
    }
    cxt.body = 1
  },
  // 收藏某文章
  "POST /collectArticle": async cxt => {
    const { type, account, articleId } = cxt.request.body
    const article = await Article.findOne({ articleId })
    const user = await User.findOne({ account })
    const find_article = article.collect.indexOf(account)
    const find_user = user.collectArticle.indexOf(articleId)
    if (type) {
      // 确实收藏
      if (find_article === -1) {
        Article.update({
          articleId
        }, {
          '$push': {
            collect: account
          }
        }, function (err, data) {
          if (err) {
            console.log(err);
          } else {
            console.log(data);
          }
        });
      }
      if (find_user === -1) {
        User.update({
          account
        }, {
          '$push': {
            collectArticle: articleId
          }
        }, function (err, data) {
          if (err) {
            console.log(err);
          } else {
            console.log(data);
          }
        });
      }
    } else {
      // 取消收藏
      Article.update({
        articleId
      }, {
        '$pull': {
          collect: account
        }
      }, function (err, data) {
        if (err) {
          console.log(err);
        } else {
          console.log(data);
        }
      });
      User.update({
        account
      }, {
        '$pull': {
          collectArticle: articleId
        }
      }, function (err, data) {
        if (err) {
          console.log(err);
        } else {
          console.log(data);
        }
      });
    }
    cxt.body = 1
  },
  // 获取收藏全部文章
  "POST /getCollectArticles": async cxt => {
    const { account } = cxt.request.body
    const user = await User.findOne({ account })
    let collectArticles = []

    for (let i = 0; i < user.collectArticle.length; i++) {
      let article = await Article.findOne({ articleId: user.collectArticle[i] })
      collectArticles.push(article)
    }
    cxt.body = collectArticles
  },
  // 删除文章
  "POST /deleteArticle": async cxt => {
    const { articleId } = cxt.request.body
    Article.deleteOne({ articleId }, (err, docs) => {
      if (err) { return console.log('删除数据失败') }
    })
    cxt.body = 1
  }
}