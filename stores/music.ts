import { defineStore } from 'pinia'

export interface Song {
  id: number | string
  title: string
  artist: string
  cover: string
  url: string
  duration: string
}

export const useMusicStore = defineStore('music', {
  state: () => ({
    isPlaying: false,
    currentTrack: null as Song | null,
    playlist: [] as Song[],
    showPlayer: false,
    volume: 0.5
  }),

  actions: {
    setPlaylist(list: Song[]) {
      this.playlist = list
      if (list.length > 0 && !this.currentTrack) {
        this.currentTrack = list[0]
      }
    },
    playTrack(track: Song) {
      if (this.currentTrack?.id !== track.id) {
        this.currentTrack = track
      }
      this.isPlaying = true
    },
    togglePlay() {
      this.isPlaying = !this.isPlaying
    },
    nextTrack() {
      if (!this.currentTrack || this.playlist.length === 0) return
      const index = this.playlist.findIndex(t => t.id === this.currentTrack?.id)
      const nextIndex = (index + 1) % this.playlist.length
      this.currentTrack = this.playlist[nextIndex]
      this.isPlaying = true
    },
    prevTrack() {
      if (!this.currentTrack || this.playlist.length === 0) return
      const index = this.playlist.findIndex(t => t.id === this.currentTrack?.id)
      const prevIndex = (index - 1 + this.playlist.length) % this.playlist.length
      this.currentTrack = this.playlist[prevIndex]
      this.isPlaying = true
    },
    togglePlayer() {
      this.showPlayer = !this.showPlayer
    }
  }
})
