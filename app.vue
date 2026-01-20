<template>
  <div id="app">
    <ClientOnly>
      <SleekLineCursor />
    </ClientOnly>
    <NuxtLayout>
      <NuxtPage 
        :keepalive="{ include: ['home', 'detail'], max: 3 }" 
        :transition="{ name: 'fade-transform', mode: 'out-in' }" 
      />
    </NuxtLayout>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}
</style>
