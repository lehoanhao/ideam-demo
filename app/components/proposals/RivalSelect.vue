<script setup lang="ts">
import type { SelectMenuItem } from '@nuxt/ui'

const items = ref([
  { label: 'A社: 山田商事', value: 'R01' },
  { label: 'B社: 鈴木物産', value: 'R02' },
  { label: 'C社: 佐藤貿易', value: 'R03' },
  { label: 'D社: 田中産業', value: 'R04' },
  { label: 'E社: 高橋商店', value: 'R05' },
  { label: 'F社: 渡辺企画', value: 'R06' },
  { label: 'G社: 中村販売', value: 'R07' },
  { label: 'H社: 小林流通', value: 'R08' },
  { label: '99: その他', value: '99' }
] satisfies SelectMenuItem[])

const model = defineModel<string>({ default: '' })

defineProps<{
  variant?: string
}>()
</script>

<template>
  <USelectMenu
    v-model="model"
    :items="items"
    :variant="(variant as any)"
    value-key="value"
    class="w-full"
    placeholder="ライバルを選択"
    :ui="{
      content: 'min-w-48'
    }"
  />
</template>
