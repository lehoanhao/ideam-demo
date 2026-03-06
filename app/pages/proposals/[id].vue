<script setup lang="ts">
import { useProposalStore } from '~/stores/proposals'
import type { Proposal, ProposalLineItem } from '~/types'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const proposalStore = useProposalStore()

const isNew = computed(() => route.params.id === 'new')
const isEditMode = ref(isNew.value)
const isSaving = ref(false)
const isDeleting = ref(false)
const showDeleteConfirm = ref(false)

// Form data
const form = ref<Partial<Proposal>>({
  customerId: '',
  customerName: '',
  title: '',
  description: '',
  status: 'draft',
  lineItems: [],
  totalAmount: 0,
  budget: 0,
  deadline: '',
  requiredDeliveryDate: '',
  assignedTo: '',
  tags: [],
  approvalStatus: 'pending'
})

// Extended fields per screen spec
const extFields = ref({
  processType: '1',
  ownerUser: '',
  proposalDate: '',
  decisionDate: '',
  listUpPosted: false,
  rApprovalStatus: '未承認',
  rRequiresApproval: false,
  pApprovalStatus: '未承認',
  pRequiresApproval: false,
  budgetNote: '',
  department: '',
  categoryLv1: '',
  purpose: '',
  properName: '',
  rival1: '',
  rival2: '',
  rival3: '',
  rival4: '',
  rivalNote: '',
  remarks: '',
  lineAddDate: '',
  lineAddNote: '',
  changeDate: '',
  changeNote: ''
})

// Options
const processTypeOptions = [
  { label: '1: 登録', value: '1' },
  { label: '2: 修正', value: '2' },
  { label: '3: 業務', value: '3' }
]

const approvalStatusOptions = [
  { label: '未承認', value: '未承認' },
  { label: '承認済', value: '承認済' },
  { label: '否認', value: '否認' }
]

const departmentOptions = [
  { label: 'A: 総務', value: 'A' },
  { label: 'B: 営業', value: 'B' },
  { label: 'C: 企画', value: 'C' },
  { label: 'D: 管理', value: 'D' }
]

const categoryOptions = [
  { label: 'A01: 総代会', value: 'A01' },
  { label: 'A02: 周年記念', value: 'A02' },
  { label: 'B01: キャンペーン', value: 'B01' },
  { label: 'C01: 展示会', value: 'C01' }
]

const purposeOptions = [
  { label: 'A0103: 総代会組合員記念', value: 'A0103' },
  { label: 'A0201: 周年記念品', value: 'A0201' },
  { label: 'B0101: 販促キャンペーン', value: 'B0101' }
]

const itemGroupOptions = [
  { label: '01: 食品', value: '01' },
  { label: '02: 菓子', value: '02' },
  { label: '03: 酒類', value: '03' },
  { label: '04: 日用品', value: '04' },
  { label: '05: 文具・事務用品', value: '05' },
  { label: '06: 電化製品', value: '06' },
  { label: '07: 衣料品', value: '07' },
  { label: '08: 雑貨', value: '08' },
  { label: '09: 工芸品', value: '09' },
  { label: '99: その他', value: '99' }
]

const statusOptions = [
  { label: '下書き', value: 'draft' },
  { label: '提出済み', value: 'submitted' },
  { label: '見積済み', value: 'quoted' },
  { label: '承認済み', value: 'approved' },
  { label: '却下', value: 'rejected' },
  { label: '完了', value: 'completed' }
]

// Budget calculation
const budgetTotal = computed(() => {
  return form.value.lineItems?.reduce((sum, item) => {
    return sum + (item.quantity || 0) * (item.unitPrice || 0)
  }, 0) ?? 0
})

// Line items management
function addLineItem() {
  form.value.lineItems = form.value.lineItems || []
  form.value.lineItems.push({
    id: `li_${Date.now()}`,
    manufacturerId: '',
    manufacturerName: '',
    productName: '',
    productCode: '',
    quantity: 0,
    unit: '個',
    unitPrice: 0,
    total: 0,
    deliveryDate: '',
    notes: ''
  } as ProposalLineItem)
}

function removeLineItem(index: number) {
  form.value.lineItems?.splice(index, 1)
}

function updateLineItemTotal(item: ProposalLineItem) {
  item.total = (item.quantity || 0) * (item.unitPrice || 0)
  form.value.totalAmount = budgetTotal.value
}

// Load existing proposal
async function loadProposal() {
  if (isNew.value) return
  try {
    const data = await proposalStore.getProposalById(route.params.id as string)
    if (data) {
      form.value = { ...data }
    }
  } catch {
    toast.add({ title: '提案の読み込みに失敗しました', color: 'error' })
    router.push('/proposals')
  }
}

async function save() {
  isSaving.value = true
  try {
    form.value.totalAmount = budgetTotal.value
    if (isNew.value) {
      await proposalStore.createProposal(form.value as Omit<Proposal, 'id' | 'code' | 'createdAt' | 'updatedAt'>)
      toast.add({ title: '提案を登録しました', color: 'success' })
      router.push('/proposals')
    } else {
      await proposalStore.updateProposal(route.params.id as string, form.value)
      toast.add({ title: '提案を更新しました', color: 'success' })
      isEditMode.value = false
    }
  } catch {
    toast.add({ title: '保存に失敗しました', color: 'error' })
  } finally {
    isSaving.value = false
  }
}

async function deleteProposal() {
  isDeleting.value = true
  try {
    await proposalStore.deleteProposal(route.params.id as string)
    toast.add({ title: '提案を削除しました', color: 'success' })
    router.push('/proposals')
  } catch {
    toast.add({ title: '削除に失敗しました', color: 'error' })
  } finally {
    isDeleting.value = false
    showDeleteConfirm.value = false
  }
}

onMounted(loadProposal)
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar>
        <template #leading>
          <UButton
            icon="i-lucide-arrow-left"
            color="neutral"
            variant="ghost"
            @click="router.push('/proposals')"
          />
        </template>
        <template #title>
          <span v-if="isNew">新規提案登録</span>
          <span v-else>提案入力</span>
        </template>
        <template #right>
          <div class="flex items-center gap-2">
            <template v-if="isEditMode">
              <UButton
                icon="i-lucide-x"
                label="キャンセル"
                color="neutral"
                variant="ghost"
                :disabled="isNew"
                @click="isEditMode = false"
              />
              <UButton
                icon="i-lucide-save"
                label="保存する"
                :loading="isSaving"
                @click="save"
              />
            </template>
            <template v-else>
              <UButton
                icon="i-lucide-pencil"
                label="編集"
                color="neutral"
                variant="outline"
                @click="isEditMode = true"
              />
              <UButton
                icon="i-lucide-trash-2"
                label="削除"
                color="error"
                variant="outline"
                @click="showDeleteConfirm = true"
              />
            </template>
          </div>
        </template>
      </UDashboardNavbar>
    </template>

    <div class="p-4 space-y-4">
      <!-- A. Header / Top control row -->
      <UCard>
        <template #header>
          <h3 class="font-semibold text-sm">基本情報</h3>
        </template>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <UFormField label="処理区分">
            <USelect
              v-model="extFields.processType"
              :options="processTypeOptions"
              value-key="value"
              label-key="label"
              :disabled="!isEditMode"
            />
          </UFormField>

          <UFormField label="担当者">
            <UInput
              v-model="extFields.ownerUser"
              placeholder="担当者名"
              :disabled="!isEditMode"
            />
          </UFormField>

          <UFormField label="顧客" class="col-span-2">
            <UInput
              v-model="form.customerName"
              placeholder="顧客名を入力..."
              :disabled="!isEditMode"
            />
          </UFormField>

          <UFormField label="提案No">
            <UInput
              :model-value="form.code || '(自動採番)'"
              readonly
              disabled
            />
          </UFormField>

          <UFormField label="ステータス">
            <USelect
              v-model="form.status"
              :options="statusOptions"
              value-key="value"
              label-key="label"
              :disabled="!isEditMode"
            />
          </UFormField>

          <UFormField label="提案件名" class="col-span-2">
            <UInput
              v-model="form.title"
              placeholder="提案件名を入力..."
              :disabled="!isEditMode"
            />
          </UFormField>

          <UFormField label="作成日">
            <UInput
              :model-value="form.createdAt ? new Date(form.createdAt).toLocaleDateString('ja-JP') : ''"
              readonly
              disabled
            />
          </UFormField>

          <UFormField label="最終更新日">
            <UInput
              :model-value="form.updatedAt ? new Date(form.updatedAt).toLocaleDateString('ja-JP') : ''"
              readonly
              disabled
            />
          </UFormField>

          <UFormField label="提案日">
            <UInput
              v-model="extFields.proposalDate"
              type="date"
              :disabled="!isEditMode"
            />
          </UFormField>

          <UFormField label="決定日">
            <UInput
              v-model="extFields.decisionDate"
              type="date"
              :disabled="!isEditMode"
            />
          </UFormField>

          <UFormField label="締切日">
            <UInput
              v-model="form.deadline"
              type="date"
              :disabled="!isEditMode"
            />
          </UFormField>

          <UFormField label="納入日">
            <UInput
              v-model="form.requiredDeliveryDate"
              type="date"
              :disabled="!isEditMode"
            />
          </UFormField>

          <UFormField label="">
            <UCheckbox
              v-model="extFields.listUpPosted"
              label="リストアップ計上"
              :disabled="!isEditMode"
            />
          </UFormField>
        </div>
      </UCard>

      <!-- B. Approval + Budget block -->
      <UCard>
        <template #header>
          <h3 class="font-semibold text-sm">承認・予算</h3>
        </template>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <UFormField label="R承認">
            <USelect
              v-model="extFields.rApprovalStatus"
              :options="approvalStatusOptions"
              value-key="value"
              label-key="label"
              :disabled="!isEditMode"
            />
          </UFormField>
          <UFormField label="">
            <UCheckbox
              v-model="extFields.rRequiresApproval"
              label="要承認"
              :disabled="!isEditMode"
            />
          </UFormField>

          <UFormField label="P承認">
            <USelect
              v-model="extFields.pApprovalStatus"
              :options="approvalStatusOptions"
              value-key="value"
              label-key="label"
              :disabled="!isEditMode"
            />
          </UFormField>
          <UFormField label="">
            <UCheckbox
              v-model="extFields.pRequiresApproval"
              label="要承認"
              :disabled="!isEditMode"
            />
          </UFormField>

          <UFormField label="予算合計">
            <div class="flex items-center h-9 px-3 border rounded-md bg-muted font-semibold tabular-nums">
              ¥{{ budgetTotal.toLocaleString('ja-JP') }}
            </div>
          </UFormField>

          <UFormField label="予算備考" class="col-span-3">
            <UInput
              v-model="extFields.budgetNote"
              placeholder="例: 4000個×1000円"
              :disabled="!isEditMode"
            />
          </UFormField>
        </div>
      </UCard>

      <!-- C. Classification block -->
      <UCard>
        <template #header>
          <h3 class="font-semibold text-sm">分類</h3>
        </template>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <UFormField label="部門">
            <USelect
              v-model="extFields.department"
              :options="departmentOptions"
              value-key="value"
              label-key="label"
              :disabled="!isEditMode"
              placeholder="選択..."
            />
          </UFormField>

          <UFormField label="大分類">
            <USelect
              v-model="extFields.categoryLv1"
              :options="categoryOptions"
              value-key="value"
              label-key="label"
              :disabled="!isEditMode"
              placeholder="選択..."
            />
          </UFormField>

          <UFormField label="目的">
            <USelect
              v-model="extFields.purpose"
              :options="purposeOptions"
              value-key="value"
              label-key="label"
              :disabled="!isEditMode"
              placeholder="選択..."
            />
          </UFormField>

          <UFormField label="固有名">
            <UInput
              v-model="extFields.properName"
              placeholder="固有名称を入力..."
              :disabled="!isEditMode"
            />
          </UFormField>
        </div>
      </UCard>

      <!-- D. Rival block -->
      <UCard>
        <template #header>
          <h3 class="font-semibold text-sm">ライバル情報</h3>
        </template>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <UFormField label="ライバル 1">
            <UInput
              v-model="extFields.rival1"
              placeholder="競合他社 1"
              :disabled="!isEditMode"
            />
          </UFormField>
          <UFormField label="ライバル 2">
            <UInput
              v-model="extFields.rival2"
              placeholder="競合他社 2"
              :disabled="!isEditMode"
            />
          </UFormField>
          <UFormField label="ライバル 3">
            <UInput
              v-model="extFields.rival3"
              placeholder="競合他社 3"
              :disabled="!isEditMode"
            />
          </UFormField>
          <UFormField label="ライバル 4">
            <UInput
              v-model="extFields.rival4"
              placeholder="競合他社 4"
              :disabled="!isEditMode"
            />
          </UFormField>
          <UFormField label="ライバル備考" class="col-span-2 md:col-span-4">
            <UInput
              v-model="extFields.rivalNote"
              placeholder="ライバル備考を入力..."
              :disabled="!isEditMode"
            />
          </UFormField>
        </div>
      </UCard>

      <!-- E. Notes + change log -->
      <UCard>
        <template #header>
          <h3 class="font-semibold text-sm">備考・変更履歴</h3>
        </template>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UFormField label="備考" class="md:row-span-2">
            <UTextarea
              v-model="extFields.remarks"
              placeholder="備考を入力..."
              :rows="4"
              :disabled="!isEditMode"
            />
          </UFormField>
          <div class="grid grid-cols-2 gap-2">
            <UFormField label="行追加日">
              <UInput
                v-model="extFields.lineAddDate"
                type="date"
                :disabled="!isEditMode"
              />
            </UFormField>
            <UFormField label="行追加メモ">
              <UInput
                v-model="extFields.lineAddNote"
                placeholder="メモ..."
                :disabled="!isEditMode"
              />
            </UFormField>
            <UFormField label="変更日">
              <UInput
                v-model="extFields.changeDate"
                type="date"
                :disabled="!isEditMode"
              />
            </UFormField>
            <UFormField label="変更メモ">
              <UInput
                v-model="extFields.changeNote"
                placeholder="メモ..."
                :disabled="!isEditMode"
              />
            </UFormField>
          </div>
        </div>
      </UCard>

      <!-- G. Main line-item grid -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold text-sm">明細行</h3>
            <UButton
              v-if="isEditMode"
              icon="i-lucide-plus"
              label="行追加"
              size="sm"
              variant="outline"
              @click="addLineItem"
            />
          </div>
        </template>

        <div class="overflow-x-auto">
          <table class="w-full text-sm border-collapse">
            <thead>
              <tr class="bg-muted text-muted-foreground">
                <th class="border px-2 py-1 text-center font-medium w-10">行</th>
                <th class="border px-2 py-1 text-center font-medium w-8">選択</th>
                <th class="border px-2 py-1 text-right font-medium w-16">予算数</th>
                <th class="border px-2 py-1 text-right font-medium w-24">予算単価</th>
                <th class="border px-2 py-1 text-left font-medium w-24">品群</th>
                <th class="border px-2 py-1 text-left font-medium w-28">カタログ名</th>
                <th class="border px-2 py-1 text-left font-medium w-24">品番</th>
                <th class="border px-2 py-1 text-left font-medium w-36">メーカー名</th>
                <th class="border px-2 py-1 text-left font-medium w-48">品名</th>
                <th class="border px-2 py-1 text-left font-medium w-28">単位</th>
                <th class="border px-2 py-1 text-right font-medium w-24">売上単価</th>
                <th class="border px-2 py-1 text-right font-medium w-24">原価</th>
                <th class="border px-2 py-1 text-right font-medium w-24">合計</th>
                <th class="border px-2 py-1 text-left font-medium w-28">納期</th>
                <th class="border px-2 py-1 text-left font-medium w-36">備考</th>
                <th v-if="isEditMode" class="border px-2 py-1 w-8" />
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in form.lineItems"
                :key="item.id"
                class="hover:bg-muted/50"
              >
                <td class="border px-2 py-1 text-center text-muted-foreground">{{ index + 1 }}</td>
                <td class="border px-2 py-1 text-center">
                  <UCheckbox :disabled="!isEditMode" />
                </td>
                <td class="border px-1 py-0.5">
                  <input
                    v-model.number="item.quantity"
                    type="number"
                    class="w-full text-right bg-green-50 dark:bg-green-950 border-0 px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary rounded"
                    :disabled="!isEditMode"
                    min="0"
                    @change="updateLineItemTotal(item)"
                  >
                </td>
                <td class="border px-1 py-0.5">
                  <input
                    v-model.number="item.unitPrice"
                    type="number"
                    class="w-full text-right bg-green-50 dark:bg-green-950 border-0 px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary rounded"
                    :disabled="!isEditMode"
                    min="0"
                    @change="updateLineItemTotal(item)"
                  >
                </td>
                <td class="border px-1 py-0.5">
                  <select
                    class="w-full bg-transparent border-0 px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary rounded text-sm"
                    :disabled="!isEditMode"
                  >
                    <option value="">選択...</option>
                    <option v-for="opt in itemGroupOptions" :key="opt.value" :value="opt.value">
                      {{ opt.label }}
                    </option>
                  </select>
                </td>
                <td class="border px-1 py-0.5">
                  <input
                    v-model="item.productCode"
                    type="text"
                    class="w-full bg-transparent border-0 px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary rounded text-sm"
                    :disabled="!isEditMode"
                    placeholder="カタログ名..."
                  >
                </td>
                <td class="border px-1 py-0.5">
                  <input
                    v-model="item.productCode"
                    type="text"
                    class="w-full bg-transparent border-0 px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary rounded text-sm"
                    :disabled="!isEditMode"
                    placeholder="品番..."
                  >
                </td>
                <td class="border px-1 py-0.5">
                  <input
                    v-model="item.manufacturerName"
                    type="text"
                    class="w-full bg-transparent border-0 px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary rounded text-sm"
                    :disabled="!isEditMode"
                    placeholder="メーカー名..."
                  >
                </td>
                <td class="border px-1 py-0.5">
                  <input
                    v-model="item.productName"
                    type="text"
                    class="w-full bg-transparent border-0 px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary rounded text-sm"
                    :disabled="!isEditMode"
                    placeholder="品名..."
                  >
                </td>
                <td class="border px-1 py-0.5">
                  <input
                    v-model="item.unit"
                    type="text"
                    class="w-full bg-transparent border-0 px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary rounded text-sm"
                    :disabled="!isEditMode"
                    placeholder="個"
                  >
                </td>
                <td class="border px-1 py-0.5">
                  <input
                    v-model.number="item.unitPrice"
                    type="number"
                    class="w-full text-right bg-transparent border-0 px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary rounded"
                    :disabled="!isEditMode"
                    min="0"
                  >
                </td>
                <td class="border px-1 py-0.5">
                  <input
                    type="number"
                    class="w-full text-right bg-transparent border-0 px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary rounded"
                    :disabled="!isEditMode"
                    placeholder="0"
                  >
                </td>
                <td class="border px-2 py-1 text-right tabular-nums font-medium">
                  ¥{{ item.total.toLocaleString('ja-JP') }}
                </td>
                <td class="border px-1 py-0.5">
                  <input
                    v-model="item.deliveryDate"
                    type="date"
                    class="w-full bg-transparent border-0 px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary rounded text-sm"
                    :disabled="!isEditMode"
                  >
                </td>
                <td class="border px-1 py-0.5">
                  <input
                    v-model="item.notes"
                    type="text"
                    class="w-full bg-transparent border-0 px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary rounded text-sm"
                    :disabled="!isEditMode"
                    placeholder="備考..."
                  >
                </td>
                <td v-if="isEditMode" class="border px-1 py-0.5 text-center">
                  <UButton
                    icon="i-lucide-trash-2"
                    size="xs"
                    color="error"
                    variant="ghost"
                    @click="removeLineItem(index)"
                  />
                </td>
              </tr>
              <tr v-if="!form.lineItems?.length">
                <td :colspan="isEditMode ? 16 : 15" class="border px-4 py-6 text-center text-muted-foreground">
                  明細行がありません。「行追加」ボタンで行を追加してください。
                </td>
              </tr>
            </tbody>
            <tfoot v-if="form.lineItems?.length">
              <tr class="bg-muted font-semibold">
                <td colspan="12" class="border px-2 py-1 text-right">合計金額:</td>
                <td class="border px-2 py-1 text-right tabular-nums">
                  ¥{{ budgetTotal.toLocaleString('ja-JP') }}
                </td>
                <td class="border" colspan="2" />
                <td v-if="isEditMode" class="border" />
              </tr>
            </tfoot>
          </table>
        </div>
      </UCard>
    </div>

    <!-- Delete confirmation modal -->
    <UModal v-model:open="showDeleteConfirm" title="提案の削除" description="この提案を削除しますか？この操作は元に戻せません。">
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            label="キャンセル"
            color="neutral"
            variant="outline"
            @click="showDeleteConfirm = false"
          />
          <UButton
            label="削除する"
            color="error"
            :loading="isDeleting"
            @click="deleteProposal"
          />
        </div>
      </template>
    </UModal>
  </UDashboardPanel>
</template>
