<script setup lang="ts">
defineProps<{
  collapsed?: boolean
  variant?: 'default' | 'light'
}>()
</script>

<template>
  <div class="mt-2 text-xl tracking-tight font-bold truncate transition-all duration-300" :class="collapsed ? 'hidden' : ''" v-bind="$attrs">
    <span
      class="app-title bg-clip-text text-transparent bg-gradient-to-r"
      :class="variant === 'light'
        ? 'from-white via-blue-100 to-white'
        : 'from-primary-500 via-primary-400 to-primary-600'"
    >
      iDeam
    </span>
    <span :class="variant === 'light' ? 'text-white/80' : 'text-highlighted/70'" class="font-semibold"> Systems</span>
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
