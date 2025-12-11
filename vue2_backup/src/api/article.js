/*
 * @Author: your name
 * @Date: 2020-11-12 18:05:21
 * @LastEditTime: 2021-03-01 21:56:58
 * @LastEditors: Peng wenlei
 * @Description: In User Settings Edit
 * @FilePath: \my_blog\src\api\article.js
 */
import http from '@/utils/http'

// 获取文章列表
export function getArticleList(params) {
    return http({
        url: '/api/article/getArticleList',
        method: 'GET',
        params
    })
}

// 获取文章详情
export function getArticleDetail(params) {
    return http({
        url: '/api/article/getArticleDetail',
        method: 'GET',
        params
    })
}

// 收藏文章
export function addFavorite(params) {
    return http({
        url: '/api/favorite/addFavorite',
        method: 'POST',
        params
    })
}

