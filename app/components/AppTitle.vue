<script setup lang="ts">
defineProps<{
  collapsed?: boolean
}>()
</script>

<template>
  <div class="mt-2 text-xl tracking-tight font-bold truncate transition-all duration-300" :class="collapsed ? 'hidden' : ''">
    <span class="app-title bg-gradient-to-r from-primary-500 via-primary-400 to-primary-600 bg-clip-text text-transparent">
      iDeam
    </span>
    <span class="text-highlighted/70 font-semibold"> Systems</span>
  </div>
</template>

<style scoped>
.app-title {
  background-size: 200% auto;
  animation: title-shimmer 4s ease-in-out infinite;
}

@keyframes title-shimmer {
  0%, 100% { background-position: 0% center; }
  50% { background-position: 100% center; }
}
</style>
