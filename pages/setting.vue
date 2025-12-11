<template>
  <div class="content">
    <div class="title flex align-center">
      <div class="flex align-center"><span></span>个人信息设置</div>
    </div>
    <el-form class="form" ref="formRef" :model="form" label-width="80px">
      <el-form-item label="头像">
        <el-upload
          class="avatar-uploader"
          :action="mainUrl + '/ossUpload'"
          :disabled="userInfo?.id !== 1"
          :headers="uploadHeaders"
          :on-error="uploadError"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="form.avatar" :src="form.avatar" class="avatar" alt="头像" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="form.userName"></el-input>
      </el-form-item>
      <el-form-item label="生日">
        <el-date-picker
          v-model="form.birthday"
          type="date"
          placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item label="座右铭">
        <el-input v-model="form.motto"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
// useUserStore auto-imported from stores/user.ts
// useUserApi auto-imported: updateUserInfo

// Store
const userStore = useUserStore()

// Refs
const formRef = ref(null)

// 响应式数据
const form = ref({
  userName: '',
  birthday: '',
  motto: '',
  avatar: '',
  id: ''
})

// 计算属性
const userInfo = computed(() => userStore.userInfo || {})
// Runtime config for API base
const config = useRuntimeConfig()
const mainUrl = computed(() => config.public.apiBase || '/api')

// Upload headers
const uploadHeaders = computed(() => {
    // Only client side has localStorage/cookie
    const token = useCookie('token').value
    return {
        authorization: 'bearer ' + token
    }
})

/**
 * 头像上传成功
 */
const handleAvatarSuccess = (res, file) => {
  form.value.avatar = res.data
  ElMessage.success('图片上传成功')
}

/**
 * 上传前验证
 */
const beforeAvatarUpload = (file) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
  // const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('上传头像图片只能是 JPG 或者 PNG 格式!')
  }
  // if (!isLt2M) {
  //   ElMessage.error('上传头像图片大小不能超过 2MB!')
  // }
  // return isJPG && isLt2M
  return isJPG
}

/**
 * 上传失败
 */
const uploadError = (e) => {
  try {
    const errorMsg = JSON.parse(e.message).msg
    ElMessage.error(errorMsg)
  } catch (error) {
    ElMessage.error('上传失败')
  }
}

/**
 * 提交表单
 */
const onSubmit = async () => {
  try {
    const res: any = await updateUserInfo(form.value)
    const data = res.data || res
    
    ElMessage.success(data.msg || '保存成功')
    userStore.setUserInfo(data.data)
  } catch (error) {
    console.error('更新用户信息失败:', error)
    ElMessage.error('保存失败，请重试')
  }
}

/**
 * 监听用户信息变化
 */
watch(
  userInfo,
  (newval) => {
    for (let key in form.value) {
      if (newval[key]) {
        form.value[key] = newval[key]
      }
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.img-outer {
  width: 90px;
  height: 90px;
  background-color: #40a0ff59;
  border-radius: 50%;

  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }
}

:deep(.el-form-item__content) {
  display: flex;
}

.form {
  margin-top: 40px;
  width: 600px; // Limit width
  margin: 40px auto;
}

:deep(.avatar-uploader .el-upload) {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

:deep(.avatar-uploader .el-upload:hover) {
  border-color: #409eff;
}

:deep(.avatar-uploader-icon) {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

:deep(.avatar) {
  width: 178px;
  height: 178px;
  display: block;
}

.content {
    padding: 80px 20px;
}
</style>
