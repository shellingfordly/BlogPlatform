import ajax from './ajax'

/**
 * 每日一句
 */
export const getEverydaySentence = () =>
  ajax("https://v2.jinrishici.com/one.svg?color=gray")