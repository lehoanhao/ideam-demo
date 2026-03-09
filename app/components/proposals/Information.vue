<script setup lang="ts">
import { FORM_ROW_FIELDS } from '~/stores/proposals'

const store = useProposalStore()

const activeTab = defineModel<string>('activeTab', { default: 'basic' })

const isDetail = computed(() => !!store.selectedProposal)

function getFieldLabel(fieldKey: string) {
  return FORM_ROW_FIELDS.find(f => f.key === fieldKey)?.label ?? fieldKey
}

function getRowLabel(rowId: number) {
  const idx = store.formRows.findIndex((r: { id: number }) => r.id === rowId)
  return idx !== -1 ? `行 ${idx + 1}` : ''
}

function goToField(rowId: number, fieldKey: string) {
  store.setHighlights([{ rowId, fieldKey }])
  nextTick(() => {
    const el = document.querySelector(
      `[data-row-id="${rowId}"] [data-field="${fieldKey}"]`
    )
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  })
}
const noteTextareaRefs = ref<
  Record<number, ComponentPublicInstance | Element | null>
>({})

function setNoteTextareaRef(
  noteId: number,
  el: ComponentPublicInstance | Element | null
) {
  if (el) noteTextareaRefs.value[noteId] = el
  else noteTextareaRefs.value[noteId] = null
}

function focusNoteTextarea(noteId: number) {
  nextTick(() => {
    const comp = noteTextareaRefs.value[noteId]
    if (!comp) return
    const el = '$el' in comp ? (comp as ComponentPublicInstance).$el : comp
    const textarea = el?.querySelector?.('textarea')
    textarea?.focus()
  })
}

function toggleNote(noteId: number) {
  store.toggleActiveNote(noteId)
  const note = store.notes.find((n: { id: number }) => n.id === noteId)
  if (store.activeNoteId === noteId && note?.rowId && note.fieldKey) {
    nextTick(() => {
      const el = document.querySelector(
        `[data-row-id="${note.rowId}"] [data-field="${note.fieldKey}"]`
      )
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }
}

watch(
  () => store.activeNoteId,
  (newId, oldId) => {
    if (newId !== null && newId !== oldId && store.pickingNoteId === null) {
      focusNoteTextarea(newId)
    }
  }
)
</script>

<template>
  <div class="space-y-3">
    <!-- 基本情報 -->
    <div v-if="activeTab === 'basic'" class="space-y-3">
      <UFormField label="担当者" class="w-full" size="xs">
        <UsersSelect class="w-full" />
      </UFormField>
      <UFormField label="顧客" class="w-full" size="xs">
        <CustomersSelect class="w-full" />
      </UFormField>
      <UFormField label="部門" class="w-full" size="xs">
        <ProposalsDepartmentSelect class="w-full" />
      </UFormField>
      <UFormField label="大分類" class="w-full" size="xs">
        <ProposalsCategorySelect class="w-full" />
      </UFormField>
      <UFormField label="目的" class="w-full" size="xs">
        <ProposalsPurposeSelect class="w-full" />
      </UFormField>
      <UFormField label="固有名" class="w-full" size="xs">
        <UInput class="w-full" placeholder="固有名を入力" />
      </UFormField>

      <!-- Detail date fields (shown when editing existing proposal) -->
      <template v-if="isDetail">
        <USeparator class="my-2" />
        <div class="grid grid-cols-2 gap-2">
          <UFormField label="作成日" class="w-full" size="xs">
            <CommonDatePicker
              v-model="store.formCreatedDate"
              class="w-full"
              disabled
            />
          </UFormField>
          <UFormField label="最終更新日" class="w-full" size="xs">
            <CommonDatePicker
              v-model="store.formLastUpdatedDate"
              class="w-full"
              disabled
            />
          </UFormField>
          <UFormField label="提案日" class="w-full" size="xs">
            <CommonDatePicker v-model="store.formProposalDate" class="w-full" />
          </UFormField>
          <UFormField label="決定日" class="w-full" size="xs">
            <CommonDatePicker v-model="store.formDecisionDate" class="w-full" />
          </UFormField>
          <UFormField label="納入日" class="w-full" size="xs">
            <CommonDatePicker v-model="store.formDeliveryDate" class="w-full" />
          </UFormField>
          <div class="relative">
            <UFormField label="承認日" class="w-full" size="xs">
              <CommonDatePicker
                v-model="store.formApprovalDate"
                class="w-full"
                disabled
              />
            </UFormField>
            <ProposalsApprovalStamp
              v-if="store.selectedProposal?.approvalStatus === 'approved'"
              approved-by="中村社長"
              :approval-date="store.selectedProposal?.approvalDate"
              class="absolute -top-1 right-3 z-10"
            />
          </div>
        </div>
      </template>
    </div>

    <!-- ライバル -->
    <div v-if="activeTab === 'rivals'" class="space-y-3">
      <div
        v-for="(entry, idx) in store.rivals"
        :key="entry.id"
        class="space-y-2 border border-muted rounded-md p-2"
      >
        <div class="flex items-center justify-between">
          <span class="text-xs font-medium">ライバル {{ idx + 1 }}</span>
          <UButton
            icon="i-heroicons-x-mark"
            color="error"
            variant="ghost"
            size="xs"
            :disabled="store.rivals.length <= 1"
            @click="store.removeRival(entry.id)"
          />
        </div>
        <UFormField label="ライバル" class="w-full" size="xs">
          <ProposalsRivalSelect v-model="entry.rival" class="w-full" />
        </UFormField>
        <UFormField label="ライバル備考" class="w-full" size="xs">
          <UTextarea
            v-model="entry.note"
            class="w-full"
            :rows="2"
            placeholder="備考を入力"
          />
        </UFormField>
      </div>
      <UButton
        label="ライバルを追加"
        icon="i-lucide-plus"
        variant="outline"
        color="neutral"
        size="xs"
        block
        @click="store.addRival()"
      />
    </div>

    <!-- 備考 -->
    <div v-if="activeTab === 'notes'" class="space-y-3">
      <div
        v-if="store.pickingNoteId !== null"
        class="flex items-center gap-2 p-2 bg-primary/10 border border-primary/30 rounded-md text-xs text-primary"
      >
        <UIcon name="i-heroicons-cursor-arrow-rays" class="size-4" />
        <span>左側のフォームで項目をクリックしてください</span>
        <UButton
          label="キャンセル"
          variant="ghost"
          color="error"
          size="xs"
          @click="store.cancelPicking()"
        />
      </div>
      <div
        v-for="(note, idx) in store.notes"
        :key="note.id"
        class="space-y-2 border rounded-md p-2 cursor-pointer transition-colors"
        :class="[
          store.pickingNoteId === note.id
            ? 'border-warning bg-warning/5'
            : store.activeNoteId === note.id
              ? 'border-warning bg-warning/5 shadow-sm'
              : 'border-muted hover:border-default'
        ]"
        @click="toggleNote(note.id)"
      >
        <div class="flex items-center justify-between">
          <span class="text-xs font-medium">備考 {{ idx + 1 }}</span>
          <UButton
            icon="i-heroicons-x-mark"
            color="error"
            variant="ghost"
            size="xs"
            @click.stop="store.removeNote(note.id)"
          />
        </div>
        <div class="flex items-center gap-1">
          <UButton
            :label="
              note.rowId && note.fieldKey
                ? `${getRowLabel(note.rowId)} / ${getFieldLabel(note.fieldKey)}`
                : '項目を選択'
            "
            :icon="
              note.rowId && note.fieldKey
                ? 'i-heroicons-check-circle'
                : 'i-heroicons-cursor-arrow-rays'
            "
            :variant="note.rowId && note.fieldKey ? 'soft' : 'outline'"
            :color="
              store.pickingNoteId === note.id
                ? 'warning'
                : note.rowId && note.fieldKey
                  ? 'primary'
                  : 'neutral'
            "
            size="xs"
            class="flex-1"
            @click.stop="store.startPicking(note.id)"
          />
          <UButton
            v-if="note.rowId && note.fieldKey"
            icon="i-heroicons-arrow-right"
            variant="soft"
            color="primary"
            size="xs"
            @click.stop="goToField(note.rowId, note.fieldKey)"
          />
        </div>
        <UFormField
          label="備考内容"
          class="w-full"
          size="xs"
          @click.stop
        >
          <UTextarea
            :ref="
              (el: ComponentPublicInstance | Element | null) =>
                setNoteTextareaRef(note.id, el)
            "
            v-model="note.text"
            class="w-full"
            :rows="2"
            placeholder="備考を入力"
          />
        </UFormField>
      </div>
      <UButton
        label="備考を追加"
        icon="i-lucide-plus"
        variant="outline"
        color="neutral"
        size="xs"
        block
        @click="store.addNote()"
      />
    </div>
  </div>
</template>
