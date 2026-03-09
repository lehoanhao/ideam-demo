<script setup lang="ts">
interface ManufacturerItem {
  id: string
  code: string
  name: string
  productCategories: string[]
}

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  confirm: [manufacturer: ManufacturerItem]
}>()

const props = defineProps<{
  productCode?: string
}>()

const searchForm = reactive({
  productCode: '',
  manufacturerId: '',
  manufacturerName: ''
})

const selectedId = ref<string | null>(null)

const allManufacturers = ref<ManufacturerItem[]>([
  { id: '1', code: 'MFR-001', name: 'メーカーA（食品工業）', productCategories: ['食品', '飲料'] },
  { id: '2', code: 'MFR-002', name: 'メーカーB（菓子製造）', productCategories: ['菓子'] },
  { id: '3', code: 'MFR-003', name: 'メーカーC（日用品）', productCategories: ['日用品', '雑貨'] },
  { id: '4', code: 'MFR-004', name: 'メーカーD（飲料メーカー）', productCategories: ['飲料'] },
  { id: '5', code: 'MFR-005', name: 'メーカーE（総合食品）', productCategories: ['食品', '菓子', '飲料'] },
  { id: '6', code: 'MFR-006', name: 'メーカーF（生活用品）', productCategories: ['日用品'] },
  { id: '7', code: 'MFR-007', name: 'メーカーG（文具メーカー）', productCategories: ['文具'] },
  { id: '8', code: 'MFR-008', name: 'メーカーH（スポーツ用品）', productCategories: ['スポーツ'] }
])

const filteredManufacturers = computed(() => {
  return allManufacturers.value.filter((m) => {
    if (searchForm.manufacturerId) {
      if (!m.code.toLowerCase().includes(searchForm.manufacturerId.toLowerCase())) {
        return false
      }
    }
    if (searchForm.manufacturerName) {
      if (!m.name.toLowerCase().includes(searchForm.manufacturerName.toLowerCase())) {
        return false
      }
    }
    return true
  })
})

function isSelected(id: string) {
  return selectedId.value === id
}

function selectRow(id: string) {
  selectedId.value = selectedId.value === id ? null : id
}

function resetSearch() {
  searchForm.productCode = ''
  searchForm.manufacturerId = ''
  searchForm.manufacturerName = ''
}

function handleSearch() {
  selectedId.value = null
}

function handleConfirm() {
  if (!selectedId.value) return
  const selected = allManufacturers.value.find(m => m.id === selectedId.value)
  if (selected) {
    emit('confirm', selected)
    selectedId.value = null
    open.value = false
  }
}

function handleClose() {
  selectedId.value = null
  open.value = false
}

watch(open, (isOpen) => {
  if (isOpen) {
    searchForm.productCode = props.productCode || ''
  }
})
</script>

<template>
  <USlideover
    v-model:open="open"
    title="メーカー検索"
    :overlay="false"
    :ui="{ width: 'sm:max-w-xl', body: '!px-2 !pb-2' }"
  >
    <template #body>
      <div class="flex flex-col gap-4 h-full">
        <!-- Search form -->
        <div class="space-y-3 border-b border-muted pb-4">
          <UFormField label="過去実績の品番" size="xs">
            <UInput v-model="searchForm.productCode" class="w-full" placeholder="品番で検索" />
          </UFormField>
          <UFormField label="メーカーID" size="xs">
            <UInput v-model="searchForm.manufacturerId" class="w-full" placeholder="メーカーIDで検索" />
          </UFormField>
          <UFormField label="メーカー名" size="xs">
            <UInput v-model="searchForm.manufacturerName" class="w-full" placeholder="メーカー名で検索" />
          </UFormField>
          <div class="flex gap-2 justify-end">
            <UButton
              label="リセット"
              variant="outline"
              color="neutral"
              size="xs"
              icon="i-lucide-rotate-ccw"
              @click="resetSearch"
            />
            <UButton
              label="検索"
              color="primary"
              size="xs"
              icon="i-lucide-search"
              @click="handleSearch"
            />
          </div>
        </div>

        <!-- Manufacturer list -->
        <div class="flex-1 overflow-y-auto -mx-1">
          <div v-if="filteredManufacturers.length === 0" class="text-center text-muted text-sm py-8">
            該当するメーカーがありません
          </div>
          <table v-else class="w-full text-xs">
            <thead class="sticky top-0 bg-elevated z-10">
              <tr class="border-b border-muted">
                <th class="p-1.5 text-left w-8" />
                <th class="p-1.5 text-left">
                  メーカーID
                </th>
                <th class="p-1.5 text-left">
                  メーカー名
                </th>
                <th class="p-1.5 text-left">
                  取扱カテゴリ
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="mfr in filteredManufacturers"
                :key="mfr.id"
                class="border-b border-muted hover:bg-elevated/50 cursor-pointer transition-colors"
                :class="isSelected(mfr.id) && 'bg-primary/5'"
                @click="selectRow(mfr.id)"
              >
                <td class="p-1.5">
                  <URadio
                    :model-value="selectedId"
                    :value="mfr.id"
                    @click.stop
                    @update:model-value="selectRow(mfr.id)"
                  />
                </td>
                <td class="p-1.5 font-mono">
                  {{ mfr.code }}
                </td>
                <td class="p-1.5">
                  {{ mfr.name }}
                </td>
                <td class="p-1.5 text-muted">
                  {{ mfr.productCategories.join(', ') }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="selectedId" class="text-xs text-primary font-medium">
          1 件選択中
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex gap-2 justify-end w-full">
        <UButton
          label="閉じる"
          variant="outline"
          color="neutral"
          @click="handleClose"
        />
        <UButton
          label="確定"
          color="primary"
          icon="i-lucide-check"
          :disabled="!selectedId"
          @click="handleConfirm"
        />
      </div>
    </template>
  </USlideover>
</template>
