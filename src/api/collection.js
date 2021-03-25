/*
 * @Author: pwl
 * @Date: 2021-03-01 15:02:17
 * @LastEditTime: 2021-03-25 21:28:10
 * @LastEditors: Peng wenlei
 * @Description: In User Settings Edit
 * @FilePath: \my_blog\src\api\collection.js
 */
import http from '@/utils/http'

/**
 * @description: 是否收藏
 * @param {string} userId 用户id
 * @param {string} articleId 文章id
 * @return {*}
 */
export function isCollection(data) {
    return http({
        url: '/api/collection/isCollection',
        method: 'post',
        data
    })
}

/**
 * @description: 收藏文章
 * @param {string} userId 用户id
 * @param {string} articleId 文章id
 * @return {*}
 */
export function collectionArticle(data) {
    return http({
        url: '/api/collection/collectionArticle',
        method: 'post',
        data
    })
}

/**
 * @description: 取消收藏文章
 * @param {string} userId 用户id
 * @param {string} articleId 文章id
 * @return {*}
 */
export function unCollectionArticle(data) {
    return http({
        url: '/api/collection/unCollectionArticle',
        method: 'post',
        data
    })
}

/**
 * @description: 获取用户收藏列表
 * @param {string} userId 用户id
 * @return {*}
 */
export function getCollectionList(userId) {
    return http({
        url: '/api/collection/getCollectionList?userId=' + userId,
        method: 'get'
    })
}
