import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
    state: () => ({
        device: 'desktop'
    }),

    actions: {
        toggleDevice(device: string) {
            this.device = device
        }
    }
})
