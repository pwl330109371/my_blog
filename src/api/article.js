/*
 * @Author: your name
 * @Date: 2020-11-12 18:05:21
 * @LastEditTime: 2020-12-15 23:00:35
 * @LastEditors: Peng wenlei
 * @Description: In User Settings Edit
 * @FilePath: \my_blog\src\api\article.js
 */
import http from '@/utils/http'

// 获取文章列表
export function getArticleList(data) {
    return http({
        url: '/api/article/list',
        method: 'POST',
        data
    })
}

// 获取文章列表
export function getArticleDetail(params) {
    return http({
        url: '/api/article/getDetail',
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