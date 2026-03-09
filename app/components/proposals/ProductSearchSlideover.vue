<script setup lang="ts">
interface Product {
  id: string
  productCode: string
  productName: string
  sellingPrice: string
  manufacturer: string
  itemGroup: string
}

const props = defineProps<{
  customer?: string
}>()

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  confirm: [products: Product[]]
}>()

const searchForm = reactive({
  keyword: '',
  customer: '',
  itemGroup: ''
})

watch(
  () => props.customer,
  (val) => {
    if (val) searchForm.customer = val
  },
  { immediate: true }
)

const selectedIds = ref<Set<string>>(new Set())

const allProducts = ref<Product[]>([
  {
    id: '1',
    productCode: 'A-001',
    productName: 'プレミアムギフトセット',
    sellingPrice: '3500',
    manufacturer: 'メーカーA',
    itemGroup: '01'
  },
  {
    id: '2',
    productCode: 'A-002',
    productName: '季節の和菓子詰め合わせ',
    sellingPrice: '2800',
    manufacturer: 'メーカーA',
    itemGroup: '02'
  },
  {
    id: '3',
    productCode: 'B-001',
    productName: '有機栽培コーヒーセット',
    sellingPrice: '4200',
    manufacturer: 'メーカーB',
    itemGroup: '03'
  },
  {
    id: '4',
    productCode: 'B-002',
    productName: 'ナチュラルハーブティー',
    sellingPrice: '1800',
    manufacturer: 'メーカーB',
    itemGroup: '03'
  },
  {
    id: '5',
    productCode: 'C-001',
    productName: '高級タオルギフト',
    sellingPrice: '5000',
    manufacturer: 'メーカーC',
    itemGroup: '04'
  },
  {
    id: '6',
    productCode: 'C-002',
    productName: 'アロマキャンドルセット',
    sellingPrice: '2200',
    manufacturer: 'メーカーC',
    itemGroup: '04'
  },
  {
    id: '7',
    productCode: 'D-001',
    productName: '国産牛ステーキセット',
    sellingPrice: '8000',
    manufacturer: 'メーカーD',
    itemGroup: '01'
  },
  {
    id: '8',
    productCode: 'D-002',
    productName: '海鮮おつまみセット',
    sellingPrice: '3000',
    manufacturer: 'メーカーD',
    itemGroup: '01'
  },
  {
    id: '9',
    productCode: 'E-001',
    productName: 'フルーツジュース詰め合わせ',
    sellingPrice: '2500',
    manufacturer: 'メーカーE',
    itemGroup: '03'
  },
  {
    id: '10',
    productCode: 'E-002',
    productName: '抹茶スイーツコレクション',
    sellingPrice: '3200',
    manufacturer: 'メーカーE',
    itemGroup: '02'
  }
])

const filteredProducts = computed(() => {
  return allProducts.value.filter((p) => {
    if (searchForm.keyword) {
      const kw = searchForm.keyword.toLowerCase()
      if (
        !p.productCode.toLowerCase().includes(kw)
        && !p.productName.toLowerCase().includes(kw)
      ) {
        return false
      }
    }
    if (searchForm.itemGroup && p.itemGroup !== searchForm.itemGroup) {
      return false
    }
    return true
  })
})

function toggleSelect(id: string) {
  const newSet = new Set(selectedIds.value)
  if (newSet.has(id)) {
    newSet.delete(id)
  } else {
    newSet.add(id)
  }
  selectedIds.value = newSet
}

function isSelected(id: string) {
  return selectedIds.value.has(id)
}

function toggleAll() {
  if (selectedIds.value.size === filteredProducts.value.length) {
    selectedIds.value = new Set()
  } else {
    selectedIds.value = new Set(filteredProducts.value.map(p => p.id))
  }
}

const isAllSelected = computed(
  () =>
    filteredProducts.value.length > 0
    && selectedIds.value.size === filteredProducts.value.length
)

function resetSearch() {
  searchForm.keyword = ''
  searchForm.itemGroup = ''
  if (props.customer) searchForm.customer = props.customer
}

function handleSearch() {
  selectedIds.value = new Set()
}

function handleConfirm() {
  const selected = allProducts.value.filter(p => selectedIds.value.has(p.id))
  emit('confirm', selected)
  selectedIds.value = new Set()
  open.value = false
}

function handleClose() {
  selectedIds.value = new Set()
  open.value = false
}
</script>

<template>
  <USlideover
    v-model:open="open"
    title="商品検索"
    :overlay="false"
    :ui="{ width: 'sm:max-w-xl', body: '!px-2 !pb-2' }"
  >
    <template #body>
      <div class="flex flex-col gap-4 h-full">
        <!-- Search form -->
        <div class="space-y-3 border-b border-muted pb-4">
          <UFormField label="過去実績顧客" size="xs">
            <CustomersSelect v-model="searchForm.customer" class="w-full" />
          </UFormField>
          <UFormField label="キーワード (品番・品名)" size="xs">
            <UInput
              v-model="searchForm.keyword"
              class="w-full"
              placeholder="品番または品名で検索"
            />
          </UFormField>
          <UFormField label="品群" size="xs">
            <ProposalsItemGroupSelect
              v-model="searchForm.itemGroup"
              class="w-full"
            />
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

        <!-- Product list -->
        <div class="flex-1 overflow-y-auto -mx-1">
          <div
            v-if="filteredProducts.length === 0"
            class="text-center text-muted text-sm py-8"
          >
            該当する商品がありません
          </div>
          <table v-else class="w-full text-xs">
            <thead class="sticky top-0 bg-elevated z-10">
              <tr class="border-b border-muted">
                <th class="p-1.5 text-left w-8">
                  <UCheckbox
                    :model-value="isAllSelected"
                    @update:model-value="toggleAll"
                  />
                </th>
                <th class="p-1.5 text-left">
                  品番
                </th>
                <th class="p-1.5 text-left">
                  品名
                </th>
                <th class="p-1.5 text-right">
                  売上単価
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="product in filteredProducts"
                :key="product.id"
                class="border-b border-muted hover:bg-elevated/50 cursor-pointer transition-colors"
                :class="isSelected(product.id) && 'bg-primary/5'"
                @click="toggleSelect(product.id)"
              >
                <td class="p-1.5">
                  <UCheckbox
                    :model-value="isSelected(product.id)"
                    @click.stop
                    @update:model-value="toggleSelect(product.id)"
                  />
                </td>
                <td class="p-1.5 font-mono">
                  {{ product.productCode }}
                </td>
                <td class="p-1.5">
                  {{ product.productName }}
                </td>
                <td class="p-1.5 text-right">
                  {{ Number(product.sellingPrice).toLocaleString() }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          v-if="selectedIds.size > 0"
          class="text-xs text-primary font-medium"
        >
          {{ selectedIds.size }} 件選択中
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
          :disabled="selectedIds.size === 0"
          @click="handleConfirm"
        />
      </div>
    </template>
  </USlideover>
</template>
