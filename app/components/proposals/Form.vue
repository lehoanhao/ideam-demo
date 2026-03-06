<script setup lang="ts">
const activeRow = ref<number | null>(null)
</script>

<template>
  <div class="flex flex-col gap-3 p-3">
    <ProposalsRow
      v-for="i in 3"
      :key="i"
      :no="i"
      :active="activeRow === i"
      class="px-3 py-2 cursor-pointer hover:shadow-md"
      @click="activeRow = activeRow === i ? null : i"
    />
  </div>
</template>
