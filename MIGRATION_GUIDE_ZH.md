# Vue 3 升级至 Nuxt 4 深度迁移指南 (完整版)

本文档旨在作为您开发 Nuxt 4 项目的**完全手册**，重点详解 Pinia 状态管理、路由系统 (Router) 和核心配置 (nuxt.config) 的深度用法。

---

## 1. 项目目录结构详解 (Project Structure)

以下是本项目迁移后的完整目录结构说明，Nuxt 4 依靠目录结构自动完成路由、导入等配置。

```bash
/
├── assets/                 # 资源目录：用于存放需要构建处理的静态资源 (SCSS, Fonts)
│   ├── css/                # 全局样式文件
│   │   ├── main.scss       # 主样式入口
│   │   ├── variables.scss  # SCSS 全局变量 (通过 nuxt.config 自动注入)
│   │   └── mixin.scss      # SCSS 混合宏 (自动注入)
│   └── font/               # 字体文件
├── components/             # 组件目录：Nuxt 自动引入所有组件，无需 import
│   ├── Article/            # 文章相关组件 (使用时 <ArticleIndex /> 或 <Article... />)
│   ├── Header/             # 头部导航组件
│   ├── common/             # 通用组件
│   └── ...                 
├── composables/            # 组合式函数目录：存放逻辑复用代码，自动引入
│   ├── useApi.ts           # 核心 API 请求封装 (基于 useFetch，处理拦截器)
│   ├── useArticle.ts       # 文章业务逻辑 (获取列表、详情)
│   ├── useUser.ts          # 用户鉴权逻辑 (登录、退出)
│   └── useCollection.ts    # 收藏相关逻辑
├── pages/                  # 页面目录：基于文件的路由系统
│   ├── index.vue           # 首页路由 (/)
│   ├── home.vue            # 首页文章流 (/home)
│   ├── detail/             
│   │   └── [id].vue        # 文章详情页 (动态路由 /detail/:id)
│   ├── login.vue           # 登录页 (/login)
│   └── ...
├── public/                 # 公共目录：存放纯静态资源 (不走构建打包)
│   └── images/             # 图片资源，代码中通过 /images/xxx.jpg 访问
├── stores/                 # 状态管理目录 (Pinia)
│   ├── user.ts             # 用户状态 (Token, UserInfo)
│   └── app.ts              # 应用全局状态 (Theme, Device)
├── plugins/                # 插件目录：Vue 应用初始化时运行
│   └── highlight.ts        # 代码高亮插件
├── server/                 # 服务端目录 (Nitro)
│   └── api/                # 可在此创建服务端 API 接口
├── app.vue                 # 应用根组件：所有页面的入口，定义全局布局
├── nuxt.config.ts          # Nuxt 配置文件：配置模块、代理、SSR、构建规则
├── package.json            # 项目依赖和脚本
└── tsconfig.json           # TypeScript 配置
```

---

## 2. Pinia 状态管理 (Nuxt 4 最佳实践)

Nuxt 4 推荐使用 `@pinia/nuxt` 模块。它自动处理了 SSR 状态同步，无需手动 `createPinia()`。

### 1.1 Store 的定义方式

推荐使用 **Setup Stores** (组合式 API 写法)，比 Options API 更灵活。

**文件: `stores/user.ts`**
```typescript
import { defineStore } from 'pinia'

// 第一个参数 'user' 是 storeId，必须唯一
export const useUserStore = defineStore('user', () => {
  // 1. State (使用 ref/reactive)
  const token = useCookie('token', { maxAge: 60 * 60 * 24 * 7 }) // 使用 Cookie 实现服务端同步
  const userInfo = ref<UserInfo | null>(null)

  // 2. Getters (使用 computed)
  const isLogin = computed(() => !!token.value)
  const userName = computed(() => userInfo.value?.nickName || '未登录')

  // 3. Actions (使用普通函数)
  function setToken(newToken: string) {
    token.value = newToken
  }

  async function login(loginForm: any) {
    // 异步操作
    const res = await useApi('/user/login', { body: loginForm })
    setToken(res.token)
    userInfo.value = res.user
  }

  function logout() {
    token.value = null
    userInfo.value = null
    const router = useRouter()
    router.push('/login')
  }

  // 必须返回想暴露的属性
  return {
    token,
    userInfo,
    isLogin,
    userName,
    login,
    logout
  }
})

// TS 类型定义
interface UserInfo {
    id: string;
    nickName: string;
    // ...
}
```

### 1.2 在组件中使用 Pinia

**解构由 `storeToRefs` 保持响应性**

```vue
<script setup lang="ts">
// 自动引入，无需 import useUserStore
const userStore = useUserStore()

// ❌ 错误写法：会丢失响应性
// const { userInfo, isLogin } = userStore 

// ✅ 正确写法：使用 storeToRefs 解构 State 和 Getters
const { userInfo, isLogin } = storeToRefs(userStore)

// Actions 可以直接解构 invoke
const { login, logout } = userStore

function handleLogin() {
    login({ username: '...', password: '...' })
}
</script>
```

### 1.3 核心 API 速查
*   `defineStore(id, setupFn)`: 定义 Store。
*   `storeToRefs(store)`: **关键**，解构 state/getters 并保持响应式。
*   `$patch({ ... })`: 同时修改多个 state 属性(Setup Store 中较少用，直接修改 ref 即可)。
*   `$reset()`: Setup Store 不支持 $reset，需手动写重置函数。

---

## 3. 路由系统 (Router & Pages)

Nuxt 4 基于文件系统自动生成路由。底层依然是 `vue-router`，但不需要写路由表。

### 3.1 路由规则详解

| 文件路径 | 生成的路由 Path | 说明 |
| :--- | :--- | :--- |
| `pages/index.vue` | `/` | 首页 |
| `pages/about.vue` | `/about` | 静态路由 |
| `pages/detail/[id].vue` | `/detail/:id` | 动态路由 (必填参数) |
| `pages/detail/[id]/edit.vue`| `/detail/:id/edit` | 嵌套动态路由 |
| `pages/user-[group]/[id].vue` | `/user-:group/:id`| 混合动态路由 |
| `pages/[...slug].vue` | `/:slug(.*)*` | 捕获所有路由 (404 页面) |

### 3.2 导航组件 `<NuxtLink>`

所有内部跳转**必须**使用 `<NuxtLink>`，不要使用 `<a>` 标签(会导致页面完全刷新)。

```vue
<!-- 基本跳转 -->
<NuxtLink to="/home">首页</NuxtLink>

<!-- 动态参数跳转 -->
<NuxtLink :to="`/detail/${articleId}`">文章详情</NuxtLink>

<!-- 对象写法 (推荐) -->
<NuxtLink :to="{ name: 'detail-id', params: { id: 123 } }">
  文章详情
</NuxtLink>

<!-- 外部链接 (会自动添加 rel="noopener noreferrer") -->
<NuxtLink to="https://google.com" target="_blank">Google</NuxtLink>

<!-- 替换当前历史记录 (不留后退) -->
<NuxtLink to="/login" replace>登录</NuxtLink>
```

**提示**: Nuxt 会自动对视口内的 `<NuxtLink>` 进行**资源预加载 (Prefetching)**，提升点击后的跳转速度。

### 3.3 编程式导航 (JS 跳转)

Nuxt 提供了 `navigateTo` (推荐) 和 `useRouter`。

```typescript
// 1. navigateTo (Nuxt 封装，支持服务端重定向，推荐)
await navigateTo('/home')
await navigateTo({ path: '/detail/123' })
await navigateTo('https://external.com', { external: true }) // 跳转外部

// 2. useRouter (Vue Router 原生实例)
const router = useRouter()
router.push('/home')
router.back()
router.go(-1)
```

### 3.4 获取路由信息 `useRoute`

```typescript
const route = useRoute()

// 获取动态参数 /detail/123 -> 123
console.log(route.params.id) 

// 获取查询参数 /search?q=vue -> vue
console.log(route.query.q)

// 获取当前路径
console.log(route.path) // "/search"
console.log(route.fullPath) // "/search?q=vue"
```

### 3.5 路由中间件 (Middleware)

用于权限控制。

1.  **定义中间件** `middleware/auth.ts`:
```typescript
export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie('token')
  if (!token.value && to.path !== '/login') {
    return navigateTo('/login')
  }
})
```
2.  **页面使用中间件**:
```vue
<script setup>
definePageMeta({
  middleware: ['auth']
})
</script>
```

---

## 4. 核心配置 `nuxt.config.ts`

这是 Nuxt 项目的“控制台”。所有配置均支持 TypeScript 类型提示。

### 4.1 常用配置项详解

```typescript
export default defineNuxtConfig({
  // 1. 开启 SSR (服务端渲染)
  // true: 通用渲染(推荐); false: 仅客户端渲染(SPA模式)
  ssr: true,

  // 2. 开发工具 DevTools
  devtools: { enabled: true },

  // 3. 模块注册
  modules: [
    '@element-plus/nuxt', 
    '@pinia/nuxt'
  ],

  // 4. 应用级配置 (App Config)
  app: {
    // HTML <head> 配置
    head: {
      title: '默认标题',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    },
    // 页面切换动画
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  // 5. 运行时配置 (Runtime Config) - 环境变量
  runtimeConfig: {
    // 这里定义的 key 只能在服务端获取 (私有密钥)
    apiSecret: '123',
    
    // public 下的 key 可以在客户端和服务端获取
    public: {
      apiBase: '/api' // 可以通过 useRuntimeConfig().public.apiBase 获取
    }
  },

  // 6. 样式配置
  css: [
    '~/assets/css/main.scss',
    '~/assets/font/iconfont.css'
  ],

  // 7. Vite 构建配置
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // 全局注入变量与Mixin，每个 scss 文件自动引入这些内容
          additionalData: `@use "~/assets/css/variables.scss" as *;`
        }
      }
    },
    plugins: [
        // Vite 插件...
    ]
  },

  // 8. Nitro 服务端引擎配置 (代理核心)
  nitro: {
    devProxy: { 
      // 开发环境代理: 解决浏览器跨域
      '/api': {
        target: 'http://backend-api.com',
        changeOrigin: true
      }
    },
    routeRules: {
      // 生产环境或其他规则
      '/api/**': { proxy: 'http://backend-api.com/api/**' },
      
      // 页面缓存规则 (ISR)
      '/blog/**': { swr: 3600 }, // 博客文章缓存1小时
      '/admin/**': { ssr: false } // 后台管理仅客户端渲染
    }
  }
})
```

### 4.2 环境变量 (.env)

在根目录创建 `.env` 文件，可以直接覆盖 `runtimeConfig` 中的值。
命名规则：`NUXT_` + 配置路径 (大写 + 下划线)。

**nuxt.config.ts**:
```typescript
runtimeConfig: {
    public: {
        apiBase: '' // 默认空
    }
}
```

**.env**:
```bash
NUXT_PUBLIC_API_BASE=http://localhost:3000/api
```

Nuxt 会自动读取并覆盖。

---

## 5. 总结：如何写好 Nuxt 4 代码

1.  **Thinking in SSR**: 写代码时时刻问自己，“这行代码在服务器上跑会报错吗？” (例如访问 `window`, `document`)。
2.  **Use Composables**: 业务逻辑不要写在 Vue 组件里，抽离到 `composables/`。
3.  **Correct Imports**: 利用自动引入，保持代码简洁；使用 `import type` 导入类型。
4.  **Pinia + Cookie**: 记住 Token 存 Cookie，State 存 Pinia，这是 SSR 鉴权的最佳拍档。
