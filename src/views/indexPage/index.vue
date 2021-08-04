<!--
 * @Author: your name
 * @Date: 2021-03-02 15:02:28
 * @LastEditTime: 2021-08-04 16:38:17
 * @LastEditors: Peng wenlei
 * @Description: In User Settings Edit
 * @FilePath: \my_blog\src\views\indexPage\index.vue
-->
<template>
    <div class="index-page">
        <div class="index-page-left">
            <div class="index-page-title">
                <h3>从前慢</h3>
                <p>BEFORE SLOW</p>
            </div>
            <transition name="bounce">
                <div class="index-page-text" v-show="show">
                    <h1 class="welcome-title">欢迎来到从前慢的时光驿站!</h1>
                    <div class="welcome-xian"></div>
                    <div class="welcome-text">
                        Welcome to time station!
                    </div>
                    <div class="index-page-btn">
                        <button @click="goHome">点击进入</button>
                    </div>
                </div>
            </transition>
        </div>
        <transition name="el-zoom-in-center">
            <div class="index-page-right" v-show="show">
                <img src="@/assets/indexPageBg.jpg" alt="" srcset="" />
            </div>
        </transition>
        <div class="wb-href" @click="goHref">鄂ICP备2021007829号-1</div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            msg: 'hello index page',
            show: false
        }
    },
    mounted() {
        setTimeout(() => {
            this.show = !this.show
        }, 500)
    },
    methods: {
        goHome() {
            this.$router.replace('/home')
        },
        // 跳转工信部网站
        goHref() {
            window.open('https://beian.miit.gov.cn/', '_blank')
        }
    }
}
</script>

<style lang="scss" scoped>
.index-page {
    padding: 3.65%;
    background: #fff;
    color: #000;
    display: flex;
    .index-page-left {
        height: 100%;
        flex: 1;
        h1,
        h3,
        p {
            padding: 0;
            margin: 0;
        }
        .index-page-title {
            width: 149px;
            text-align: justify;
            text-align-last: justify;
            h3 {
                font-size: 36px;
                font-weight: bold;
                text-align: justify;
                text-align-last: justify;
            }
            p {
                font-size: 14px;
                color: #0f1741;
                text-align: justify;
                text-align-last: justify;
                letter-spacing: 1px;
                white-space: nowrap;
            }
        }
        .index-page-text {
            max-width: 413px;
            margin: 8.6% 100px;
            .welcome-title {
                font-size: 0.9rem;
                color: #0f1741;
                font-weight: Regular;
                font-family: '华康简综艺', Times, serif;
            }
            .welcome-xian {
                width: 100px;
                height: 3px;
                margin-top: 5%;
                margin-left: 5px;
                margin-bottom: 4%;
                background: rgba(15, 23, 65, 1);
                opacity: 1;
                border-radius: 33px;
            }
            .welcome-text {
                font-size: 30px;
                font-family: 'DIN';
                font-weight: bold;
                line-height: 49px;
            }
            .index-page-btn {
                margin-top: 7%;
                button {
                    width: 200px;
                    height: 71px;
                    background: linear-gradient(180deg, rgba(178, 228, 254, 1) 0%, rgba(136, 212, 248, 1) 100%);
                    box-shadow: 0px 10px 20px rgba(120, 204, 243, 0.6);
                    opacity: 1;
                    border-radius: 333px;
                    font-size: 20px;
                    font-family: PingFang SC;
                    font-weight: 800;
                    cursor: pointer;
                    outline: none;
                    border: none;
                }
            }
        }
    }
    .index-page-right {
        width: 50%;
        max-width: 1000px;
        img {
            width: 100%;
            height: 100%;
        }
    }
    .bounce-enter-active {
        animation: bounce-in 1s;
    }
    .bounce-leave-active {
        animation: bounce-in 1s reverse;
    }
    @keyframes bounce-in {
        0% {
            transform: scale(0);
        }
        50% {
            transform: scale(1.2);
        }
        100% {
            transform: scale(1);
        }
    }
}
.wb-href {
    width: 100%;
    position: absolute;
    text-align: center;
    bottom: 15px;
    cursor: pointer;
}

@media screen and (max-width: 900px) {
    .index-page {
        padding: 0;

        .index-page-left {
            width: 100%;
            position: absolute;
            box-sizing: border-box;
            z-index: 1;
            .index-page-title {
                margin-left: 15px;
                margin-top: 15px;
                h3 {
                    font-size: 24px;
                }
            }
            .index-page-text {
                max-width: 100%;
                margin: 8.6% 15px;
                text-align: center;
                .welcome-title {
                    text-align: left;
                }
                .welcome-text {
                    font-size: 24px;
                }
                .index-page-btn {
                    margin-top: 3%;
                    button {
                        width: 150px;
                        height: 50px;
                    }
                }
            }
        }
        .index-page-right {
            width: 100%;
            padding: 15px;
            box-sizing: border-box;
            position: absolute;
            top: 40%;
            z-index: 0;
        }
    }
}
</style>
