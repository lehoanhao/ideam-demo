<script setup lang="ts">
import type { SelectMenuItem } from '@nuxt/ui'

const items = ref([
  { label: 'A0101: 総代会役員記念', value: 'A0101' },
  { label: 'A0102: 総代会来賓記念', value: 'A0102' },
  { label: 'A0103: 総代会組合員記念', value: 'A0103' },
  { label: 'A0201: 理事会記念品', value: 'A0201' },
  { label: 'A0301: 周年記念品', value: 'A0301' },
  { label: 'B0101: 展示会ノベルティ', value: 'B0101' },
  { label: 'B0201: キャンペーン景品', value: 'B0201' },
  { label: 'B0301: 販促粗品', value: 'B0301' }
] satisfies SelectMenuItem[])

const value = ref(items.value[0])
</script>

<template>
  <USelectMenu
    v-model="value"
    :items="items"
    class="w-full"
    :ui="{
      content: 'min-w-48'
    }"
  />
</template>
