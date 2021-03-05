<!--
 * @Description: 文件描述
 * @Author: Peng wenlei
 * @Date: 2021-03-05 20:20:21
 * @LastEditTime: 2021-03-05 20:25:19
 * @LastEditors: Peng wenlei
-->
<template>
    <div>
        <canvas class="cavs" width="1920" height="927" />
    </div>
</template>

<script>
function colorValue(min) {
    return Math.floor(Math.random() * 255 + min)
}
function createColorStyle(r, g, b) {
    return 'rgba(' + r + ',' + g + ',' + b + ', 0.8)'
}
function Color(min) {
    min = min || 0
    this.r = colorValue(min)
    this.g = colorValue(min)
    this.b = colorValue(min)
    this.style = createColorStyle(this.r, this.g, this.b)
}
function Dot() {
    const canvas = document.querySelector('canvas')
    this.x = Math.random() * canvas.width
    this.y = Math.random() * canvas.height

    this.vx = -0.5 + Math.random()
    this.vy = -0.5 + Math.random()

    this.radius = Math.random() * 2

    this.color = new Color()
}

export default {
    name: 'Login',
    data() {
        return {
            redirect: undefined,
            canvas: null,
            ctx: null,
            dots: {},
            mousePosition: {}
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
    mounted() {
        this.init()
    },
    methods: {
        // 粒子特效初始化
        init() {
            const canvas = document.querySelector('canvas')
            const ctx = canvas.getContext('2d')
            this.dots = {
                nb: 250,
                distance: 100,
                d_radius: 150,
                array: []
            }
            const mousePosition = {
                x: (30 * canvas.width) / 100,
                y: (30 * canvas.height) / 100
            }
            this.mousePosition = mousePosition
            try {
                if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
                    // 1
                } else {
                    // this.canvas.width = $(window).width();
                    // this.canvas.height = $(window).height();
                    canvas.width = window.innerWidth
                    canvas.height = window.innerHeight
                    ctx.lineWidth = 0.3
                    ctx.strokeStyle = new Color(150).style

                    canvas.addEventListener('mousemove', function(e) {
                        mousePosition.x = e.pageX
                        mousePosition.y = e.pageY
                    })

                    canvas.addEventListener('mouseleave', function(e) {
                        mousePosition.x = canvas.width / 2
                        mousePosition.y = canvas.height / 2
                    })

                    this.createDots()
                    requestAnimationFrame(this.animateDots)
                }
            } catch (e) {
                console.log(e)
                // 1
            }
        },
        mixComponents(comp1, weight1, comp2, weight2) {
            return (comp1 * weight1 + comp2 * weight2) / (weight1 + weight2)
        },
        averageColorStyles(dot1, dot2) {
            var color1 = dot1.color
            var color2 = dot2.color

            var r = this.mixComponents(color1.r, dot1.radius, color2.r, dot2.radius)
            var g = this.mixComponents(color1.g, dot1.radius, color2.g, dot2.radius)
            var b = this.mixComponents(color1.b, dot1.radius, color2.b, dot2.radius)
            return createColorStyle(Math.floor(r), Math.floor(g), Math.floor(b))
        },
        createDots() {
            const canvas = document.querySelector('canvas')
            const ctx = canvas.getContext('2d')
            Dot.prototype = {
                draw: function() {
                    ctx.beginPath()
                    ctx.fillStyle = this.color.style
                    ctx.arc(this.x, this.y, this.radius, 0, Math.PI, false)
                    ctx.fill()
                }
            }
            for (let i = 0; i < this.dots.nb; i++) {
                this.dots.array.push(new Dot())
            }
        },
        moveDots() {
            const canvas = document.querySelector('canvas')
            const dots = this.dots
            for (let i = 0; i < dots.nb; i++) {
                var dot = dots.array[i]
                if (dot.y < 0 || dot.y > canvas.height) {
                    // dot.vx = dot.vx
                    dot.vy = -dot.vy
                } else if (dot.x < 0 || dot.x > canvas.width) {
                    dot.vx = -dot.vx
                    // dot.vy = dot.vy
                }
                dot.x += dot.vx
                dot.y += dot.vy
            }
        },
        connectDots() {
            const canvas = document.querySelector('canvas')
            const ctx = canvas.getContext('2d')
            const dots = this.dots
            const mousePosition = this.mousePosition
            for (let i = 0; i < dots.nb; i++) {
                for (let j = 0; j < dots.nb; j++) {
                    var i_dot = dots.array[i]
                    var j_dot = dots.array[j]

                    if (i_dot.x - j_dot.x < dots.distance && i_dot.y - j_dot.y < dots.distance && i_dot.x - j_dot.x > -dots.distance && i_dot.y - j_dot.y > -dots.distance) {
                        if (i_dot.x - mousePosition.x < dots.d_radius && i_dot.y - mousePosition.y < dots.d_radius && i_dot.x - mousePosition.x > -dots.d_radius && i_dot.y - mousePosition.y > -dots.d_radius) {
                            ctx.beginPath()
                            ctx.strokeStyle = this.averageColorStyles(i_dot, j_dot)
                            ctx.moveTo(i_dot.x, i_dot.y)
                            ctx.lineTo(j_dot.x, j_dot.y)
                            ctx.stroke()
                            ctx.closePath()
                        }
                    }
                }
            }
        },
        drawDots() {
            const dots = this.dots
            for (let i = 0; i < dots.nb; i++) {
                var dot = dots.array[i]
                dot.draw()
            }
        },
        animateDots() {
            const canvas = document.querySelector('canvas')
            const ctx = canvas.getContext('2d')
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            this.moveDots()
            this.connectDots()
            this.drawDots()
            requestAnimationFrame(this.animateDots)
        }
    }
}
</script>

<style lang="scss" scoped>
.cavs {
    z-index: 1;
    position: fixed;
    width: 95%;
    margin-left: 20px;
    margin-right: 20px;
    left: 0;
}
</style>
