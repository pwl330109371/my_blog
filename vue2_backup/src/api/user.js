/*
 * @Author: your name
 * @Date: 2021-03-01 15:02:17
 * @LastEditTime: 2021-03-05 21:08:38
 * @LastEditors: Peng wenlei
 * @Description: In User Settings Edit
 * @FilePath: \my_blog\src\api\user.js
 */
import http from '@/utils/http'

// 获取关于作者信息
export function getAboutMe(userId) {
    return http({
        url: '/api/about/getAboutContent?userId=' + userId,
        method: 'get'
    })
}

/**
 * @description: 用户登录
 * @param {string} userName 用户名
 * @param {string} password 密码
 * @return {*}
 */
export function login(data) {
    return http({
        url: '/api/users/login',
        method: 'post',
        data
    })
}

/**
 * @description: 获取用户信息
 * @param {number} userId 用户id
 * @return {*}
 */
export function getInfo(userId) {
    return http({
        url: '/api/users/getUserInfo?userId=' + userId,
        method: 'get'
    })
}

/**
 * @description: 用户注册
 * @param {string} userName 用户名
 * @param {string} password 密码
 * @param {string} gender 性别 1 男 2 女 3 保密
 * @param {string} nickName 昵称
 * @param {string} picture 头像
 * @return {*}
 */
export function register(data) {
    return http({
        url: '/api/users/register',
        method: 'post',
        data
    })
}
