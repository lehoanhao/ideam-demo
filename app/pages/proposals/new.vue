<script setup lang="ts">
import type { StepperItem } from '@nuxt/ui'

const processList = [
  {
    title: '新規作成中',
    icon: 'i-mdi-form-textbox'
  },
  {
    title: '仕入れ依頼',
    icon: 'i-mdi-cart'
  },
  {
    title: 'メーカー依頼',
    icon: 'i-bi-send'
  },
  {
    title: '仕入れ値段決定',
    icon: 'i-fluent-money-calculator-20-regular'
  },
  {
    title: '承認',
    icon: 'i-material-symbols-order-approve'
  },
  {
    title: '完了',
    icon: 'i-nrk-media-media-complete'
  }
] satisfies StepperItem[]

const showSidebar = ref(true)
</script>

<template>
  <div class="flex h-full overflow-hidden">
    <!-- Main panel -->
    <div class="flex-1 flex flex-col min-w-0 overflow-auto">
      <div class="flex-1 overflow-auto">
        <div class="flex flex-row gap-2 px-2 py-3">
          <UButton
            icon="i-ep-back"
            color="neutral"
            variant="ghost"
            @click="navigateTo('/proposals')"
          />
          <UCard
            :ui="{
              body: '!py-2 !px-0'
            }"
            class="rounded-full shadow-sm shadow-gray-400 flex-1"
          >
            <UStepper
              disabled
              :items="processList"
              class="w-full"
              size="sm"
            />
          </UCard>
          <UTooltip :text="showSidebar ? '案件情報を隠す' : '案件情報を表示'">
            <UButton
              :icon="
                showSidebar
                  ? 'i-heroicons-chevron-double-right'
                  : 'i-heroicons-chevron-double-left'
              "
              color="neutral"
              variant="ghost"
              @click="showSidebar = !showSidebar"
            />
          </UTooltip>
        </div>

        <ProposalsForm />
      </div>
    </div>

    <!-- Sidebar -->
    <div
      :class="showSidebar ? 'w-64 border-l border-default' : 'w-0'"
      class="flex-shrink-0 flex flex-col bg-elevated/55 overflow-hidden transition-all duration-300 ease-in-out"
    >
      <div class="border-b border-default px-4 py-2">
        <h2 class="text-sm font-semibold">
          新規案件作成
        </h2>
      </div>

      <div class="flex-1 overflow-auto p-4">
        <ProposalsInformation />
      </div>

      <div class="border-t border-default p-4">
        <div class="flex flex-col gap-3">
          <UFormField label="予算備考" class="w-full">
            <UInput class="w-full" placeholder="" />
          </UFormField>
          <UFormField label="予算合計" class="w-full">
            <UInput class="w-full" placeholder="" />
          </UFormField>
        </div>
        <div class="flex flex-col justify-between gap-2 mt-4">
          <UButton
            label="下書き保存"
            color="neutral"
            variant="outline"
            block
          />
          <UButton
            label="仕入れ依頼する"
            color="primary"
            block
            trailing-icon="i-icons8-right-round"
          />
        </div>
      </div>
    </div>
  </div>
</template>
