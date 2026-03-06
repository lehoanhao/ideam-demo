<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()

useSeoMeta({
  title: 'ページが見つかりません',
  description: 'お探しのページは見つかりませんでした。'
})

useHead({
  htmlAttrs: {
    lang: 'ja'
  }
})
</script>

<template>
  <UApp>
    <UError :error="error" />
  </UApp>
</template>
