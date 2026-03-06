<script setup lang="ts">
import { useCustomerStore } from '~/stores/customers'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const customerStore = useCustomerStore()

const customerId = route.params.id as string
const customer = computed(() => customerStore.selectedCustomer)

const activeTab = ref('overview')
const isEditMode = ref(false)
const isDeleteModalOpen = ref(false)
const isSaving = ref(false)

const tabs = [
  { value: 'overview', label: '概要', icon: 'i-lucide-info' },
  { value: 'contacts', label: '連絡先', icon: 'i-lucide-phone' },
  { value: 'proposals', label: '提案履歴', icon: 'i-lucide-file-text' }
]

const editState = reactive({
  name: '',
  furigana: '',
  notes: ''
})

onMounted(async () => {
  await customerStore.getCustomerById(customerId)
  if (customer.value) {
    editState.name = customer.value.name
    editState.furigana = customer.value.furigana || ''
    editState.notes = customer.value.notes || ''
  }
})

async function saveCustomer() {
  isSaving.value = true
  try {
    await customerStore.updateCustomer(customerId, {
      name: editState.name,
      furigana: editState.furigana,
      notes: editState.notes
    })
    isEditMode.value = false
    toast.add({ title: '顧客情報を更新しました', color: 'success' })
  } catch {
    toast.add({ title: '更新に失敗しました', color: 'error' })
  } finally {
    isSaving.value = false
  }
}

async function deleteCustomer() {
  try {
    await customerStore.deleteCustomer(customerId)
    toast.add({ title: '顧客を削除しました', color: 'success' })
    router.push('/customers')
  } catch {
    toast.add({ title: '削除に失敗しました', color: 'error' })
  }
}

const contactTypeLabel = (type: string) => {
  const labels: Record<string, string> = { email: 'メール', phone: '電話', fax: 'FAX' }
  return labels[type] || type
}
const contactTypeColor = (type: string) => {
  const colors: Record<string, 'primary' | 'success' | 'warning'> = { email: 'primary', phone: 'success', fax: 'warning' }
  return colors[type] || 'primary'
}
</script>

<template>
  <UDashboardPanel id="customer-detail">
    <template #header>
      <UDashboardNavbar :title="customer?.name || '顧客詳細'">
        <template #leading>
          <UButton
            icon="i-lucide-arrow-left"
            variant="ghost"
            color="neutral"
            @click="$router.push('/customers')"
          />
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UButton
            v-if="!isEditMode"
            icon="i-lucide-edit"
            label="編集"
            variant="outline"
            @click="isEditMode = true"
          />
          <template v-else>
            <UButton
              label="キャンセル"
              variant="ghost"
              color="neutral"
              @click="isEditMode = false"
            />
            <UButton
              label="保存"
              icon="i-lucide-save"
              :loading="isSaving"
              @click="saveCustomer"
            />
          </template>
          <UButton
            icon="i-lucide-trash"
            color="error"
            variant="ghost"
            @click="isDeleteModalOpen = true"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div v-if="customerStore.loading" class="flex justify-center py-20">
        <UIcon name="i-lucide-loader-circle" class="w-8 h-8 animate-spin text-muted" />
      </div>

      <div v-else-if="customer" class="max-w-4xl mx-auto p-6 space-y-6">
        <!-- ヘッダーカード -->
        <UCard>
          <div class="flex items-start gap-4">
            <UAvatar
              :label="customer.name.charAt(0)"
              size="xl"
              class="bg-primary-100 text-primary-700"
            />
            <div class="flex-1">
              <div v-if="!isEditMode">
                <h1 class="text-2xl font-bold text-highlighted">
                  {{ customer.name }}
                </h1>
                <p v-if="customer.furigana" class="text-sm text-muted mt-1">
                  {{ customer.furigana }}
                </p>
                <div class="flex items-center gap-2 mt-2">
                  <UBadge variant="outline" color="neutral">
                    {{ customer.code }}
                  </UBadge>
                  <UBadge
                    v-for="tag in customer.tags"
                    :key="tag"
                    variant="soft"
                    color="primary"
                    size="sm"
                  >
                    {{ tag }}
                  </UBadge>
                </div>
              </div>
              <div v-else class="space-y-3">
                <UInput v-model="editState.name" placeholder="顧客名" size="lg" />
                <UInput v-model="editState.furigana" placeholder="ふりがな" />
              </div>
            </div>
          </div>
        </UCard>

        <!-- タブ -->
        <UTabs v-model="activeTab" :items="tabs">
          <template #content="{ item }">
            <!-- 概要 -->
            <UCard v-if="item.value === 'overview'" class="mt-4">
              <div class="space-y-4">
                <div>
                  <p class="text-sm font-medium text-muted mb-1">
                    顧客ID
                  </p>
                  <p class="text-sm">{{ customer.id }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-muted mb-1">
                    顧客コード
                  </p>
                  <p class="text-sm">{{ customer.code }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-muted mb-1">
                    登録日
                  </p>
                  <p class="text-sm">{{ new Date(customer.createdAt).toLocaleDateString('ja-JP') }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-muted mb-1">
                    最終更新日
                  </p>
                  <p class="text-sm">{{ new Date(customer.updatedAt).toLocaleDateString('ja-JP') }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-muted mb-1">
                    備考
                  </p>
                  <div v-if="!isEditMode">
                    <p class="text-sm">{{ customer.notes || '備考なし' }}</p>
                  </div>
                  <UTextarea v-else v-model="editState.notes" :rows="3" class="w-full" />
                </div>
              </div>
            </UCard>

            <!-- 連絡先 -->
            <div v-else-if="item.value === 'contacts'" class="mt-4 space-y-3">
              <UCard
                v-for="contact in customer.contacts"
                :key="contact.id"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <UBadge :color="contactTypeColor(contact.type)" size="sm">
                      {{ contactTypeLabel(contact.type) }}
                    </UBadge>
                    <div>
                      <p class="font-medium text-sm">{{ contact.value }}</p>
                      <p v-if="contact.name" class="text-xs text-muted">{{ contact.name }}</p>
                    </div>
                  </div>
                  <UBadge v-if="contact.isPrimary" variant="soft" color="success" size="xs">
                    メイン
                  </UBadge>
                </div>
              </UCard>

              <div v-if="!customer.contacts.length" class="text-center py-8 text-muted">
                <UIcon name="i-lucide-phone-off" class="w-8 h-8 mx-auto mb-2" />
                <p class="text-sm">連絡先が登録されていません</p>
              </div>
            </div>

            <!-- 提案履歴 -->
            <UCard v-else-if="item.value === 'proposals'" class="mt-4">
              <div class="text-center py-8 text-muted">
                <UIcon name="i-lucide-file-text" class="w-8 h-8 mx-auto mb-2" />
                <p class="text-sm">提案履歴は提案管理から確認できます</p>
                <UButton
                  label="提案管理へ"
                  variant="ghost"
                  class="mt-2"
                  @click="$router.push('/proposals')"
                />
              </div>
            </UCard>
          </template>
        </UTabs>
      </div>

      <div v-else class="flex flex-col items-center justify-center py-20">
        <UIcon name="i-lucide-user-x" class="w-12 h-12 text-muted mb-4" />
        <p class="text-muted">顧客が見つかりません</p>
        <UButton label="一覧に戻る" variant="ghost" class="mt-2" @click="$router.push('/customers')" />
      </div>
    </template>
  </UDashboardPanel>

  <!-- 削除確認 -->
  <UModal
    v-model:open="isDeleteModalOpen"
    title="顧客を削除"
    description="この操作は取り消せません。本当に削除しますか？"
  >
    <template #body>
      <p class="text-sm text-muted mb-4">
        <strong>{{ customer?.name }}</strong> を削除します。
      </p>
      <div class="flex justify-end gap-2">
        <UButton label="キャンセル" color="neutral" variant="subtle" @click="isDeleteModalOpen = false" />
        <UButton label="削除する" color="error" @click="deleteCustomer" />
      </div>
    </template>
  </UModal>
</template>
