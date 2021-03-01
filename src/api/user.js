/*
 * @Author: your name
 * @Date: 2021-03-01 15:02:17
 * @LastEditTime: 2021-03-01 18:14:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \my_blog\src\api\user.js
 */
import http from '@/utils/http'

// 获取文章列表
export function getAboutMe(userId) {
    return http({
        url: '/api/about/getAboutMeContent?userId=' + userId,
        method: 'get'
    })
}