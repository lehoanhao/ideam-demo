<script setup lang="ts">
import { useManufacturerStore } from '~/stores/manufacturers'

const model = defineModel<string>({ default: '' })

defineProps<{
  variant?: string
}>()

const manufacturerStore = useManufacturerStore()

onMounted(async () => {
  if (!manufacturerStore.manufacturers.length) {
    await manufacturerStore.fetchManufacturers()
  }
})

const items = computed(() =>
  manufacturerStore.manufacturers.map(m => ({
    label: `${m.code}: ${m.name}`,
    value: m.name
  }))
)
</script>

<template>
  <USelectMenu
    v-model="model"
    :items="items"
    value-key="value"
    :variant="(variant as any)"
    class="w-full"
    :ui="{
      content: 'min-w-48'
    }"
  />
</template>
