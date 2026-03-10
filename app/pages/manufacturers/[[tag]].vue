<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import { getPaginationRowModel } from '@tanstack/table-core'
import type { TableColumn } from '@nuxt/ui'
import type { Manufacturer } from '~/types'
import { useManufacturerStore } from '~/stores/manufacturers'

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UCheckbox = resolveComponent('UCheckbox')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const router = useRouter()
const route = useRoute()
const toast = useToast()
const mfrStore = useManufacturerStore()
const table = useTemplateRef('table')

const columnVisibility = ref({})
const rowSelection = ref({})
const pagination = ref({ pageIndex: 0, pageSize: 20 })

const currentTag = computed(() => {
  const t = route.params.tag
  return Array.isArray(t) ? t.join('/') : (t || '')
})

const pageTitle = computed(() => {
  if (!currentTag.value) return 'メーカー管理'
  return `メーカー管理 - ${currentTag.value}`
})

const searchQuery = ref('')

// Advanced search
const showAdvancedSearch = ref(false)
const advancedSearch = ref({
  code: '',
  name: '',
  furigana: '',
  contactEmail: '',
  contactPhone: '',
  faxNumber: '',
  preferredContactMethod: '' as '' | 'email' | 'fax' | 'phone',
  productCategory: '',
  tags: [] as string[],
  createdFrom: '',
  createdTo: ''
})

function resetAdvancedSearch() {
  advancedSearch.value = {
    code: '',
    name: '',
    furigana: '',
    contactEmail: '',
    contactPhone: '',
    faxNumber: '',
    preferredContactMethod: '',
    productCategory: '',
    tags: [],
    createdFrom: '',
    createdTo: ''
  }
}

const contactMethodOptions = [
  { label: 'すべて', value: '' },
  { label: 'メール', value: 'email' },
  { label: 'FAX', value: 'fax' },
  { label: '電話', value: 'phone' }
]

const allTags = computed(() => {
  const tagSet = new Set<string>()
  mfrStore.manufacturers.forEach(m => m.tags.forEach(t => tagSet.add(t)))
  return [...tagSet].sort()
})

const allCategories = computed(() => {
  const catSet = new Set<string>()
  mfrStore.manufacturers.forEach(m => m.productCategories.forEach(c => catSet.add(c)))
  return [...catSet].sort()
})

onMounted(() => { mfrStore.fetchManufacturers() })

const contactMethodLabel = (method: string) => {
  const labels: Record<string, string> = { email: 'メール', fax: 'FAX', phone: '電話' }
  return labels[method] || method
}
const contactMethodColor = (method: string): 'primary' | 'success' | 'warning' => {
  const colors: Record<string, 'primary' | 'success' | 'warning'> = { email: 'primary', fax: 'warning', phone: 'success' }
  return colors[method] || 'primary'
}

const filteredManufacturers = computed(() => {
  let list = mfrStore.manufacturers

  // Simple search
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter((m: Manufacturer) =>
      m.name.toLowerCase().includes(q)
      || m.code.toLowerCase().includes(q)
      || (m.furigana ?? '').toLowerCase().includes(q)
    )
  }

  // Tag-based filter from route
  if (currentTag.value) {
    list = list.filter((m: Manufacturer) =>
      m.tags.includes(currentTag.value)
      || m.productCategories.includes(currentTag.value)
    )
  }

  // Advanced search filters
  const adv = advancedSearch.value
  if (adv.code) {
    const q = adv.code.toLowerCase()
    list = list.filter(m => m.code.toLowerCase().includes(q))
  }
  if (adv.name) {
    const q = adv.name.toLowerCase()
    list = list.filter(m => m.name.toLowerCase().includes(q))
  }
  if (adv.furigana) {
    const q = adv.furigana.toLowerCase()
    list = list.filter(m => (m.furigana ?? '').toLowerCase().includes(q))
  }
  if (adv.contactEmail) {
    const q = adv.contactEmail.toLowerCase()
    list = list.filter(m => (m.contactEmail ?? '').toLowerCase().includes(q))
  }
  if (adv.contactPhone) {
    const q = adv.contactPhone.toLowerCase()
    list = list.filter(m => (m.contactPhone ?? '').toLowerCase().includes(q))
  }
  if (adv.faxNumber) {
    const q = adv.faxNumber.toLowerCase()
    list = list.filter(m => (m.faxNumber ?? '').toLowerCase().includes(q))
  }
  if (adv.preferredContactMethod) {
    list = list.filter(m => m.preferredContactMethod === adv.preferredContactMethod)
  }
  if (adv.productCategory) {
    const q = adv.productCategory.toLowerCase()
    list = list.filter(m => m.productCategories.some(c => c.toLowerCase().includes(q)))
  }
  if (adv.tags.length > 0) {
    list = list.filter(m => adv.tags.every(t => m.tags.includes(t)))
  }
  if (adv.createdFrom) {
    list = list.filter(m => m.createdAt >= adv.createdFrom)
  }
  if (adv.createdTo) {
    list = list.filter(m => m.createdAt <= adv.createdTo)
  }

  return list
})

function getRowItems(row: { original: Manufacturer }) {
  return [
    { type: 'label' as const, label: '操作' },
    {
      label: '詳細を表示',
      icon: 'i-lucide-eye',
      onSelect() { router.push(`/manufacturers/d/${row.original.id}`) }
    },
    { type: 'separator' as const },
    {
      label: '削除',
      icon: 'i-lucide-trash',
      color: 'error' as const,
      async onSelect() {
        try {
          await mfrStore.deleteManufacturer(row.original.id)
          toast.add({ title: 'メーカーを削除しました', color: 'success' })
        } catch {
          toast.add({ title: '削除に失敗しました', color: 'error' })
        }
      }
    }
  ]
}

const columns: TableColumn<Manufacturer>[] = [
  {
    id: 'select',
    header: ({ table: t }) =>
      h(UCheckbox, {
        'modelValue': t.getIsSomePageRowsSelected() ? 'indeterminate' : t.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (v: boolean | 'indeterminate') => t.toggleAllPageRowsSelected(!!v),
        'ariaLabel': '全て選択'
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        'modelValue': row.getIsSelected(),
        'onUpdate:modelValue': (v: boolean | 'indeterminate') => row.toggleSelected(!!v),
        'ariaLabel': '行を選択'
      })
  },
  { accessorKey: 'code', header: 'コード' },
  {
    accessorKey: 'name',
    header: 'メーカー名',
    cell: ({ row }) =>
      h('a', {
        class: 'text-primary hover:underline cursor-pointer font-medium',
        onClick: () => router.push(`/manufacturers/d/${row.original.id}`)
      }, row.original.name)
  },
  {
    accessorKey: 'tags',
    header: 'タグ',
    cell: ({ row }) =>
      h('div', { class: 'flex gap-1 flex-wrap' },
        row.original.tags.map(tag =>
          h(UBadge, { key: tag, size: 'xs', variant: 'soft', color: 'primary' as const }, () => tag)
        )
      )
  },
  {
    accessorKey: 'preferredContactMethod',
    header: '連絡方法',
    cell: ({ row }) =>
      h(UBadge, {
        size: 'sm',
        variant: 'soft',
        color: contactMethodColor(row.original.preferredContactMethod)
      }, () => contactMethodLabel(row.original.preferredContactMethod))
  },
  {
    accessorKey: 'contactEmail',
    header: 'メール',
    cell: ({ row }) => h('span', { class: 'text-sm text-muted' }, row.original.contactEmail || '-')
  },
  {
    id: 'actions',
    cell: ({ row }) =>
      h('div', { class: 'flex justify-end' },
        h(UDropdownMenu, {
          content: { align: 'end' },
          items: getRowItems(row)
        }, () => h(UButton, { icon: 'i-lucide-ellipsis-vertical', color: 'neutral', variant: 'ghost', class: 'ml-auto' }))
      )
  }
]
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar :title="pageTitle">
        <template #right>
          <UButton
            icon="i-lucide-plus"
            label="メーカー追加"
            @click="router.push('/manufacturers/d/new')"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <UDashboardToolbar>
      <template #left>
        <UInput
          v-model="searchQuery"
          placeholder="メーカー名・コードで検索..."
          icon="i-lucide-search"
          class="w-72"
        />
        <UButton
          :icon="showAdvancedSearch ? 'i-lucide-chevron-up' : 'i-lucide-sliders-horizontal'"
          :label="showAdvancedSearch ? '検索を閉じる' : '高度な検索'"
          :color="showAdvancedSearch ? 'primary' : 'neutral'"
          variant="outline"
          @click="showAdvancedSearch = !showAdvancedSearch"
        />
      </template>
      <template #right>
        <span class="text-sm text-muted">
          {{ filteredManufacturers.length }} 件
        </span>
      </template>
    </UDashboardToolbar>

    <!-- Advanced Search Panel -->
    <div
      v-show="showAdvancedSearch"
      class="border-b border-default bg-default/50 px-4 py-4 transition-all duration-200 ease-out"
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        <UFormField label="コード" size="xs">
          <UInput
            v-model="advancedSearch.code"
            placeholder="例: M-001"
            size="xs"
            class="w-full"
          />
        </UFormField>
        <UFormField label="メーカー名" size="xs">
          <UInput
            v-model="advancedSearch.name"
            placeholder="メーカー名で検索"
            size="xs"
            class="w-full"
          />
        </UFormField>
        <UFormField label="ふりがな" size="xs">
          <UInput
            v-model="advancedSearch.furigana"
            placeholder="ふりがなで検索"
            size="xs"
            class="w-full"
          />
        </UFormField>
        <UFormField label="メール" size="xs">
          <UInput
            v-model="advancedSearch.contactEmail"
            placeholder="メールで検索"
            size="xs"
            class="w-full"
          />
        </UFormField>
        <UFormField label="電話番号" size="xs">
          <UInput
            v-model="advancedSearch.contactPhone"
            placeholder="電話番号で検索"
            size="xs"
            class="w-full"
          />
        </UFormField>
        <UFormField label="FAX番号" size="xs">
          <UInput
            v-model="advancedSearch.faxNumber"
            placeholder="FAX番号で検索"
            size="xs"
            class="w-full"
          />
        </UFormField>
        <UFormField label="連絡方法" size="xs">
          <USelect
            v-model="advancedSearch.preferredContactMethod"
            :items="contactMethodOptions"
            value-key="value"
            placeholder="すべて"
            size="xs"
            class="w-full"
          />
        </UFormField>
        <UFormField label="商品カテゴリ" size="xs">
          <USelectMenu
            v-model="advancedSearch.productCategory"
            :items="allCategories"
            placeholder="カテゴリで絞り込み"
            size="xs"
            class="w-full"
          />
        </UFormField>
        <UFormField label="タグ" size="xs">
          <USelectMenu
            v-model="advancedSearch.tags"
            :items="allTags"
            multiple
            placeholder="タグで絞り込み"
            size="xs"
            class="w-full"
          />
        </UFormField>
        <UFormField label="作成日（開始）" size="xs">
          <CommonDatePicker v-model="advancedSearch.createdFrom" size="xs" class="w-full" />
        </UFormField>
        <UFormField label="作成日（終了）" size="xs">
          <CommonDatePicker v-model="advancedSearch.createdTo" size="xs" class="w-full" />
        </UFormField>
      </div>
      <div class="flex justify-end gap-2 mt-4">
        <UButton
          icon="i-lucide-rotate-ccw"
          label="リセット"
          color="neutral"
          variant="outline"
          size="xs"
          @click="resetAdvancedSearch"
        />
        <UButton
          icon="i-lucide-search"
          label="検索"
          color="primary"
          size="xs"
          @click="pagination.pageIndex = 0"
        />
      </div>
    </div>

    <UTable
      ref="table"
      v-model:column-visibility="columnVisibility"
      v-model:row-selection="rowSelection"
      v-model:pagination="pagination"
      :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
      :data="filteredManufacturers"
      :columns="columns"
      :loading="mfrStore.loading"
      class="shrink-0"
      :ui="{
        base: 'table-fixed border-separate border-spacing-0',
        thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
        tbody: '[&>tr]:last:[&>td]:border-b-0',
        th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
        td: 'border-b border-default'
      }"
    />

    <template #footer>
      <div class="flex items-center justify-between gap-3 border-t border-default pt-4 mt-auto px-4 pb-4">
        <div class="text-sm text-muted">
          {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} /
          {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} 件
        </div>
        <UPagination
          :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
          :items-per-page="table?.tableApi?.getState().pagination.pageSize"
          :total="table?.tableApi?.getFilteredRowModel().rows.length"
          @update:page="(p: number) => table?.tableApi?.setPageIndex(p - 1)"
        />
      </div>
    </template>
  </UDashboardPanel>
</template>
