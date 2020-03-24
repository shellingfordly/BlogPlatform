import ajax from './ajax'

/**
 * 
 * @param {
 *  follow: 关注者
 *  follower: 被关注者
 * } data 
 */
export const setLikeUser = (follow, follower, isFollow) => ajax("/api/setlikeUser", { follow, follower, isFollow }, "post")




