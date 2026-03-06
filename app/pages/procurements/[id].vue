<script setup lang="ts">
import { useProcurementStore } from '~/stores/procurements'
import type { Procurement, ProcurementItem } from '~/types'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const procStore = useProcurementStore()

const isNew = computed(() => route.params.id === 'new')
const isEditMode = ref(isNew.value)
const isSaving = ref(false)
const isDeleting = ref(false)
const showDeleteConfirm = ref(false)

const statusOptions = [
  { label: '下書き', value: 'draft' },
  { label: '見積依頼済み', value: 'rfq_sent' },
  { label: '見積済み', value: 'quoted' },
  { label: '発注済み', value: 'ordered' },
  { label: '受領済み', value: 'received' },
  { label: '完了', value: 'completed' },
  { label: 'キャンセル', value: 'cancelled' }
]

const channelOptions = [
  { label: 'メール', value: 'email' },
  { label: 'FAX', value: 'fax' },
  { label: '電話', value: 'phone' },
  { label: '手動', value: 'manual' }
]

const form = ref<Partial<Procurement>>({
  proposalId: '',
  proposalCode: '',
  items: [],
  status: 'draft',
  rfqChannel: 'email',
  expectedDeliveryDate: '',
  notes: ''
})

function addItem() {
  form.value.items = form.value.items || []
  form.value.items.push({
    id: `pi_${Date.now()}`,
    manufacturerId: '',
    manufacturerName: '',
    productName: '',
    quantity: 0,
    unit: '個',
    deliveryDate: ''
  } as ProcurementItem)
}

function removeItem(index: number) {
  form.value.items?.splice(index, 1)
}

const totalQuoted = computed(() =>
  form.value.items?.reduce((sum, i) => sum + (i.quotedUnitPrice || 0) * (i.quantity || 0), 0) ?? 0
)

async function loadData() {
  if (isNew.value) return
  try {
    const data = await procStore.getProcurementById(route.params.id as string)
    if (data) form.value = { ...data }
  } catch {
    toast.add({ title: '仕入れデータの読み込みに失敗しました', color: 'error' })
    router.push('/procurements')
  }
}

async function save() {
  isSaving.value = true
  try {
    if (isNew.value) {
      await procStore.createProcurement(form.value as any)
      toast.add({ title: '仕入れデータを登録しました', color: 'success' })
      router.push('/procurements')
    } else {
      await procStore.updateProcurement(route.params.id as string, form.value)
      toast.add({ title: '仕入れデータを更新しました', color: 'success' })
      isEditMode.value = false
    }
  } catch {
    toast.add({ title: '保存に失敗しました', color: 'error' })
  } finally {
    isSaving.value = false
  }
}

async function deleteProcurement() {
  isDeleting.value = true
  try {
    await procStore.deleteProcurement(route.params.id as string)
    toast.add({ title: '仕入れデータを削除しました', color: 'success' })
    router.push('/procurements')
  } catch {
    toast.add({ title: '削除に失敗しました', color: 'error' })
  } finally {
    isDeleting.value = false
    showDeleteConfirm.value = false
  }
}

onMounted(loadData)
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar>
        <template #leading>
          <UButton icon="i-lucide-arrow-left" color="neutral" variant="ghost" @click="router.push('/procurements')" />
        </template>
        <template #title>
          <span v-if="isNew">新規仕入れ登録</span>
          <span v-else>仕入れ詳細</span>
        </template>
        <template #right>
          <div class="flex items-center gap-2">
            <template v-if="isEditMode">
              <UButton icon="i-lucide-x" label="キャンセル" color="neutral" variant="ghost" :disabled="isNew" @click="isEditMode = false" />
              <UButton icon="i-lucide-save" label="保存する" :loading="isSaving" @click="save" />
            </template>
            <template v-else>
              <UButton icon="i-lucide-pencil" label="編集" color="neutral" variant="outline" @click="isEditMode = true" />
              <UButton icon="i-lucide-trash-2" label="削除" color="error" variant="outline" @click="showDeleteConfirm = true" />
            </template>
          </div>
        </template>
      </UDashboardNavbar>
    </template>

    <div class="p-4 space-y-4">
      <!-- Basic Info -->
      <UCard>
        <template #header><h3 class="font-semibold text-sm">基本情報</h3></template>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <UFormField label="仕入れコード">
            <UInput :model-value="form.code || '(自動採番)'" readonly disabled />
          </UFormField>
          <UFormField label="ステータス">
            <USelect v-model="form.status" :options="statusOptions" value-key="value" label-key="label" :disabled="!isEditMode" />
          </UFormField>
          <UFormField label="依頼方法">
            <USelect v-model="form.rfqChannel" :options="channelOptions" value-key="value" label-key="label" :disabled="!isEditMode" />
          </UFormField>
          <UFormField label="関連提案No">
            <UInput v-model="form.proposalCode" placeholder="P2026-XXX" :disabled="!isEditMode" />
          </UFormField>
          <UFormField label="見積依頼日">
            <UInput v-model="form.rfqSentDate" type="date" :disabled="!isEditMode" />
          </UFormField>
          <UFormField label="見積受領日">
            <UInput v-model="form.quotationReceivedDate" type="date" :disabled="!isEditMode" />
          </UFormField>
          <UFormField label="発注日">
            <UInput v-model="form.orderDate" type="date" :disabled="!isEditMode" />
          </UFormField>
          <UFormField label="納入予定日">
            <UInput v-model="form.expectedDeliveryDate" type="date" :disabled="!isEditMode" />
          </UFormField>
          <UFormField label="実際の納入日">
            <UInput v-model="form.actualDeliveryDate" type="date" :disabled="!isEditMode" />
          </UFormField>
          <UFormField label="備考" class="col-span-3">
            <UTextarea v-model="form.notes" placeholder="備考を入力..." :rows="2" :disabled="!isEditMode" />
          </UFormField>
        </div>
      </UCard>

      <!-- Items -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold text-sm">仕入れ品目</h3>
            <UButton v-if="isEditMode" icon="i-lucide-plus" label="品目追加" size="sm" variant="outline" @click="addItem" />
          </div>
        </template>
        <div class="overflow-x-auto">
          <table class="w-full text-sm border-collapse">
            <thead>
              <tr class="bg-muted text-muted-foreground">
                <th class="border px-2 py-1 font-medium">行</th>
                <th class="border px-2 py-1 font-medium">メーカー名</th>
                <th class="border px-2 py-1 font-medium">品名</th>
                <th class="border px-2 py-1 font-medium text-right">数量</th>
                <th class="border px-2 py-1 font-medium">単位</th>
                <th class="border px-2 py-1 font-medium text-right">依頼単価</th>
                <th class="border px-2 py-1 font-medium text-right">見積単価</th>
                <th class="border px-2 py-1 font-medium text-right">確定単価</th>
                <th class="border px-2 py-1 font-medium">納期</th>
                <th class="border px-2 py-1 font-medium">備考</th>
                <th v-if="isEditMode" class="border px-2 py-1 w-8" />
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in form.items" :key="item.id" class="hover:bg-muted/50">
                <td class="border px-2 py-1 text-center text-muted-foreground">{{ idx + 1 }}</td>
                <td class="border px-1 py-0.5">
                  <input v-model="item.manufacturerName" class="w-full bg-transparent border-0 px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary rounded text-sm" :disabled="!isEditMode" placeholder="メーカー名...">
                </td>
                <td class="border px-1 py-0.5">
                  <input v-model="item.productName" class="w-full bg-transparent border-0 px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary rounded text-sm" :disabled="!isEditMode" placeholder="品名...">
                </td>
                <td class="border px-1 py-0.5">
                  <input v-model.number="item.quantity" type="number" class="w-16 text-right bg-transparent border-0 px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary rounded" :disabled="!isEditMode" min="0">
                </td>
                <td class="border px-1 py-0.5">
                  <input v-model="item.unit" class="w-12 bg-transparent border-0 px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary rounded text-sm" :disabled="!isEditMode" placeholder="個">
                </td>
                <td class="border px-1 py-0.5">
                  <input v-model.number="item.requestedUnitPrice" type="number" class="w-24 text-right bg-transparent border-0 px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary rounded" :disabled="!isEditMode" min="0">
                </td>
                <td class="border px-1 py-0.5">
                  <input v-model.number="item.quotedUnitPrice" type="number" class="w-24 text-right bg-yellow-50 dark:bg-yellow-950 border-0 px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary rounded" :disabled="!isEditMode" min="0">
                </td>
                <td class="border px-1 py-0.5">
                  <input v-model.number="item.finalUnitPrice" type="number" class="w-24 text-right bg-green-50 dark:bg-green-950 border-0 px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary rounded" :disabled="!isEditMode" min="0">
                </td>
                <td class="border px-1 py-0.5">
                  <input v-model="item.deliveryDate" type="date" class="w-full bg-transparent border-0 px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary rounded text-sm" :disabled="!isEditMode">
                </td>
                <td class="border px-1 py-0.5">
                  <input v-model="item.notes" class="w-full bg-transparent border-0 px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary rounded text-sm" :disabled="!isEditMode" placeholder="備考...">
                </td>
                <td v-if="isEditMode" class="border px-1 py-0.5 text-center">
                  <UButton icon="i-lucide-trash-2" size="xs" color="error" variant="ghost" @click="removeItem(idx)" />
                </td>
              </tr>
              <tr v-if="!form.items?.length">
                <td :colspan="isEditMode ? 11 : 10" class="border px-4 py-6 text-center text-muted-foreground">
                  品目がありません。「品目追加」ボタンで品目を追加してください。
                </td>
              </tr>
            </tbody>
            <tfoot v-if="form.items?.length">
              <tr class="bg-muted font-semibold">
                <td colspan="6" class="border px-2 py-1 text-right">見積合計:</td>
                <td class="border px-2 py-1 text-right tabular-nums" colspan="4">
                  ¥{{ totalQuoted.toLocaleString('ja-JP') }}
                </td>
                <td v-if="isEditMode" class="border" />
              </tr>
            </tfoot>
          </table>
        </div>
      </UCard>
    </div>

    <UModal v-model:open="showDeleteConfirm" title="仕入れデータの削除" description="このデータを削除しますか？この操作は元に戻せません。">
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton label="キャンセル" color="neutral" variant="outline" @click="showDeleteConfirm = false" />
          <UButton label="削除する" color="error" :loading="isDeleting" @click="deleteProcurement" />
        </div>
      </template>
    </UModal>
  </UDashboardPanel>
</template>
