<template>
  <div class="inputOuter">
    <div class="inputContent" :class="hiddenOuter ? 'hiddenOuter' : ''">
      <div>
        <transition name="el-fade-in-linear">
          <el-tag
            effect="dark"
            closable
            class="tag"
            @close="tagClose"
            v-if="aiteName"
            size="small"
          >
            @{{ aiteName }}
          </el-tag>
        </transition>
      </div>
      <div v-if="identityLabel" class="identity-label">
        当前身份：{{ identityLabel }}
      </div>
      <el-input
        type="textarea"
        :rows="rows"
        placeholder="请输入内容"
        maxlength="130"
        show-word-limit
        resize="none"
        v-model="userContent"
        class="userContent"
      />
      <div class="submit-btn">
        <Button
          :styles="{
            width: rows === 4 ? '80px' : '100px',
            height: rows === 4 ? '26px' : '34px',
            borderRadius: '10px'
          }"
          :disabled="userContent.length === 0"
          text="提交"
          @onclick="comment"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { valiFunc } from '@/utils'
// Button component auto-imported

// Props
const props = defineProps({
  aiteName: {
    type: String,
    default: ''
  },
  rows: {
    type: Number,
    default: 8
  },
  hiddenOuter: {
    type: Boolean,
    default: false
  },
  identityLabel: {
    type: String,
    default: ''
  }
})

// Emits
const emit = defineEmits(['comment', 'tagClose'])

// 响应式数据
const userContent = ref('')

/**
 * 提交评论
 */
const comment = async () => {
  const valiData = [{ data: userContent.value, msg: '留言内容不能为空' }]
  const result = await valiFunc(valiData)
  if (!result) return

  emit('comment', userContent.value)
  userContent.value = ''
}

/**
 * 关闭标签
 */
const tagClose = () => {
  emit('tagClose')
}
</script>

<style lang="scss" scoped>
.inputContent {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  padding: 15px 12px;
  transition: all 0.3s;
  font-size: 14px;
  color: #e0e0e0;

  &.hiddenOuter {
    display: none;
  }
  
  :deep(.el-textarea__inner) {
    background: transparent;
    box-shadow: none;
    color: #e0e0e0;
    border: none;
    padding: 0;
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.4);
    }
  }
  
  :deep(.el-input__count) {
    background: transparent;
    color: rgba(255, 255, 255, 0.4);
  }
}

.userContent {
  margin-bottom: 10px;
}

.submit-btn {
  display: flex;
  justify-content: flex-end;
}

.tag {
  margin-bottom: 10px;
}

.identity-label {
  margin-bottom: 12px;
  color: rgba(255, 255, 255, 0.68);
  font-size: 13px;
}
</style>
