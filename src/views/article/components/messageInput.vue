<template>
    <div class="inputOuter">
        <div class="inputContent" :class="hiddenOuter ? 'hiddenOuter' : ''">
            <div>
                <transition name="el-fade-in-linear">
                    <el-tag effect="dark" closable class="tag" @close="tagClose" v-if="aiteName" size="small">@{{ aiteName }}</el-tag>
                </transition>
            </div>
            <el-input type="textarea" :rows="rows" placeholder="请输入内容" maxlength="130" show-word-limit resize="none" v-model="userContent" class="userContent"></el-input>
			<div class="submit-btn">
				<Button
				    :styles="{
				        width: rows === 4 ? '80px' : '100px',
				        height: rows === 4 ? '26px' : '34px',
				        borderRadius: '10px'
				    }"
					:disabled='userContent.length === 0'
				    text="提交"
				    @onclick="comment"
				/>
			</div>
        </div>
    </div>
</template>

<script>
import Button from '@/components/Button'
import { valiFunc } from '@/utils'

export default {
    components: { Button },
    props: {
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
        }
    },
    data() {
        return {
            userContent: ''
        }
    },
    methods: {
        async comment() {
            const valiData = [{ data: this.userContent, msg: '留言内容不能为空' }]
            const result = await valiFunc(valiData) // 验证没通过
            if (!result) return // 返回
            // !this.isPerfect && this.setUserNickName()
            this.$emit('comment', this.userContent)
            this.userContent = ''
        },
        tagClose() {
            this.$emit('tagClose')
        }
    }
}
</script>

<style lang="scss" scoped>
.inputContent {
    border: 1px solid #eee;
    border-radius: 6px;
    padding: 15px 12px;
    transition: all 0.3s;
    font-size: 14px;
    color: #333333;
    &.hiddenOuter {
        border: none;
        padding: 0;
    }
    .tag {
        margin-top: 10px;
        border-radius: 20px;
    }
    .userName.outerInput {
        border: 1px dashed #f0f0f0;
        /deep/ .el-input__inner {
            border: 1px dashed #f0f0f0 !important;
            &:focus {
                border-color: #008c8c !important;
            }
        }
    }
    .userName,
    .userContent {
        width: 50%;
        font-size: 14px;
        margin-right: 12px;
        transition: all 0.3s;
        border: none;
        border-radius: 4px;
        border-bottom: 1px dashed #f0f0f0;
        outline: none;
        /deep/ .el-input__inner {
            border: none;
            border-bottom: 1px dashed #dcdff6;
            &:focus {
                border-color: #008c8c;
            }
        }
        /deep/ .el-textarea__inner {
            border: 1px dashed #dcdff6;
            &:focus {
                border-color: #008c8c;
            }
        }
    }
    .submit {
        width: 100px;
        font-size: 14px;
        color: #5f5f5f;
        border-radius: 6px;
        background: #eaeaea;
        cursor: pointer;
        outline: none;
        border: none;
        margin-right: 12px;
        transition: all 0.3s;
    }
    .userContent {
        width: 100%;
        margin: 10px 0;
    }
	.submit-btn {
		text-align: right;
	}
}
</style>
