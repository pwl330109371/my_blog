/*
 * @Author: your name
 * @Date: 2020-11-21 10:45:21
 * @LastEditTime: 2021-03-05 14:43:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \my_blog\src\api\articleComments.js
 */

import http from '@/utils/http'

/**
 * @description: 发布评论
 * @param {number} articleId 文章id
 * @param {string} content 评论内容
 * @param {number} commentId 主评论id(二级评论才传)
 * @param {number} replyId 被回复的目标评论id 子评论才传
 * @param {number} type 1 是主评论 2 是子评论
 * @param {number} toUid 被评论人id 子评论才传
 * @param {*}
 * @return {*}
 */
export function addComment(data) {
    return http({
        url: '/api/comment/createComment',
        method: 'POST',
        data
    })
}

/**
 * @description: 获取文章评论列表
 * @param {number} articleId 评论id
 * @return {*}
 */
export function getCommentList(articleId) {
    return http({
        url: '/api/comment/getCommentList?articleId=' + articleId,
        method: 'GET'
    })
}
