<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import { getPaginationRowModel } from '@tanstack/table-core'
import type { TableColumn } from '@nuxt/ui'
import type { Customer } from '~/types'
import { useCustomerStore } from '~/stores/customers'

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UCheckbox = resolveComponent('UCheckbox')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const router = useRouter()
const route = useRoute()
const toast = useToast()
const customerStore = useCustomerStore()
const table = useTemplateRef('table')

const columnVisibility = ref({})
const rowSelection = ref({})
const pagination = ref({ pageIndex: 0, pageSize: 20 })

const currentTag = computed(() => {
  const t = route.params.tag
  return Array.isArray(t) ? t.join('/') : (t || '')
})

const pageTitle = computed(() => {
  if (!currentTag.value) return '顧客管理'
  return `顧客管理 - ${currentTag.value}`
})

const searchQuery = ref('')

// Advanced search
const showAdvancedSearch = ref(false)
const advancedSearch = ref({
  code: '',
  name: '',
  furigana: '',
  tags: [] as string[],
  contactValue: '',
  createdFrom: '',
  createdTo: '',
  updatedFrom: '',
  updatedTo: ''
})

function resetAdvancedSearch() {
  advancedSearch.value = {
    code: '',
    name: '',
    furigana: '',
    tags: [],
    contactValue: '',
    createdFrom: '',
    createdTo: '',
    updatedFrom: '',
    updatedTo: ''
  }
}

const allTags = computed(() => {
  const tagSet = new Set<string>()
  customerStore.customers.forEach(c => c.tags.forEach(t => tagSet.add(t)))
  return [...tagSet].sort()
})

const filteredCustomers = computed(() => {
  let list = customerStore.customers

  // Simple search
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(c =>
      c.name.toLowerCase().includes(q)
      || c.code.toLowerCase().includes(q)
      || (c.furigana ?? '').toLowerCase().includes(q)
    )
  }

  // Tag-based filter from route
  if (currentTag.value) {
    list = list.filter(c => c.tags.includes(currentTag.value))
  }

  // Advanced search filters
  const adv = advancedSearch.value
  if (adv.code) {
    const q = adv.code.toLowerCase()
    list = list.filter(c => c.code.toLowerCase().includes(q) || c.id.toLowerCase().includes(q))
  }
  if (adv.name) {
    const q = adv.name.toLowerCase()
    list = list.filter(c => c.name.toLowerCase().includes(q))
  }
  if (adv.furigana) {
    const q = adv.furigana.toLowerCase()
    list = list.filter(c => (c.furigana ?? '').toLowerCase().includes(q))
  }
  if (adv.tags.length > 0) {
    list = list.filter(c => adv.tags.every(t => c.tags.includes(t)))
  }
  if (adv.contactValue) {
    const q = adv.contactValue.toLowerCase()
    list = list.filter(c => c.contacts.some(ct => ct.value.toLowerCase().includes(q)))
  }
  if (adv.createdFrom) {
    list = list.filter(c => c.createdAt >= adv.createdFrom)
  }
  if (adv.createdTo) {
    list = list.filter(c => c.createdAt <= adv.createdTo)
  }
  if (adv.updatedFrom) {
    list = list.filter(c => c.updatedAt >= adv.updatedFrom)
  }
  if (adv.updatedTo) {
    list = list.filter(c => c.updatedAt <= adv.updatedTo)
  }

  return list
})

onMounted(() => {
  customerStore.fetchCustomers()
})

function getRowItems(row: { original: Customer }) {
  return [
    { type: 'label' as const, label: '操作' },
    {
      label: '詳細を表示',
      icon: 'i-lucide-eye',
      onSelect() { router.push(`/customers/d/${row.original.id}`) }
    },
    {
      label: '編集',
      icon: 'i-lucide-edit',
      onSelect() { router.push(`/customers/d/${row.original.id}`) }
    },
    { type: 'separator' as const },
    {
      label: '削除',
      icon: 'i-lucide-trash',
      color: 'error' as const,
      async onSelect() {
        try {
          await customerStore.deleteCustomer(row.original.id)
          toast.add({ title: '顧客を削除しました', color: 'success' })
        } catch {
          toast.add({ title: '削除に失敗しました', color: 'error' })
        }
      }
    }
  ]
}

const columns: TableColumn<Customer>[] = [
  {
    id: 'select',
    header: ({ table: t }) =>
      h(UCheckbox, {
        'modelValue': t.getIsSomePageRowsSelected() ? 'indeterminate' : t.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') => t.toggleAllPageRowsSelected(!!value),
        'ariaLabel': '全て選択'
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        'modelValue': row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
        'ariaLabel': '行を選択'
      })
  },
  { accessorKey: 'code', header: '顧客コード' },
  {
    accessorKey: 'name',
    header: '顧客名',
    cell: ({ row }) =>
      h('a', {
        class: 'text-primary hover:underline cursor-pointer font-medium',
        onClick: () => router.push(`/customers/d/${row.original.id}`)
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
    accessorKey: 'contacts',
    header: '連絡先',
    cell: ({ row }) => {
      const primary = row.original.contacts.find(c => c.isPrimary)
      return h('span', { class: 'text-sm text-muted' }, primary?.value || '-')
    }
  },
  {
    accessorKey: 'updatedAt',
    header: '最終更新',
    cell: ({ row }) =>
      h('span', { class: 'text-sm text-muted' }, new Date(row.original.updatedAt).toLocaleDateString('ja-JP'))
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
            label="顧客追加"
            @click="router.push('/customers/d/new')"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <UDashboardToolbar>
      <template #left>
        <UInput
          v-model="searchQuery"
          icon="i-lucide-search"
          placeholder="顧客コード・顧客名・ふりがなで検索..."
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
          {{ filteredCustomers.length }} 件
        </span>
      </template>
    </UDashboardToolbar>

    <!-- Advanced Search Panel -->
    <div
      v-show="showAdvancedSearch"
      class="border-b border-default bg-default/50 px-4 py-4 transition-all duration-200 ease-out"
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        <UFormField label="顧客コード" size="xs">
          <UInput
            v-model="advancedSearch.code"
            placeholder="例: C-001"
            size="xs"
            class="w-full"
          />
        </UFormField>
        <UFormField label="顧客名" size="xs">
          <UInput
            v-model="advancedSearch.name"
            placeholder="顧客名で検索"
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
        <UFormField label="連絡先" size="xs">
          <UInput
            v-model="advancedSearch.contactValue"
            placeholder="メール・電話・FAX"
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
        <UFormField label="更新日（開始）" size="xs">
          <CommonDatePicker v-model="advancedSearch.updatedFrom" size="xs" class="w-full" />
        </UFormField>
        <UFormField label="更新日（終了）" size="xs">
          <CommonDatePicker v-model="advancedSearch.updatedTo" size="xs" class="w-full" />
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
      :data="filteredCustomers"
      :columns="columns"
      :loading="customerStore.loading"
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
          {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} 件選択
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
