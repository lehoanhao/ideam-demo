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
const toast = useToast()
const customerStore = useCustomerStore()
const table = useTemplateRef('table')

const isAddModalOpen = ref(false)
const columnVisibility = ref({})
const rowSelection = ref({})
const pagination = ref({ pageIndex: 0, pageSize: 20 })

// Search filters
const filterCode = ref('')
const filterName = ref('')
const filterTags = ref<string[]>([])

// All available tags derived from loaded data
const allTags = computed(() => {
  const tagSet = new Set<string>()
  customerStore.customers.forEach(c => c.tags.forEach(t => tagSet.add(t)))
  return [...tagSet].sort()
})

// Client-side filtered customers
const filteredCustomers = computed(() => {
  return customerStore.customers.filter(c => {
    const matchCode = !filterCode.value
      || c.code.toLowerCase().includes(filterCode.value.toLowerCase())
      || c.id.toLowerCase().includes(filterCode.value.toLowerCase())
    const matchName = !filterName.value
      || c.name.toLowerCase().includes(filterName.value.toLowerCase())
      || (c.furigana ?? '').toLowerCase().includes(filterName.value.toLowerCase())
    const matchTags = filterTags.value.length === 0
      || filterTags.value.every(t => c.tags.includes(t))
    return matchCode && matchName && matchTags
  })
})

async function reloadData() {
  filterCode.value = ''
  filterName.value = ''
  filterTags.value = []
  await customerStore.fetchCustomers()
}

onMounted(() => {
  customerStore.fetchCustomers()
})

function getRowItems(row: { original: Customer }) {
  return [
    { type: 'label' as const, label: '操作' },
    {
      label: '詳細を表示',
      icon: 'i-lucide-eye',
      onSelect() { router.push(`/customers/${row.original.id}`) }
    },
    {
      label: '編集',
      icon: 'i-lucide-edit',
      onSelect() { router.push(`/customers/${row.original.id}`) }
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
      h('div', [
        h('p', { class: 'font-medium text-highlighted' }, row.original.name),
        row.original.furigana ? h('p', { class: 'text-xs text-muted' }, row.original.furigana) : null
      ])
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
  <UDashboardPanel id="customers">
    <template #header>
      <UDashboardNavbar title="顧客管理">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UButton
            icon="i-lucide-plus"
            label="顧客追加"
            @click="isAddModalOpen = true"
          />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <div class="flex items-center gap-2 flex-wrap">
            <UInput
              v-model="filterCode"
              placeholder="顧客IDで検索..."
              icon="i-lucide-hash"
              class="w-36"
            />
            <UInput
              v-model="filterName"
              placeholder="顧客名・ふりがな..."
              icon="i-lucide-search"
              class="w-52"
            />
            <USelectMenu
              v-model="filterTags"
              :items="allTags"
              multiple
              placeholder="タグで絞り込み"
              icon="i-lucide-tag"
              class="w-48"
            />
          </div>
        </template>

        <template #right>
          <UButton
            icon="i-lucide-refresh-cw"
            color="neutral"
            variant="outline"
            :loading="customerStore.loading"
            tooltip="データを再読み込み"
            @click="reloadData"
          />
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
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

      <div class="flex items-center justify-between gap-3 border-t border-default pt-4 mt-auto px-4 pb-4">
        <div class="text-sm text-muted">
          {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} /
          {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} 件選択
        </div>

        <div class="flex items-center gap-1.5">
          <UPagination
            :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
            :items-per-page="table?.tableApi?.getState().pagination.pageSize"
            :total="table?.tableApi?.getFilteredRowModel().rows.length"
            @update:page="(p: number) => table?.tableApi?.setPageIndex(p - 1)"
          />
        </div>
      </div>
    </template>
  </UDashboardPanel>

  <CustomersAddModal v-model:open="isAddModalOpen" @saved="customerStore.fetchCustomers()" />
</template>
