<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'

interface Account {
  id: string
  name: string
  email: string
  role: 'sales' | 'receiver' | 'approver' | 'admin'
  department: string
  isActive: boolean
  createdAt: string
  lastLoginAt: string | null
}

const toast = useToast()

const roleLabelMap: Record<Account['role'], string> = {
  sales: '営業',
  receiver: '受け入れ担当',
  approver: '提案承認者',
  admin: '管理者'
}
const roleColorMap: Record<Account['role'], string> = {
  sales: 'primary',
  receiver: 'info',
  approver: 'warning',
  admin: 'error'
}
const roleOptions = [
  { label: '営業', value: 'sales' },
  { label: '受け入れ担当', value: 'receiver' },
  { label: '提案承認者', value: 'approver' },
  { label: '管理者', value: 'admin' }
]

// Mock data
const accounts = ref<Account[]>([
  { id: 'u1', name: '加藤 誠', email: 'kato@example.com', role: 'sales', department: '営業部', isActive: true, createdAt: '2024-01-10', lastLoginAt: '2025-03-25' },
  { id: 'u2', name: '田中 太郎', email: 'tanaka@example.com', role: 'sales', department: '営業部', isActive: true, createdAt: '2024-02-15', lastLoginAt: '2025-03-24' },
  { id: 'u3', name: '佐藤 花子', email: 'sato@example.com', role: 'receiver', department: '仕入れ部', isActive: true, createdAt: '2024-03-01', lastLoginAt: '2025-03-20' },
  { id: 'u4', name: '鈴木 一郎', email: 'suzuki@example.com', role: 'approver', department: '経営', isActive: true, createdAt: '2024-01-01', lastLoginAt: '2025-03-22' },
  { id: 'u5', name: '山田 次郎', email: 'yamada@example.com', role: 'admin', department: 'IT', isActive: true, createdAt: '2024-01-01', lastLoginAt: '2025-03-25' },
  { id: 'u6', name: '中村 三郎', email: 'nakamura@example.com', role: 'sales', department: '営業部', isActive: false, createdAt: '2024-04-01', lastLoginAt: '2025-01-15' }
])

const searchQuery = ref('')
const roleFilter = ref('')
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingAccount = ref<Account | null>(null)

const newAccount = reactive({
  name: '',
  email: '',
  role: 'sales' as Account['role'],
  department: ''
})

const roleFilterOptions = [
  { label: 'すべて', value: '' },
  ...roleOptions
]

const filteredAccounts = computed(() => {
  let result = accounts.value
  if (roleFilter.value) {
    result = result.filter(a => a.role === roleFilter.value)
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(a =>
      a.name.toLowerCase().includes(q)
      || a.email.toLowerCase().includes(q)
      || a.department.toLowerCase().includes(q)
    )
  }
  return result
})

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')

const columns: TableColumn<Account>[] = [
  {
    accessorKey: 'name',
    header: '名前',
    cell: ({ row }) => h('div', [
      h('p', { class: 'font-medium text-sm' }, row.original.name),
      h('p', { class: 'text-xs text-muted' }, row.original.email)
    ])
  },
  {
    accessorKey: 'role',
    header: 'ロール',
    cell: ({ row }) => h(UBadge, {
      color: roleColorMap[row.original.role] as any,
      variant: 'subtle',
      size: 'sm'
    }, () => roleLabelMap[row.original.role])
  },
  {
    accessorKey: 'department',
    header: '部署'
  },
  {
    accessorKey: 'isActive',
    header: 'ステータス',
    cell: ({ row }) => h(UBadge, {
      color: row.original.isActive ? 'success' : 'neutral',
      variant: 'subtle',
      size: 'sm'
    }, () => row.original.isActive ? '有効' : '無効')
  },
  {
    accessorKey: 'lastLoginAt',
    header: '最終ログイン',
    cell: ({ row }) => row.original.lastLoginAt
      ? new Date(row.original.lastLoginAt).toLocaleDateString('ja-JP')
      : '—'
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
          editingAccount.value = { ...row.original }
          showEditModal.value = true
        }
      }),
      h(UButton, {
        icon: row.original.isActive ? 'i-lucide-user-x' : 'i-lucide-user-check',
        color: row.original.isActive ? 'warning' : 'success',
        variant: 'ghost',
        size: 'sm',
        onClick: () => {
          const idx = accounts.value.findIndex(a => a.id === row.original.id)
          if (idx !== -1) {
            accounts.value[idx]!.isActive = !accounts.value[idx]!.isActive
            toast.add({
              title: accounts.value[idx]!.isActive ? 'アカウントを有効にしました' : 'アカウントを無効にしました',
              color: 'success'
            })
          }
        }
      })
    ])
  }
]

function handleCreate() {
  if (!newAccount.name.trim() || !newAccount.email.trim()) return
  accounts.value.unshift({
    id: `u_${Date.now()}`,
    name: newAccount.name,
    email: newAccount.email,
    role: newAccount.role,
    department: newAccount.department,
    isActive: true,
    createdAt: new Date().toISOString().slice(0, 10),
    lastLoginAt: null
  })
  toast.add({ title: 'アカウントを作成しました', color: 'success' })
  showAddModal.value = false
  newAccount.name = ''
  newAccount.email = ''
  newAccount.role = 'sales'
  newAccount.department = ''
}

function handleUpdate() {
  if (!editingAccount.value) return
  const idx = accounts.value.findIndex(a => a.id === editingAccount.value!.id)
  if (idx !== -1) {
    accounts.value[idx] = { ...editingAccount.value }
    toast.add({ title: 'アカウントを更新しました', color: 'success' })
  }
  showEditModal.value = false
  editingAccount.value = null
}
</script>

<template>
  <UDashboardPanel>
    <UDashboardNavbar title="アカウント管理">
      <template #right>
        <UButton
          label="新規アカウント"
          icon="i-lucide-user-plus"
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
          placeholder="名前・メール検索..."
          class="w-48"
        />
        <USelectMenu
          v-model="roleFilter"
          :items="roleFilterOptions"
          value-key="value"
          class="w-40"
          placeholder="ロール"
        />
      </template>
      <template #right>
        <span class="text-sm text-muted">{{ filteredAccounts.length }}件</span>
      </template>
    </UDashboardToolbar>

    <UTable
      :data="filteredAccounts"
      :columns="columns"
      class="flex-1"
    />

    <!-- Add Modal -->
    <UModal v-model:open="showAddModal">
      <template #content>
        <div class="p-6 space-y-4">
          <h3 class="text-lg font-semibold">
            新規アカウント作成
          </h3>
          <UFormField label="名前" required>
            <UInput v-model="newAccount.name" placeholder="氏名を入力" />
          </UFormField>
          <UFormField label="メールアドレス" required>
            <UInput v-model="newAccount.email" type="email" placeholder="メールアドレスを入力" />
          </UFormField>
          <UFormField label="ロール">
            <USelectMenu v-model="newAccount.role" :items="roleOptions" value-key="value" />
          </UFormField>
          <UFormField label="部署">
            <UInput v-model="newAccount.department" placeholder="部署名" />
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
              :disabled="!newAccount.name.trim() || !newAccount.email.trim()"
              @click="handleCreate"
            />
          </div>
        </div>
      </template>
    </UModal>

    <!-- Edit Modal -->
    <UModal v-model:open="showEditModal">
      <template #content>
        <div v-if="editingAccount" class="p-6 space-y-4">
          <h3 class="text-lg font-semibold">
            アカウント編集
          </h3>
          <UFormField label="名前" required>
            <UInput v-model="editingAccount.name" placeholder="氏名を入力" />
          </UFormField>
          <UFormField label="メールアドレス" required>
            <UInput v-model="editingAccount.email" type="email" placeholder="メールアドレスを入力" />
          </UFormField>
          <UFormField label="ロール">
            <USelectMenu v-model="editingAccount.role" :items="roleOptions" value-key="value" />
          </UFormField>
          <UFormField label="部署">
            <UInput v-model="editingAccount.department" placeholder="部署名" />
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
              :disabled="!editingAccount?.name?.trim() || !editingAccount?.email?.trim()"
              @click="handleUpdate"
            />
          </div>
        </div>
      </template>
    </UModal>
  </UDashboardPanel>
</template>
