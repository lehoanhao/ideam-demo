<script setup lang="ts">
defineProps<{
  collapsed?: boolean
}>()
</script>

<template>
  <NuxtLink to="/" class="flex items-center gap-2 px-0 py-0 font-bold select-none" :class="collapsed ? 'justify-center' : ''">
    <div class="flex items-center justify-center size-8 rounded-lg bg-primary-100 border border-primary text-white text-sm font-extrabold shrink-0">
      <UIcon name="i-lucide-rocket" size="xs" class="text-primary" />
    </div>
    <span v-if="!collapsed" class="text-lg tracking-tight text-highlighted truncate">
      iDeam Systems
    </span>
  </NuxtLink>
</template>
