<script setup lang="ts">
import { useManufacturerStore } from '~/stores/manufacturers'

const props = defineProps<{
  manufacturerNames: string[]
}>()

const open = defineModel<boolean>('open', { default: false })

const manufacturerStore = useManufacturerStore()
const toast = useToast()

// Steps: 'select' -> 'compose' -> 'sending'
const step = ref<'select' | 'compose' | 'sending'>('select')

const sendingStatuses = ref<
  Record<string, 'pending' | 'sending' | 'done' | 'error'>
>({})

const matchedManufacturers = computed(() => {
  const uniqueNames = [...new Set(props.manufacturerNames.filter(Boolean))]
  return uniqueNames.map((name) => {
    const found = manufacturerStore.manufacturers.find(
      (m: { name: string }) => m.name === name
    )
    return {
      name,
      manufacturer: found || null,
      contactMethod: ref<'email' | 'fax'>(
        found?.preferredContactMethod === 'fax' ? 'fax' : 'email'
      )
    }
  })
})

const contactMethodOptions = [
  { label: 'メール', value: 'email' },
  { label: 'FAX', value: 'fax' }
]

// Compose step state
const recipientTags = computed(() =>
  matchedManufacturers.value.map(
    item => `${item.name}（${item.contactMethod.value === 'email' ? 'メール' : 'FAX'}）`
  )
)
const subject = ref('お見積り・製品情報のご依頼')
const templateVariables = [
  { key: '{{メーカー名}}', label: 'メーカー名', description: '送信先のメーカー名に置換' },
  { key: '{{担当者名}}', label: '担当者名', description: 'ログインユーザーの名前に置換' },
  { key: '{{会社名}}', label: '会社名', description: '自社の会社名に置換' },
  { key: '{{日付}}', label: '日付', description: '送信日に置換' }
]

const defaultTemplate = `<p>{{メーカー名}} 御中</p>
<p>いつもお世話になっております。</p>
<p>{{会社名}} 営業部 {{担当者名}} でございます。</p>
<p>この度、下記製品につきまして、お見積りおよび製品情報のご提供をお願いしたく、ご連絡差し上げました。</p>
<p>ご多忙のところ恐れ入りますが、添付の提案書をご確認いただき、下記内容についてご回答いただけますと幸いです。</p>
<p>【ご依頼内容】</p>
<ul>
  <li>対象製品のお見積り（数量・納期を含む）</li>
  <li>製品カタログまたは仕様書のご送付</li>
  <li>納品可能時期のご確認</li>
</ul>
<p>ご不明な点がございましたら、お気軽にお問い合わせください。</p>
<p>何卒よろしくお願い申し上げます。</p>
<p>――――――――――――――――――――</p>
<p>{{会社名}} 営業部</p>
<p>{{担当者名}}</p>
<p>TEL: 03-XXXX-XXXX</p>
<p>Email: tantosha@example.co.jp</p>
<p>――――――――――――――――――――</p>`
const editorContent = ref('')

// Reset state when modal opens
watch(open, (val) => {
  if (val) {
    step.value = 'select'
    subject.value = 'お見積り・製品情報のご依頼'
    editorContent.value = ''
  }
})

function goToCompose() {
  if (!editorContent.value) {
    editorContent.value = defaultTemplate
  }
  step.value = 'compose'
}

function goBackToSelect() {
  step.value = 'select'
}

async function handleSend() {
  step.value = 'sending'
  sendingStatuses.value = {}

  for (const item of matchedManufacturers.value) {
    sendingStatuses.value[item.name] = 'pending'
  }

  for (const item of matchedManufacturers.value) {
    sendingStatuses.value[item.name] = 'sending'
    // Simulate sending
    await new Promise(resolve =>
      setTimeout(resolve, 800 + Math.random() * 700)
    )
    sendingStatuses.value[item.name] = 'done'
  }

  toast.add({ title: 'メーカーへの依頼を送信しました', color: 'success' })

  setTimeout(() => {
    open.value = false
  }, 500)
}
</script>

<template>
  <UModal v-model:open="open" :ui="{ content: step === 'compose' ? 'sm:max-w-4xl' : 'sm:max-w-2xl' }">
    <template #header>
      <div class="flex items-center gap-2 w-full">
        <UIcon name="i-bi-send" class="size-5 text-primary" />
        <h3 class="text-base font-semibold">
          メーカー依頼
        </h3>
        <!-- Step indicator -->
        <div class="flex items-center gap-1.5 ml-auto text-xs text-muted">
          <UBadge
            :color="step === 'select' ? 'primary' : 'neutral'"
            :variant="step === 'select' ? 'solid' : 'subtle'"
            size="md"
            label="1. 送信先"
          />
          <UIcon name="i-lucide-chevron-right" class="size-3" />
          <UBadge
            :color="step === 'compose' ? 'primary' : 'neutral'"
            :variant="step === 'compose' ? 'solid' : 'subtle'"
            size="md"
            label="2. 依頼内容"
          />
          <UIcon name="i-lucide-chevron-right" class="size-3" />
          <UBadge
            :color="step === 'sending' ? 'primary' : 'neutral'"
            :variant="step === 'sending' ? 'solid' : 'subtle'"
            size="md"
            label="3. 送信"
          />
        </div>
      </div>
    </template>

    <template #body>
      <!-- Step 1: Manufacturer selection -->
      <div v-if="step === 'select'" class="space-y-3">
        <p class="text-sm text-muted">
          各メーカーへの連絡方法を選択してください。
        </p>
        <div
          v-for="item in matchedManufacturers"
          :key="item.name"
          class="border border-default rounded-lg p-3 space-y-2 flex flex-row items-end justify-between"
        >
          <div class="flex flex-col gap-1">
            <div class="flex items-center justify-between">
              <span class="font-medium text-sm">{{ item.name }}</span>
              <UBadge
                v-if="!item.manufacturer"
                label="未登録"
                color="warning"
                variant="subtle"
                size="xs"
              />
            </div>
            <div v-if="item.manufacturer" class="text-xs text-muted space-y-1">
              <p v-if="item.manufacturer.contactEmail">
                <UIcon
                  name="i-lucide-mail"
                  class="size-3.5 inline-block mr-1"
                />
                {{ item.manufacturer.contactEmail }}
              </p>
              <p v-if="item.manufacturer.faxNumber">
                <UIcon
                  name="i-lucide-printer"
                  class="size-3.5 inline-block mr-1"
                />
                FAX: {{ item.manufacturer.faxNumber }}
              </p>
              <p v-if="item.manufacturer.contactPhone">
                <UIcon
                  name="i-lucide-phone"
                  class="size-3.5 inline-block mr-1"
                />
                {{ item.manufacturer.contactPhone }}
              </p>
            </div>
          </div>
          <div v-if="item.manufacturer" class="pt-1">
            <URadioGroup
              v-model="item.contactMethod.value"
              :items="
                contactMethodOptions.filter(
                  (o) =>
                    (o.value === 'email' && item.manufacturer?.contactEmail)
                    || (o.value === 'fax' && item.manufacturer?.faxNumber)
                )
              "
              orientation="horizontal"
              size="xs"
              variant="card"
              indicator="end"
            />
          </div>
        </div>

        <div
          v-if="matchedManufacturers.length === 0"
          class="text-center py-8 text-muted text-sm"
        >
          メーカーが選択されていません。各行でメーカーを選択してください。
        </div>
      </div>

      <!-- Step 2: Compose email/FAX content -->
      <div v-else-if="step === 'compose'" class="space-y-4">
        <!-- Recipients -->
        <div class="space-y-1.5">
          <label class="text-sm font-medium">送信先</label>
          <div class="flex flex-wrap gap-1.5">
            <UBadge
              v-for="tag in recipientTags"
              :key="tag"
              :label="tag"
              color="primary"
              variant="subtle"
              size="sm"
            />
          </div>
        </div>

        <!-- Subject -->
        <div class="space-y-1.5">
          <label class="text-sm font-medium">件名</label>
          <UInput v-model="subject" placeholder="件名を入力" class="w-full" />
        </div>

        <!-- Editor -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium">本文テンプレート</label>
          </div>
          <div class="flex flex-wrap gap-1 mb-1">
            <span class="text-xs text-muted mr-1 self-center">変数：</span>
            <UBadge
              v-for="v in templateVariables"
              :key="v.key"
              :label="v.key"
              color="info"
              variant="subtle"
              size="xs"
              class="cursor-default"
              :title="v.description"
            />
          </div>
          <div class="border border-default rounded-lg overflow-hidden">
            <UEditor
              v-model="editorContent"
              class="h-64 overflow-y-auto prose prose-sm p-3 w-full"
            />
          </div>
          <p class="text-xs text-muted">
            <UIcon name="i-lucide-info" class="size-3 inline-block mr-0.5" />
            送信時に各変数が送信先に応じて自動的に置換されます。
          </p>
        </div>

        <!-- Attachment -->
        <div class="space-y-1.5">
          <label class="text-sm font-medium">添付ファイル</label>
          <div class="flex items-center gap-2 border border-default rounded-lg p-2.5 bg-muted/30">
            <UIcon name="i-lucide-file-text" class="size-5 text-red-500 shrink-0" />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate">
                提案書_見積依頼.pdf
              </p>
              <p class="text-xs text-muted">
                提案フォームから自動生成
              </p>
            </div>
            <UBadge
              label="PDF"
              color="error"
              variant="subtle"
              size="xs"
            />
          </div>
        </div>
      </div>

      <!-- Step 3: Sending progress -->
      <div v-else-if="step === 'sending'" class="space-y-4 py-4">
        <p class="text-sm text-muted text-center mb-4">
          メーカーへ依頼を送信しています...
        </p>
        <div
          v-for="item in matchedManufacturers"
          :key="item.name"
          class="flex items-center gap-3 px-4 py-2 rounded-md border border-default"
        >
          <UIcon
            v-if="sendingStatuses[item.name] === 'done'"
            name="i-lucide-check-circle"
            class="size-5 text-success shrink-0"
          />
          <UIcon
            v-else-if="sendingStatuses[item.name] === 'sending'"
            name="i-lucide-loader-2"
            class="size-5 text-primary animate-spin shrink-0"
          />
          <UIcon
            v-else
            name="i-lucide-circle"
            class="size-5 text-muted shrink-0"
          />
          <span class="text-sm flex-1">{{ item.name }}</span>
          <span class="text-xs text-muted">
            {{ item.contactMethod.value === "email" ? "メール" : "FAX" }}
          </span>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2 w-full">
        <!-- Step 1 footer -->
        <template v-if="step === 'select'">
          <UButton
            label="キャンセル"
            color="neutral"
            variant="outline"
            @click="open = false"
          />
          <UButton
            label="依頼内容へ進む"
            color="primary"
            icon="i-lucide-arrow-right"
            trailing
            :disabled="matchedManufacturers.length === 0"
            @click="goToCompose"
          />
        </template>

        <!-- Step 2 footer -->
        <template v-if="step === 'compose'">
          <UButton
            label="戻る"
            color="neutral"
            variant="outline"
            icon="i-lucide-arrow-left"
            @click="goBackToSelect"
          />
          <UButton
            label="依頼を送信"
            color="primary"
            icon="i-bi-send"
            @click="handleSend"
          />
        </template>
      </div>
    </template>
  </UModal>
</template>
