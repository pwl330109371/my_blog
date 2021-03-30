<template>
    <div class="max">
        <div id="scene" class="img-outer">
            <div data-depth="0.4" class="layer">
                <img src="https://image.raindays.cn/Mood/image/1594348066004.png" class="moveImg" :width="imgWidth" :height="imgHeight" />
            </div>
        </div>
        <div class="header flex align-center space-between">
            <img src="@img/textlogo.png" alt="" />
            <div class="icon" @click="showModal"><i class="el-icon-s-unfold"></i></div>
        </div>
        <div class="mask"></div>
        <div class="info">
            <div class="time">{{ date.month }} {{ date.day }}, {{ date.year }}</div>
            <div class="title">
                欢迎光临！！
                <transition name="el-fade-in-linear">
                    <span v-show="!hiddenText" class="tipsText">请向下滚动</span>
                </transition>
            </div>
            <div class="content">
                世间万般美好事物，我们高处再相见!
            </div>
        </div>
        <Menu @showModal="showModal" :showMenu="showMenu" />
    </div>
</template>
<script>
import Parallax from 'parallax-js'
import { setTimeout } from 'timers'
import Menu from '../Menu'
export default {
    name: 'giantScreen',
    components: {
        Menu
    },
    data() {
        return {
            imgWidth: null,
            imgHeight: null,
            hiddenText: false,
            showMenu: false, // 是否显示菜单
            date: {}
        }
    },
    created() {
        let wWidth = document.documentElement.clientWidth
        let wHeight = document.documentElement.clientHeight
        this.imgWidth = wWidth + 150
        this.imgHeight = wHeight + 150
        if (wWidth <= 600) {
            this.imgWidth = 1920 / 1.3
            this.imgHeight = 960
        }
        this.getYearMonthDay()
    },
    mounted() {
        const scene = document.getElementById('scene')
        const parallaxInstance = new Parallax(scene, {
            relativeInput: true,
            clipRelativeInput: true
        })
        this.hiddenTextEmit()
    },
    methods: {
        // 是否显示菜单
        showModal() {
            this.showMenu = !this.showMenu
        },
        async getYearMonthDay() {
            const date = new Date()
            const year = date.getFullYear()
            const month = date.getMonth() + 1
            const day = date.getDate()
            const result = `${year}-${month}-${day} ${123}`
            this.date = await this.$store.dispatch('app/dataHandle', {
                createdAt: result
            })
        },
        hiddenTextEmit() {
            setTimeout(() => {
                this.hiddenText = true
            }, 3000)
        }
    }
}
</script>
<style lang="scss" scoped>
@keyframes move {
    from {
        transform: translateY(0px);
    }
    to {
        transform: translateY(-20px);
    }
}
#scene {
    // height: 100%;
    position: relative;
    overflow: hidden;
    #image {
        position: absolute;
        max-width: none;
        display: block;
    }
}
.max {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    position: relative;
    z-index: 1;
    .img-outer {
        width: 100%;
        height: 100%;
        pointer-events: none;
    }
    .moveImg {
        margin-bottom: 20px;
        top: -30px;
        left: 50%;
        transform: translateX(-50%);
        position: absolute;
        max-width: none;
        display: block;
    }
}
.tipsText {
    color: greenyellow;
    font-weight: bold;
    display: inline-block;
    animation: move 0.6s infinite alternate;
}
.header {
    padding: 0 40px;
    position: absolute;
    left: 0;
    top: 70px;
    width: 100%;
    height: auto;
    z-index: 1;
    img {
        width: 40px;
        height: 44px;
        cursor: pointer;
    }
    .icon {
        font-size: 20px;
        color: #ff3600;
        background: rgba(255, 255, 255, 0.8);
        width: 30px;
        height: 30px;
        text-align: center;
        line-height: 32px;
        border-radius: 2px;
    }
}
.mask {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(176, 14, 37, 0.7);
    clip-path: polygon(0 0, 25% 0, 60% 100%, 0 100%);
    pointer-events: none;
}
.info {
    position: absolute;
    top: 54%;
    left: 10%;
    color: #fff;
    width: 30%;
    transform: translateY(-50%);
    color: #ffffff;
    font-size: 0.5rem;
    .time {
        font-size: 14px;
    }
    .title {
        font-size: 1rem;
        margin: 15px 0 30px;
    }
    .content {
        font-size: 15px;
    }
}
/deep/ .el-drawer {
    background-color: rgba(255, 255, 255, 0.92);
}
/deep/ .el-drawer.ttb {
    height: 100% !important;
}
.navs {
    margin-top: 5rem;
    font-size: 0.7rem;
    color: #666;
}
@media screen and (max-width: 900px) {
    .mask {
        clip-path: polygon(0 0, 220px 0, 700px 100%, 0 100%);
    }
}
@media screen and (max-width: 780px) {
    .header {
        top: 40px;
        padding: 0 20px;
    }
    .mask {
        clip-path: none;
    }
    .info {
        bottom: 8%;
        left: 5%;
        top: 50%;
        width: 70%;
        transform: none;
    }
}
</style>
