/*
 * @Author: your name
 * @Date: 2020-11-21 10:45:21
 * @LastEditTime: 2020-11-21 10:48:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \my_blog\src\api\articleComments.js
 */

import http from '@/utils/http'

// 发布评论
export function addComment(data) {
    return http({
        url: '/api/comment/add',
        method: 'POST',
        data
    })
}

// 获取文章评论列表
export function getCommentList(params) {
    return http({
        url: '/api/comment/list',
        method: 'GET',
        params
    })
}
