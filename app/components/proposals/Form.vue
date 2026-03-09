<script setup lang="ts">
const store = useProposalStore()
const activeRow = ref<number | null>(null)

const emit = defineEmits<{
  'pick-comment-field': [rowId: number, fieldKey: string]
}>()

function handlePickField(rowId: number, fieldKey: string) {
  if (store.pickingNoteId !== null) {
    store.pickField(rowId, fieldKey)
  } else if (store.pickingCommentId !== null) {
    emit('pick-comment-field', rowId, fieldKey)
  }
}
</script>

<template>
  <div class="flex flex-col gap-3 p-3">
    <ProposalsRow
      v-for="(row, index) in store.formRows"
      :key="row.id"
      v-model="row.data"
      :no="index + 1"
      :row-id="row.id"
      :active="activeRow === row.id"
      :created-at="row.createdAt"
      :updated-at="row.updatedAt"
      :highlights="store.highlights"
      :picking="store.pickingNoteId !== null || store.pickingCommentId !== null"
      class="px-3 py-2 cursor-pointer hover:shadow-md"
      @click="activeRow = activeRow === row.id ? null : row.id"
      @delete="store.removeFormRow(row.id)"
      @duplicate="store.duplicateFormRow(row.id)"
      @pick-field="handlePickField(row.id, $event)"
    />
    <UButton
      label="行を追加"
      icon="i-lucide-plus"
      variant="outline"
      color="neutral"
      block
      @click="store.addFormRow()"
    />
  </div>
</template>
