import ajax from './ajax'

/**
 * 获取所有用户文章
 */
export const getAllArticles = () =>
  ajax("/api/getAllArticles")

/**
 * 获取某个类型的所有文章
 * @param {
 *  type: 文章类型
 * } data 
 */
export const getTypeArticles = (type) =>
  ajax("/api/getTypeArticles", {
    type
  }, 'post')

/**
 * 获取文章数据
 * @param {
 *  articleId: 文章ID
 * } data 
 */
export const getSingleArticle = (articleId) =>
  ajax("/api/getSingleArticle?articleId=" + articleId)

/**
 * 添加文章
 * @param {
 *  article: 文章信息
 * } data 
 */
export const addArticle = (article) =>
  ajax("/api/addArticle", article, 'post')


/**
 * 修改文章
 * @param {
 *  articleId: 文章ID
 *  article: 文章信息
 * } data 
 */
export const modifyArticle = (articleId, article) =>
  ajax("/api/modifyArticle", {
    articleId,
    article
  }, 'post')


/**
 * 删除文章
 * @param {
 *  articleId: 文章ID
 * } data 
 */
export const deleteArticle = (articleId) =>
  ajax("/api/deleteArticle", {
    articleId
  }, 'post')

/**
 * 点赞文章
 * @param {
 *  type： 点赞/取消点赞
 *  account： 用户账号
 *  articleId:  文章ID
 * } data 
 */
export const likeArticle = (type, account, articleId) =>
  ajax("/api/likeArticle", {
    type,
    account,
    articleId
  }, 'post')

/**
 * 收藏文章
 * @param {
 *  type： 点赞/取消点赞
 *  account： 用户账号
 *  articleId:  文章ID
 * } data 
 */
export const collectArticle = (type, account, articleId) =>
  ajax("/api/collectArticle", {
    type,
    account,
    articleId
  }, 'post')

/**
 * 获取所有文章分类
 */
export const getAllType = () => ajax("/api/getAllType")