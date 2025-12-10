<!--
 * @Author: Peng wenlei
 * @Date: 2021-03-03 10:54:16
 * @Description: 登录注册页面
 * @FilePath: /my_blog/src/views/login/index.vue
-->
<template>
  <div class="login-container">
    <canvasBg />
    <star />
    <div class="loginmain" :class="type === 1 ? 'login-hg' : 'register-hg'">
      <div class="login-title">
        <span :class="type === 1 ? 'active' : ''" @click="type = 1">
          登录
        </span>
        <span :class="type === 2 ? 'active' : ''" @click="type = 2">
          注册
        </span>
      </div>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        auto-complete="on"
        label-position="left"
      >
        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="usernameRef"
            v-model="loginForm.username"
            placeholder="请输入用户名"
            name="username"
            type="text"
            tabindex="1"
            auto-complete="on"
          />
        </el-form-item>

        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="passwordRef"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="请输入密码"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup.enter="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon
              :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
            />
          </span>
        </el-form-item>

        <el-form-item prop="confirmPwd" v-if="type === 2">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            v-model="loginForm.confirmPwd"
            :type="passwordType"
            placeholder="请再次输入密码"
            name="confirmPwd"
            tabindex="3"
            auto-complete="on"
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <el-button
          :loading="loading"
          type="primary"
          class="login-btn"
          style="width: 100%; margin-bottom: 30px"
          @click="handleLogin"
        >
          {{ type === 1 ? '登录' : '注册' }}
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store'
import canvasBg from './components/canvsBg'
import star from './components/star'

// Router
const router = useRouter()
const route = useRoute()

// Store
const userStore = useUserStore()

// Refs
const loginFormRef = ref(null)
const usernameRef = ref(null)
const passwordRef = ref(null)

// 响应式数据
const loginForm = ref({
  username: 'youke001',
  password: '123456',
  confirmPwd: ''
})

const type = ref(1) // 1登录 2注册
const loading = ref(false)
const passwordType = ref('password')
const redirect = ref(undefined)

/**
 * 验证用户名
 */
const validateUsername = (rule, value, callback) => {
  if (value.length < 3) {
    callback(new Error('用户名长度不能小于三位数!'))
  } else {
    callback()
  }
}

/**
 * 验证密码
 */
const validatePassword = (rule, value, callback) => {
  if (value.length < 6) {
    callback(new Error('密码长度不能小于六位数!'))
  } else {
    callback()
  }
}

/**
 * 验证确认密码
 */
const validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== loginForm.value.password) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

// 表单验证规则
const loginRules = {
  username: [{ required: true, trigger: 'blur', validator: validateUsername }],
  password: [{ required: true, trigger: 'blur', validator: validatePassword }],
  confirmPwd: [{ required: true, trigger: 'blur', validator: validatePass2 }]
}

/**
 * 显示/隐藏密码
 */
const showPwd = () => {
  if (passwordType.value === 'password') {
    passwordType.value = ''
  } else {
    passwordType.value = 'password'
  }
  nextTick(() => {
    passwordRef.value.focus()
  })
}

/**
 * 登录注册处理
 */
const handleLogin = () => {
  loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        if (type.value === 1) {
          // 登录
          await userStore.login(loginForm.value)
          router.go(-1)
        } else {
          // 注册
          const data = await userStore.register(loginForm.value)
          if (data.code === 200) {
            await userStore.login(loginForm.value)
            ElMessage.success('注册成功！')
            router.push({ path: redirect.value || '/' })
          } else {
            ElMessage.error(data.msg || '注册失败')
          }
        }
      } catch (error) {
        console.error('登录/注册失败:', error)
        ElMessage.error(error.message || '操作失败')
      } finally {
        loading.value = false
      }
    } else {
      console.log('表单验证失败')
      return false
    }
  })
}

// 监听路由变化
watch(
  () => route.query,
  (query) => {
    if (query) {
      redirect.value = query.redirect
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.login-container {
  width: 100%;
  height: 100vh;
  min-height: 100%;
  background: url('https://www.17sucai.com/preview/806169/2020-11-24/%E7%99%BB%E9%99%86/image/bg1.jpg')
    no-repeat;
  background-size: cover;
  background-position: center;
  overflow: hidden;
}

.loginmain {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
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
  border-radius: 8px;
}

@media screen and (max-width: 760px) {
  .loginmain {
    margin-left: 20px;
    margin-right: 20px;
  }
}

.login-hg {
  max-height: 380px;
}

.register-hg {
  max-height: 450px;
}

.login-title {
  color: #d3d7f7;
  height: 50px;
  font-size: 20px;
  text-align: center;
  margin-top: -20px;
  margin-bottom: 20px;

  span {
    margin: 0 10px;
    user-select: none;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      color: #6fb1e0;
    }
  }

  .active {
    color: #4fa1d9;
    font-weight: bold;
  }
}

.login-form {
  position: relative;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
}

.svg-container {
  padding: 6px 5px 6px 15px;
  color: #889aa4;
  vertical-align: middle;
  display: inline-block;
}

.show-pwd {
  position: absolute;
  right: 10px;
  top: 7px;
  font-size: 16px;
  color: #889aa4;
  cursor: pointer;
  user-select: none;
}

.login-btn {
  border-radius: 3px;
  background: transparent;
  border: 2px solid #4fa1d9;
  color: #4fa1d9;
  text-transform: uppercase;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition-property: background, color;
  transition-duration: 0.3s;

  &:hover {
    color: white !important;
    background: #4fa1d9;
  }
}
</style>

<style lang="scss">
/* Element Plus 输入框样式覆盖 */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    .el-input__wrapper {
      background: transparent;
      border: 0px;
      box-shadow: none;
      padding: 0;
    }

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #fff;
      height: 47px;
      caret-color: #fff;

      &::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #283443 inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
    margin-bottom: 22px;

    .el-form-item__content {
      line-height: 47px;
    }

    .el-form-item__error {
      color: #f56c6c;
      font-size: 12px;
      line-height: 1;
      padding-top: 4px;
      position: absolute;
      top: 100%;
      left: 0;
    }
  }

  .el-button {
    &.is-loading {
      opacity: 0.7;
    }
  }
}
</style>
