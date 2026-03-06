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
const toast = useToast()
const mfrStore = useManufacturerStore()
const table = useTemplateRef('table')

const isAddModalOpen = ref(false)
const columnFilters = ref([{ id: 'name', value: '' }])
const columnVisibility = ref({})
const rowSelection = ref({})
const pagination = ref({ pageIndex: 0, pageSize: 20 })

onMounted(() => { mfrStore.fetchManufacturers() })

const contactMethodLabel = (method: string) => {
  const labels: Record<string, string> = { email: 'メール', fax: 'FAX', phone: '電話' }
  return labels[method] || method
}
const contactMethodColor = (method: string): 'primary' | 'success' | 'warning' => {
  const colors: Record<string, 'primary' | 'success' | 'warning'> = { email: 'primary', fax: 'warning', phone: 'success' }
  return colors[method] || 'primary'
}

function getRowItems(row: { original: Manufacturer }) {
  return [
    { type: 'label' as const, label: '操作' },
    {
      label: '詳細を表示',
      icon: 'i-lucide-eye',
      onSelect() { router.push(`/manufacturers/${row.original.id}`) }
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
  <UDashboardPanel id="manufacturers">
    <template #header>
      <UDashboardNavbar title="メーカー管理">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <UButton icon="i-lucide-plus" label="メーカー追加" @click="isAddModalOpen = true" />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <UInput
            :model-value="(table?.tableApi?.getColumn('name')?.getFilterValue() as string) ?? ''"
            placeholder="メーカー名で検索..."
            icon="i-lucide-search"
            @update:model-value="table?.tableApi?.getColumn('name')?.setFilterValue($event)"
          />
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <UTable
        ref="table"
        v-model:column-filters="columnFilters"
        v-model:column-visibility="columnVisibility"
        v-model:row-selection="rowSelection"
        v-model:pagination="pagination"
        :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
        :data="mfrStore.manufacturers"
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

  <!-- メーカー追加モーダル -->
  <UModal v-model:open="isAddModalOpen" title="メーカー追加" description="新しいメーカー情報を入力してください">
    <template #body>
      <ManufacturersAddModal @saved="() => { isAddModalOpen = false; mfrStore.fetchManufacturers() }" />
    </template>
  </UModal>
</template>
