<script setup lang="ts">
const store = useProposalStore()
const activeRow = ref<number | null>(null)
const productSearchOpen = ref(false)
const manufacturerSearchOpen = ref(false)
const manufacturerSearchRowId = ref<number | null>(null)

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

function handleProductConfirm(products: { productCode: string, productName: string, sellingPrice: string }[]) {
  store.addFormRowsFromProducts(products)
}

function openManufacturerSearch(rowId: number) {
  manufacturerSearchRowId.value = rowId
  manufacturerSearchOpen.value = true
}

function handleManufacturerConfirm(manufacturer: { name: string }) {
  if (manufacturerSearchRowId.value !== null) {
    const row = store.formRows.find((r: { id: number }) => r.id === manufacturerSearchRowId.value)
    if (row) {
      row.data.manufacturerName = manufacturer.name
    }
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
      @open-product-search="productSearchOpen = true"
      @open-manufacturer-search="openManufacturerSearch(row.id)"
    />
    <UButton
      label="行を追加"
      icon="i-lucide-plus"
      variant="outline"
      color="neutral"
      block
      @click="store.addFormRow()"
    />

    <ProposalsProductSearchSlideover
      v-model:open="productSearchOpen"
      @confirm="handleProductConfirm"
    />

    <ProposalsManufacturerSearchSlideover
      v-model:open="manufacturerSearchOpen"
      @confirm="handleManufacturerConfirm"
    />
  </div>
</template>
