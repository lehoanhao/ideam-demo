<script setup lang="ts">
defineProps<{
  collapsed?: boolean
}>()
</script>

<template>
  <NuxtLink to="/" class="flex items-center gap-2 px-0 py-0 font-bold select-none" :class="collapsed ? 'justify-center' : ''">
    <div class="flex items-center justify-center size-10 rounded-lg bg-primary-100 border border-primary text-white text-sm font-extrabold shrink-0">
      <UIcon name="i-icon-park-twotone-connect" class="text-primary text-2xl" />
    </div>
  </NuxtLink>
</template>
