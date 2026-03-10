<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Tag, TagCategory } from '~/types'
import { useTagsStore } from '~/stores/tags'

const store = useTagsStore()
const toast = useToast()

const categoryFilter = ref<TagCategory | ''>('')
const searchQuery = ref('')
const showAddModal = ref(false)

const newTag = reactive({
  name: '',
  category: 'customer' as TagCategory,
  color: 'neutral'
})

const editingTag = ref<Tag | null>(null)
const showEditModal = ref(false)

onMounted(() => store.fetchTags())

const categoryLabelMap: Record<TagCategory, string> = {
  customer: '顧客',
  manufacturer: 'メーカー',
  proposal: '提案',
  procurement: '仕入れ',
  activity: '営業活動'
}
const categoryColorMap: Record<TagCategory, string> = {
  customer: 'primary',
  manufacturer: 'info',
  proposal: 'success',
  procurement: 'warning',
  activity: 'neutral'
}

const categoryOptions = [
  { label: '顧客', value: 'customer' },
  { label: 'メーカー', value: 'manufacturer' },
  { label: '提案', value: 'proposal' },
  { label: '仕入れ', value: 'procurement' },
  { label: '営業活動', value: 'activity' }
]
const colorOptions = [
  { label: 'デフォルト', value: 'neutral' },
  { label: 'プライマリ', value: 'primary' },
  { label: '成功', value: 'success' },
  { label: '警告', value: 'warning' },
  { label: 'エラー', value: 'error' },
  { label: '情報', value: 'info' }
]

const filteredTags = computed(() => {
  let result: Tag[] = store.tags
  if (categoryFilter.value) {
    result = result.filter((t: Tag) => t.category === categoryFilter.value)
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter((t: Tag) => t.name.toLowerCase().includes(q))
  }
  return result
})

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')

const columns: TableColumn<Tag>[] = [
  {
    accessorKey: 'name',
    header: 'タグ名',
    cell: ({ row }) => h(UBadge, {
      color: (row.original.color || 'neutral') as any,
      variant: 'subtle'
    }, () => row.original.name)
  },
  {
    accessorKey: 'category',
    header: 'カテゴリ',
    cell: ({ row }) => h(UBadge, {
      color: categoryColorMap[row.original.category] as any,
      variant: 'outline',
      size: 'sm'
    }, () => categoryLabelMap[row.original.category])
  },
  {
    accessorKey: 'usageCount',
    header: '使用数',
    cell: ({ row }) => h('span', { class: 'tabular-nums' }, row.original.usageCount)
  },
  {
    accessorKey: 'updatedAt',
    header: '更新日',
    cell: ({ row }) => new Date(row.original.updatedAt).toLocaleDateString('ja-JP')
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => h('div', { class: 'flex items-center gap-1' }, [
      h(UButton, {
        icon: 'i-lucide-pencil',
        color: 'neutral',
        variant: 'ghost',
        size: 'sm',
        onClick: () => {
          editingTag.value = { ...row.original }
          showEditModal.value = true
        }
      }),
      h(UButton, {
        icon: 'i-lucide-trash',
        color: 'error',
        variant: 'ghost',
        size: 'sm',
        onClick: async () => {
          const ok = await store.deleteTag(row.original.id)
          if (ok) toast.add({ title: 'タグを削除しました', color: 'success' })
        }
      })
    ])
  }
]

async function handleCreate() {
  if (!newTag.name.trim()) return
  const result = await store.createTag(newTag)
  if (result) {
    toast.add({ title: 'タグを作成しました', color: 'success' })
    showAddModal.value = false
    newTag.name = ''
    newTag.category = 'customer'
    newTag.color = 'neutral'
  }
}

async function handleUpdate() {
  if (!editingTag.value || !editingTag.value.name.trim()) return
  const result = await store.updateTag(editingTag.value.id, editingTag.value)
  if (result) {
    toast.add({ title: 'タグを更新しました', color: 'success' })
    showEditModal.value = false
    editingTag.value = null
    store.fetchTags()
  }
}
</script>

<template>
  <UDashboardPanel>
    <UDashboardNavbar title="タグ管理">
      <template #right>
        <UButton
          label="新規タグ"
          icon="i-lucide-plus"
          color="primary"
          @click="showAddModal = true"
        />
      </template>
    </UDashboardNavbar>

    <UDashboardToolbar>
      <template #left>
        <UInput
          v-model="searchQuery"
          icon="i-lucide-search"
          placeholder="タグ名で検索..."
          class="w-48"
        />
        <USelectMenu
          v-model="categoryFilter"
          :items="categoryOptions"
          value-key="value"
          class="w-40"
          placeholder="カテゴリ"
        />
      </template>
      <template #right>
        <span class="text-sm text-muted">{{ filteredTags.length }}件</span>
      </template>
    </UDashboardToolbar>

    <UTable
      :data="filteredTags"
      :columns="columns"
      :loading="store.loading"
      class="flex-1"
    />

    <!-- Add Modal -->
    <UModal v-model:open="showAddModal">
      <template #content>
        <div class="p-6 space-y-4">
          <h3 class="text-lg font-semibold">
            新規タグ作成
          </h3>
          <UFormField label="タグ名">
            <UInput v-model="newTag.name" placeholder="タグ名を入力" />
          </UFormField>
          <UFormField label="カテゴリ">
            <USelectMenu v-model="newTag.category" :items="categoryOptions.slice(1)" value-key="value" />
          </UFormField>
          <UFormField label="カラー">
            <USelectMenu v-model="newTag.color" :items="colorOptions" value-key="value" />
          </UFormField>
          <div class="flex justify-end gap-2">
            <UButton
              label="キャンセル"
              variant="ghost"
              color="neutral"
              @click="showAddModal = false"
            />
            <UButton
              label="作成"
              color="primary"
              :disabled="!newTag.name.trim()"
              @click="handleCreate"
            />
          </div>
        </div>
      </template>
    </UModal>

    <!-- Edit Modal -->
    <UModal v-model:open="showEditModal">
      <template #content>
        <div v-if="editingTag" class="p-6 space-y-4">
          <h3 class="text-lg font-semibold">
            タグ編集
          </h3>
          <UFormField label="タグ名">
            <UInput v-model="editingTag.name" placeholder="タグ名を入力" />
          </UFormField>
          <UFormField label="カテゴリ">
            <USelectMenu v-model="editingTag.category" :items="categoryOptions.slice(1)" value-key="value" />
          </UFormField>
          <UFormField label="カラー">
            <USelectMenu v-model="editingTag.color" :items="colorOptions" value-key="value" />
          </UFormField>
          <div class="flex justify-end gap-2">
            <UButton
              label="キャンセル"
              variant="ghost"
              color="neutral"
              @click="showEditModal = false"
            />
            <UButton
              label="更新"
              color="primary"
              :disabled="!editingTag?.name?.trim()"
              @click="handleUpdate"
            />
          </div>
        </div>
      </template>
    </UModal>
  </UDashboardPanel>
</template>
