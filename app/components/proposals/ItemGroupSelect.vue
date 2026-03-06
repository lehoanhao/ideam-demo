<script setup lang="ts">
import type { SelectMenuItem } from '@nuxt/ui'

const items = ref([
  { label: '01: 食品', value: '01', icon: 'i-heroicons-cake', color: 'orange' as const },
  { label: '02: 菓子', value: '02', icon: 'i-heroicons-gift', color: 'pink' as const },
  { label: '03: 飲料', value: '03', icon: 'i-heroicons-beaker', color: 'sky' as const },
  { label: '04: 日用品', value: '04', icon: 'i-heroicons-home', color: 'green' as const },
  { label: '05: 文具', value: '05', icon: 'i-heroicons-pencil', color: 'yellow' as const },
  { label: '06: 衣料', value: '06', icon: 'i-heroicons-shopping-bag', color: 'purple' as const },
  { label: '07: 家電', value: '07', icon: 'i-heroicons-computer-desktop', color: 'blue' as const },
  { label: '08: 雑貨', value: '08', icon: 'i-heroicons-cube', color: 'amber' as const },
  { label: '09: 玩具', value: '09', icon: 'i-heroicons-puzzle-piece', color: 'red' as const },
  { label: '10: 花・園芸', value: '10', icon: 'i-heroicons-sun', color: 'lime' as const },
  { label: '11: スポーツ', value: '11', icon: 'i-heroicons-trophy', color: 'teal' as const },
  { label: '12: 工具', value: '12', icon: 'i-heroicons-wrench', color: 'slate' as const },
  { label: '99: その他', value: '99', icon: 'i-heroicons-ellipsis-horizontal-circle', color: 'neutral' as const }
] satisfies SelectMenuItem[])

const value = ref(items.value[0])

defineProps<{
  variant?: string
}>()
</script>

<template>
  <USelectMenu
    v-model="value"
    :items="items"
    :icon="value?.icon"
    :variant="(variant as any)"
    class="w-full"
    :ui="{
      content: 'min-w-40'
    }"
  />
</template>
