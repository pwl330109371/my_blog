<template>
  <div class="message">
    <span>评论列表</span>
    <span>（{{ lists.length }}）</span>
    <div class="messageList" v-for="list in lists" :key="list.id">
      <div class="parent">
        <div class="ml-info flex align-center space-between">
          <div class="avatar-name flex align-center">
            <el-image
              :src="list.user.picture"
              fit="cover"
            />
          </div>
          <div class="reply-date flex align-center space-between">
            <div class="name flex align-center">
              {{ list.user.nickName }}
              <el-tag
                class="master"
                effect="dark"
                size="small"
                v-if="list.user.role === 1"
              >
                站主
              </el-tag>
              <el-tag
                class="master"
                effect="dark"
                size="small"
                v-if="list.user.role === 2"
              >
                管理员
              </el-tag>
            </div>
            <div class="flex algin-center">
              <div class="reply" @click="setInput(list.user, list.id)">
                回复
              </div>
              <div class="date">{{ formatDateFilter(list.createdAt) }}</div>
            </div>
          </div>
        </div>
        <div class="ml-result">{{ list.content }}</div>
      </div>

      <!-- 子评论 -->
      <div
        class="children"
        v-for="children in list.replyComments"
        :key="children.id"
      >
        <div class="ml-info flex align-center space-between">
          <div class="avatar-name flex align-center">
            <el-image :src="children.targetUser.picture">
              <template #error>
                <div class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </template>
            </el-image>
          </div>
          <div class="reply-date flex align-center space-between">
            <div class="name flex align-center">
              {{ children.targetUser.nickName }}
              <span class="user-nickName">@{{ children.user.nickName }}</span>
              <el-tag
                class="master"
                effect="dark"
                size="small"
                v-if="children.user.role === 1"
              >
                站主
              </el-tag>
              <el-tag
                class="master"
                effect="dark"
                size="small"
                v-if="children.user.role === 2"
              >
                管理员
              </el-tag>
            </div>
            <div class="flex algin-center">
              <div class="reply" @click="setInput(children.user, list.id)">
                回复
              </div>
              <div class="date">{{ formatDateFilter(children.createdAt) }}</div>
            </div>
          </div>
        </div>
        <div class="ml-result">{{ children.content }}</div>
      </div>
    </div>

    <div class="loader flex align-center justify-center">
      <Loading v-show="isLoading" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatTime } from '@/utils'
// Loading auto-imported

// Props
defineProps({
  lists: {
    type: Array as any,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  isNext: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['reply'])

/**
 * 格式化日期
 */
const formatDateFilter = (val: string) => {
  return formatTime(new Date(val).getTime())
}

/**
 * 设置回复输入框
 */
const setInput = (data: any, parentId: any) => {
  const hash = document.getElementById('hash')
  if (hash) {
    hash.scrollIntoView({
        behavior: 'smooth'
    })
  }
  data.parentId = parentId
  emit('reply', data)
}
</script>

<style lang="scss" scoped>
.message {
  width: 100%;
  color: #e0e0e0;
  font-weight: 400;
  margin-bottom: 20px;
  display: inline-block;
  position: relative;
  margin-top: 50px;

  span {
    &:first-of-type {
      font-size: 18px;
      margin-right: 8px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    }
  }

  .messageList {
    padding: 25px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    &:first-of-type {
      margin-top: 16px;
    }

    .parent:hover,
    .children:hover {
      .reply {
        opacity: 1 !important;
      }
    }

    .children {
      padding-left: 50px;
      margin-top: 30px;
    }

    .ml-info {
      .avatar-name {
        img,
        .el-image {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          margin-right: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
      }

      .reply-date {
        flex: 1;
        position: relative;

        .reply {
          opacity: 0;
          font-size: 12px;
          color: #0096ff;
          margin-right: 12px;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: underline;
          text-transform: capitalize;
        }

        .date {
          color: rgba(255, 255, 255, 0.5);
          font-size: 13px;
          letter-spacing: 0;
        }

        .name {
          font-weight: 400;
          color: #0096ff;
          font-size: 16px;
          height: 20px;
          transition: all 0.3s;
          position: relative;
          border-bottom: 1px dashed rgba(0, 150, 255, 0.3);

          .master {
            border-bottom: none;
            font-size: 12px;
            margin-left: 10px;
          }
        }
      }
    }

    .ml-result {
      color: #d0d0d0;
      line-height: 22px;
      padding-left: 52px;
      white-space: pre-wrap;
      font-size: 14px;
      word-break: break-all;
      text-align: left;
    }

    .user-nickName {
      color: #409eff;
      border-bottom: none;
      margin-left: 5px;
    }
  }
}

.loader {
  height: 40px;
  margin-top: 30px;

  .notMany {
    letter-spacing: 2px;
    height: 34px;
    line-height: 36px;
    padding: 0 36px;
    color: #909090;
    border-bottom: none !important;
    font-size: 14px;
  }
}

// 响应式设计
@media screen and (max-width: 600px) {
  .loader {
    height: 30px;
    margin-top: 10px;

    .notMany {
      font-size: 14px !important;
    }
  }

  .message {
    margin-top: 30px;

    .messageList {
      .ml-info {
        .avatar-name {
          img {
            width: 36px;
            height: 36px;
          }

          span {
            font-size: 13px;
          }
        }

        .reply-date {
          display: block;

          .name {
            font-size: 13px;
            display: block;
            border-bottom: none;
            margin-bottom: 2px;
            text-align: left;

            .master {
              font-size: 10px;
              margin-left: 10px;
            }

            :deep(.el-tag--small) {
              height: 16px;
              line-height: 15px;
              padding: 0 3px;
            }
          }

          .reply {
            opacity: 1;
            position: absolute;
            right: 0;
            bottom: 14px;
          }

          .date {
            font-size: 12px;
          }
        }
      }

      .ml-result {
        font-size: 12px;
        padding-left: 0;
        margin-top: 10px;
        word-break: break-all;
        padding-left: 48px;
      }
    }
  }
}
</style>
