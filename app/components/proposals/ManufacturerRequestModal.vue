<script setup lang="ts">
import { useManufacturerStore } from '~/stores/manufacturers'

const props = defineProps<{
  manufacturerNames: string[]
}>()

const open = defineModel<boolean>('open', { default: false })

const manufacturerStore = useManufacturerStore()
const toast = useToast()
const sending = ref(false)
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

async function handleSend() {
  sending.value = true
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
    sending.value = false
    open.value = false
  }, 500)
}
</script>

<template>
  <UModal v-model:open="open" :ui="{ content: 'sm:max-w-2xl' }">
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-bi-send" class="size-5 text-primary" />
        <h3 class="text-base font-semibold">
          メーカー依頼
        </h3>
      </div>
    </template>

    <template #body>
      <!-- Sending progress overlay -->
      <div v-if="sending" class="space-y-4 py-4">
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

      <!-- Manufacturer selection list -->
      <div v-else class="space-y-3">
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
    </template>

    <template #footer>
      <div class="flex justify-end gap-2 w-full">
        <UButton
          v-if="!sending"
          label="キャンセル"
          color="neutral"
          variant="outline"
          @click="open = false"
        />
        <UButton
          v-if="!sending"
          label="依頼を送信"
          color="primary"
          icon="i-bi-send"
          :disabled="matchedManufacturers.length === 0"
          @click="handleSend"
        />
      </div>
    </template>
  </UModal>
</template>
