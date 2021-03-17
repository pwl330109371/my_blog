<!--
 * @Author: your name
 * @Date: 2021-03-03 10:54:16
 * @LastEditTime: 2021-03-05 22:11:53
 * @LastEditors: Peng wenlei
 * @Description: In User Settings Edit
 * @FilePath: \vue-blog-admin\src\views\login\index1.vue
-->
<template>
    <div class="login-container">
        <canvasBg />
        <star />
        <div class="loginmain" :class="type === 1 ? 'login-hg' : 'register-hg'">
            <div class="login-title">
                <span :class="type === 1 ? 'active' : ''" @click="type = 1">
                    <font style="vertical-align: inherit;">
                        <font style="vertical-align: inherit;">登录</font>
                    </font>
                </span>
                <span :class="type === 2 ? 'active' : ''" @click="type = 2">
                    <font style="vertical-align: inherit;">
                        <font style="vertical-align: inherit;">注册</font>
                    </font>
                </span>
            </div>
            <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
                <el-form-item prop="username">
                    <span class="svg-container">
                        <svg-icon icon-class="user" />
                    </span>
                    <el-input ref="username" v-model="loginForm.username" placeholder="请输入用户名" name="username" type="text" tabindex="1" auto-complete="on" />
                </el-form-item>

                <el-form-item prop="password">
                    <span class="svg-container">
                        <svg-icon icon-class="password" />
                    </span>
                    <el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType" placeholder="请输入密码" name="password" tabindex="2" auto-complete="on" @keyup.enter.native="handleLogin" />
                    <span class="show-pwd" @click="showPwd">
                        <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                    </span>
                </el-form-item>

                <el-form-item prop="confirmPwd" v-if="type === 2">
                    <span class="svg-container">
                        <svg-icon icon-class="password" />
                    </span>
                    <el-input :key="passwordType" ref="password" v-model="loginForm.confirmPwd" :type="passwordType" placeholder="请再次输入密码" name="password" tabindex="2" auto-complete="on" @keyup.enter.native="handleLogin" />
                </el-form-item>
                <el-button :loading="loading" type="primary" class="login-btn" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">{{ type === 1 ? '登录' : '注册' }}</el-button>
            </el-form>
        </div>
    </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import canvasBg from './components/canvsBg'
import star from './components/star'
export default {
    name: 'Login',
    components: {
        canvasBg,
        star
    },
    data() {
        const validateUsername = (rule, value, callback) => {
            if (!validUsername(value)) {
                callback(new Error('Please enter the correct user name'))
            } else {
                callback()
            }
        }
        const validatePassword = (rule, value, callback) => {
            if (value.length < 6) {
                callback(new Error('The password can not be less than 6 digits'))
            } else {
                callback()
            }
        }
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'))
            } else if (value !== this.loginForm.confirmPwd) {
                callback(new Error('两次输入密码不一致!'))
            } else {
                callback()
            }
        }
        return {
            loginForm: {
                username: 'pwl201314',
                password: '123456',
                confirmPwd: ''
            },
            loginRules: {
                username: [{ required: true, trigger: 'blur', validator: validateUsername }],
                password: [{ required: true, trigger: 'blur', validator: validatePassword }],
                confirmPwd: [{ required: true, trigger: 'blur', validator: validatePass2 }]
            },
            type: 1, // 1登录 2注册
            loading: false,
            passwordType: 'password',
            redirect: undefined
        }
    },
    watch: {
        $route: {
            handler: function(route) {
                this.redirect = route.query && route.query.redirect
            },
            immediate: true
        }
    },
    mounted() {},
    methods: {
        // 显示密码
        showPwd() {
            if (this.passwordType === 'password') {
                this.passwordType = ''
            } else {
                this.passwordType = 'password'
            }
            this.$nextTick(() => {
                this.$refs.password.focus()
            })
        },
        /**
         * @description: 登录注册 type 1 为登录操作  2 为注册操作
         * @return {*}
         */
        handleLogin() {
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    this.loading = true
                    if (this.type === 1) {
                        this.$store
                            .dispatch('user/login', this.loginForm)
                            .then(() => {
                                // this.$router.push({ path: this.redirect || '/' })
								// this.$router.go(-1)
								this.$router.go(-1)
                                this.loading = false
                            })
                            .catch(() => {
                                this.loading = false
                            })
                    } else {
                        this.$store
                            .dispatch('user/register', this.loginForm)
                            .then(data => {
                                if (data.code === 200) {
                                    this.$store
                                        .dispatch('user/login', this.loginForm)
                                        .then(() => {
                                            this.$message
                                            // this.$router.push({ path: this.redirect || '/' })
											this.$router.go(-1)
                                            this.loading = false
                                        })
                                        .catch(() => {
                                            this.loading = false
                                        })
                                } else {
                                    this.$message.error(data.msg)
                                    this.loading = false
                                }
                            })
                            .catch(() => {
                                this.loading = false
                            })
                    }
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.login-container {
    width: 100%;
    height: 100%;
    background: url('https://www.17sucai.com/preview/806169/2020-11-24/%E7%99%BB%E9%99%86/image/bg1.jpg') no-repeat;
    background-size: 100% 100%;
}

.loginmain {
    background: rgba(0, 0, 0, 0.5);
    max-width: 540px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    padding: 50px 40px 40px 40px;
    box-shadow: -15px 15px 15px rgba(6, 17, 47, 0.7);
    z-index: 99999;
    transition: max-height ease-out 0.6s;
}
.login-hg {
    max-height: 330px;
}
.register-hg {
    max-height: 380px;
}
.login-title {
    color: #d3d7f7;
    height: 50px;
    font-size: 20px;
    text-align: center;
    margin-top: -20px;
    span {
        margin: 0 10px;
        user-select: none;
        cursor: pointer;
    }
    .active {
        color: #4fa1d9;
    }
}
.login-con {
    height: 208px;
    position: absolute;
    left: 0;
    width: 80%;
    margin: 0 10%;
}
.login-user {
    position: relative;
}
.icon {
    position: absolute;
    z-index: 1;
    left: 36px;
    top: 8px;
    opacity: 1;
}
.login-con input {
    width: calc(100% - 130px);
    margin-top: -2px;
    background: rgba(57, 61, 82, 0);
    left: 0;
    padding: 10px 65px;
    border-top: 2px solid rgba(57, 61, 82, 0);
    border-bottom: 2px solid rgba(57, 61, 82, 0);
    border-right: none;
    border-left: none;
    outline: none;
    font-family: 'Gudea', sans-serif;
    box-shadow: none;
    color: #61bfff !important;
}
.login-pwd,
.login-yan {
    position: relative;
}
/*
.login-pwd .icon{
    position: absolute;
    z-index: 1;
    left: 36px;
    top: 8px;
    opacity: .5;
}*/
.login-btn {
    width: 80%;
    margin: 0 auto;
    position: relative;
}
.login-btn {
    border-radius: 3px;
    background: transparent;
    border: 2px solid #4fa1d9;
    color: #4fa1d9;
    text-transform: uppercase;
    font-size: 11px;
    cursor: pointer;
    margin: auto;
    width: 80%;
    transition-property: background, color;
    -webkit-transition-duration: 0.2s;
    transition-duration: 0.2s;
}
.login-btn:hover {
    color: white !important;
    background: #4fa1d9;
    cursor: pointer;
    -webkit-transition-property: background, color;
    transition-property: background, color;
    -webkit-transition-duration: 0.2s;
    transition-duration: 0.2s;
}
</style>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
        color: $cursor;
    }
}

/* reset element-ui css */
.login-container {
    .el-input {
        display: inline-block;
        height: 47px;
        width: 85%;

        input {
            background: transparent;
            border: 0px;
            -webkit-appearance: none;
            border-radius: 0px;
            padding: 12px 5px 12px 15px;
            color: $light_gray;
            height: 47px;
            caret-color: $cursor;

            &:-webkit-autofill {
                box-shadow: 0 0 0px 1000px $bg inset !important;
                -webkit-text-fill-color: $cursor !important;
            }
        }
    }

    .el-form-item {
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        color: #454545;
    }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;

    .login-form {
        position: relative;
        width: 320px;
        max-width: 100%;
        // padding: 160px 35px 0;
        margin: 0 auto;
        // overflow: hidden;
    }

    .tips {
        font-size: 14px;
        color: #fff;
        margin-bottom: 10px;

        span {
            &:first-of-type {
                margin-right: 16px;
            }
        }
    }

    .svg-container {
        padding: 6px 5px 6px 15px;
        color: $dark_gray;
        vertical-align: middle;
        display: inline-block;
    }

    .title-container {
        position: relative;

        .title {
            font-size: 26px;
            color: $light_gray;
            margin: 0px auto 40px auto;
            text-align: center;
            font-weight: bold;
        }
    }

    .show-pwd {
        position: absolute;
        right: 10px;
        top: 7px;
        font-size: 16px;
        color: $dark_gray;
        cursor: pointer;
        user-select: none;
    }
}
</style>
