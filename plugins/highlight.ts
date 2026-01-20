import hljs from 'highlight.js'
import 'highlight.js/styles/monokai-sublime.css' // Style chosen from original project

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive('highlight', (el) => {
        const blocks = el.querySelectorAll('pre code') as NodeListOf<HTMLElement>
        blocks.forEach((block: HTMLElement) => {
            hljs.highlightElement(block)
        })
    })
})
