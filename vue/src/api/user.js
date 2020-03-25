import ajax from './ajax'


/**
 * 登录
 * @param {
 *  account：账号
 *  password： 密码
 * } data 
 */
export const login = (account, password) =>
  ajax("/api/login", {
    account,
    password
  }, "post")

/**
 * 注册
 * @param {
 *  account：账号
 *  password： 密码
 * } data 
 */
export const logon = (account, password) =>
  ajax("/api/logon", {
    account,
    password
  }, "post")



/**
 * 获取用户信息
 * @param {
 *  userAccount: 用户账号
 * } data 
 */
export const getUserMeg = (articleList) =>
  ajax("/api/getUserMsg", {
    articleList
  }, "post")

/**
 * 或者用户的所有文章
 * @param {
 *  userAccount: 用户账号
 * } data 
 */
export const getUserAllArticles = (articleList) =>
  ajax("/api/getUserAllArticles?articleList=" + articleList)


/**
 * 或者用户收藏的所有文章
 * @param {
 *  userAccount: 用户账号
 * } data 
 */
export const getCollectArticle = (account) =>
  ajax("/api/getCollectArticles", {
    account
  }, "post")

/**
 * 关注
 * @param {
 *  follow: 关注者
 *  follower: 被关注者
 * } data 
 */
export const setLikeUser = (follow, follower, isFollow) => ajax("/api/setlikeUser", {
  follow,
  follower,
  isFollow
}, "post")


/**
 * 修改用户信息/修改用户头像
 * @param {
 *  user： 用户信息/用户头像信息
 * } data 
 */
export const modifyUserMsg = (user) =>
  ajax("/api/modifyUserMsg", user, 'post')