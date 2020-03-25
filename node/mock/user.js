const User = require('../models/userSchema')
const Article = require('../models/articleSchema')

module.exports = {
  // 登录
  "POST /login": async (cxt) => {
    const {
      account,
      password
    } = cxt.request.body
    const res = await User.find({
      "account": account
    })
    if (!res.length) cxt.body = {
      code: 0
    }
    else if (password == res[0].password)
      cxt.body = {
        code: 1,
        msg: res[0]
      }
    else cxt.body = {
      code: 2
    }
  },
  // 注册
  "POST /logon": async cxt => {
    const {
      account,
      password
    } = cxt.request.body
    const res = await User.find({
      "account": account
    })
    if (res.length) {
      // 注册失败
      cxt.body = {
        code: 0
      }
    } else {
      // 注册成功
      let num = (await User.find()).length + 1;
      let user = await User.create({
        account,
        password,
        num,
        articleList: account,
        name: "用户" + num,
        signature: "暂无签名",
        about: "..."
      })
      cxt.body = {
        code: 1,
        msg: user
      }
    }
  },
  // 修改用户信息
  "POST /modifyUserMsg": async cxt => {
    const user = cxt.request.body
    User.update({
      "account": user.account
    }, {
      '$set': user
    }, function (err, data) {
      // 必须有回调
      if (err) {
        console.log(err);
      } else {
        console.log(data);
      }
    });
    Article.updateMany({
      "articleList": user.account
    }, {
      '$set': {
        author: user.name
      }
    }, function (err, data) {
      // 必须有回调
      if (err) {
        console.log(err);
      } else {
        console.log(data);
      }
    })

    const msg = await User.findOne({
      "account": user.account
    })
    cxt.body = {
      code: 1,
      msg: msg
    }
  },
  // 修改用户头像
  "POST /modifyUserHeadId": async cxt => {
    const {
      headId,
      account
    } = cxt.request.body
    User.update({
      account
    }, {
      '$set': {
        headId
      }
    }, function (err, data) {
      // 必须有回调
      if (err) {
        console.log(err);
      } else {
        console.log(data);
      }
    });
    cxt.body = 1
  },
  // 获取用户信息
  "POST /getUserMsg": async cxt => {
    const {
      articleList
    } = cxt.request.body
    const user = await User.findOne({
      articleList
    })
    cxt.body = user
  },
  // 关注与被关注
  "POST /setLikeUser": async cxt => {
    /**
     * 关注
     * @param {
     *  follow: 关注者
     *  follower: 被关注者
     *  isFollow: 是否关注
     * } 
     */
    const {
      follow,
      follower,
      isFollow
    } = cxt.request.body
    const followUser = await User.findOne({
      account: follow
    })
    const followerUser = await User.findOne({
      account: follower
    })
    const is_exist_follow_user = followUser.likeUser.length ? followUser.likeUser.findIndex(item => item.account === follower) : -1
    const is_exist_follower_user = followerUser.follow.length ? followerUser.follow.findIndex(item => item.account === follow) : -1
    console.log(is_exist_follow_user, is_exist_follower_user)

    if (isFollow) { // 关注
      // 给follow添加follower
      if (is_exist_follow_user === -1) {
        User.update({
          account: follow
        }, {
          '$push': {
            likeUser: {
              account: follower,
              name: followerUser.name
            }
          }
        }, function (err, data) {
          if (err) {
            console.log(err);
          } else {
            console.log(data);
          }
        });
      }
      // 添加follower添加follow
      if (is_exist_follower_user === -1) {
        User.update({
          account: follower
        }, {
          '$push': {
            follow: {
              account: follow,
              name: followUser.name
            }

          }
        }, function (err, data) {
          if (err) {
            console.log(err);
          } else {
            console.log(data);
          }
        });
      }
    } else { //取消关注
      User.update({
        account: follow
      }, {
        '$pull': {
          likeUser: {
            account: follower,
          }
        }
      }, function (err, data) {
        if (err) {
          console.log(err);
        } else {
          console.log(data);
        }
      });
      User.update({
        account: follower
      }, {
        '$pull': {
          follow: {
            account: follow,
          }
        }
      }, function (err, data) {
        if (err) {
          console.log(err);
        } else {
          console.log(data);
        }
      });
    }
    const user = await User.findOne({
      account: follow
    })
    cxt.body = user
  },
}