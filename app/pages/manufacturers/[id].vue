<script setup lang="ts">
import { useManufacturerStore } from '~/stores/manufacturers'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const mfrStore = useManufacturerStore()

const mfrId = route.params.id as string
const mfr = computed(() => mfrStore.selectedManufacturer)

const isEditMode = ref(false)
const isSaving = ref(false)
const isDeleteModalOpen = ref(false)

const editState = reactive({
  name: '',
  furigana: '',
  contactEmail: '',
  contactPhone: '',
  faxNumber: '',
  notes: ''
})

const preferredContactLabel = computed(() => {
  const labels: Record<string, string> = { email: 'メール', fax: 'FAX', phone: '電話' }
  return labels[mfr.value?.preferredContactMethod || 'email'] || 'メール'
})

onMounted(async () => {
  await mfrStore.getManufacturerById(mfrId)
  if (mfr.value) {
    editState.name = mfr.value.name
    editState.furigana = mfr.value.furigana || ''
    editState.contactEmail = mfr.value.contactEmail || ''
    editState.contactPhone = mfr.value.contactPhone || ''
    editState.faxNumber = mfr.value.faxNumber || ''
    editState.notes = mfr.value.notes || ''
  }
})

async function saveMfr() {
  isSaving.value = true
  try {
    await mfrStore.updateManufacturer(mfrId, {
      name: editState.name,
      furigana: editState.furigana,
      contactEmail: editState.contactEmail || undefined,
      contactPhone: editState.contactPhone || undefined,
      faxNumber: editState.faxNumber || undefined,
      notes: editState.notes
    })
    isEditMode.value = false
    toast.add({ title: 'メーカー情報を更新しました', color: 'success' })
  } catch {
    toast.add({ title: '更新に失敗しました', color: 'error' })
  } finally {
    isSaving.value = false
  }
}

async function deleteMfr() {
  try {
    await mfrStore.deleteManufacturer(mfrId)
    toast.add({ title: 'メーカーを削除しました', color: 'success' })
    router.push('/manufacturers')
  } catch {
    toast.add({ title: '削除に失敗しました', color: 'error' })
  }
}
</script>

<template>
  <UDashboardPanel id="manufacturer-detail">
    <template #header>
      <UDashboardNavbar :title="mfr?.name || 'メーカー詳細'">
        <template #leading>
          <UButton icon="i-lucide-arrow-left" variant="ghost" color="neutral" @click="$router.push('/manufacturers')" />
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <UButton v-if="!isEditMode" icon="i-lucide-edit" label="編集" variant="outline" @click="isEditMode = true" />
          <template v-else>
            <UButton label="キャンセル" variant="ghost" color="neutral" @click="isEditMode = false" />
            <UButton label="保存" icon="i-lucide-save" :loading="isSaving" @click="saveMfr" />
          </template>
          <UButton icon="i-lucide-trash" color="error" variant="ghost" @click="isDeleteModalOpen = true" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div v-if="mfrStore.loading" class="flex justify-center py-20">
        <UIcon name="i-lucide-loader-circle" class="w-8 h-8 animate-spin text-muted" />
      </div>

      <div v-else-if="mfr" class="max-w-3xl mx-auto p-6 space-y-6">
        <UCard>
          <div class="space-y-4">
            <div class="flex items-start justify-between">
              <div v-if="!isEditMode">
                <h1 class="text-2xl font-bold text-highlighted">{{ mfr.name }}</h1>
                <p v-if="mfr.furigana" class="text-sm text-muted mt-1">{{ mfr.furigana }}</p>
                <div class="flex gap-2 mt-2">
                  <UBadge variant="outline" color="neutral">{{ mfr.code }}</UBadge>
                  <UBadge v-for="tag in mfr.tags" :key="tag" variant="soft" color="primary" size="sm">{{ tag }}</UBadge>
                </div>
              </div>
              <div v-else class="w-full space-y-2">
                <UInput v-model="editState.name" placeholder="メーカー名" size="lg" class="w-full" />
                <UInput v-model="editState.furigana" placeholder="ふりがな" class="w-full" />
              </div>
            </div>
          </div>
        </UCard>

        <UCard title="連絡先情報">
          <div class="space-y-3">
            <div v-if="!isEditMode" class="space-y-3">
              <div class="flex items-center gap-3">
                <UIcon name="i-lucide-mail" class="w-4 h-4 text-muted" />
                <span class="text-sm">{{ mfr.contactEmail || '未登録' }}</span>
              </div>
              <div class="flex items-center gap-3">
                <UIcon name="i-lucide-phone" class="w-4 h-4 text-muted" />
                <span class="text-sm">{{ mfr.contactPhone || '未登録' }}</span>
              </div>
              <div class="flex items-center gap-3">
                <UIcon name="i-lucide-printer" class="w-4 h-4 text-muted" />
                <span class="text-sm">{{ mfr.faxNumber || '未登録' }}</span>
              </div>
              <div class="flex items-center gap-3">
                <UIcon name="i-lucide-star" class="w-4 h-4 text-muted" />
                <span class="text-sm">優先: {{ preferredContactLabel }}</span>
              </div>
            </div>
            <div v-else class="space-y-2">
              <UInput v-model="editState.contactEmail" placeholder="メールアドレス" class="w-full" />
              <UInput v-model="editState.contactPhone" placeholder="電話番号" class="w-full" />
              <UInput v-model="editState.faxNumber" placeholder="FAX番号" class="w-full" />
            </div>
          </div>
        </UCard>

        <UCard title="商品カテゴリ">
          <div class="flex flex-wrap gap-1">
            <UBadge v-for="cat in mfr.productCategories" :key="cat" variant="soft" color="success">{{ cat }}</UBadge>
            <span v-if="!mfr.productCategories.length" class="text-sm text-muted">未設定</span>
          </div>
        </UCard>

        <UCard title="備考">
          <div v-if="!isEditMode">
            <p class="text-sm text-muted">{{ mfr.notes || '備考なし' }}</p>
          </div>
          <UTextarea v-else v-model="editState.notes" :rows="3" class="w-full" />
        </UCard>
      </div>

      <div v-else class="flex flex-col items-center justify-center py-20">
        <UIcon name="i-lucide-building-x" class="w-12 h-12 text-muted mb-4" />
        <p class="text-muted">メーカーが見つかりません</p>
        <UButton label="一覧に戻る" variant="ghost" class="mt-2" @click="$router.push('/manufacturers')" />
      </div>
    </template>
  </UDashboardPanel>

  <UModal v-model:open="isDeleteModalOpen" title="メーカーを削除" description="この操作は取り消せません。">
    <template #body>
      <p class="text-sm text-muted mb-4"><strong>{{ mfr?.name }}</strong> を削除します。</p>
      <div class="flex justify-end gap-2">
        <UButton label="キャンセル" color="neutral" variant="subtle" @click="isDeleteModalOpen = false" />
        <UButton label="削除する" color="error" @click="deleteMfr" />
      </div>
    </template>
  </UModal>
</template>
