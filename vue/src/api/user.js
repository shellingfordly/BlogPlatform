import ajax from './ajax'

/**
 * 获取用户信息
 * @param {
 *  userAccount: 用户账号
 * } data 
 */
export const getUserMeg = (articleList) =>
  ajax("/api/getUserMsg", { articleList }, "post")

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
  ajax("/api/getCollectArticles", { account }, "post")

/**
 * 关注
 * @param {
  *  follow: 关注者
  *  follower: 被关注者
  * } data 
  */
export const setLikeUser = (follow, follower, isFollow) => ajax("/api/setlikeUser", { follow, follower, isFollow }, "post")


