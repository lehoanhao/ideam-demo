<script setup lang="ts">
defineProps<{
  collapsed?: boolean
}>()
</script>

<template>
  <div class="mt-2 text-xl tracking-tight text-highlighted font-bold truncate" :class="collapsed ? 'hidden' : ''">
    iDeam Systems
  </div>
</template>
