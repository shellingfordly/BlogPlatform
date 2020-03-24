import ajax from './ajax'

/**
 * 获取用户信息
 * @param {
 *  userAccount: 用户账号
 * } data 
 */
export const getAllArticles = () => ajax("/api/getAllArticles")
