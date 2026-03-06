<script setup lang="ts">
const props = defineProps<{
  active?: boolean
  no: number
}>()

const variant = computed(() => (props.active ? 'outline' : 'outline'))
</script>

<template>
  <div
    class="flex flex-col gap-2 group border border-muted rounded-md p-3"
  >
    <div class="flex flex-row gap-3 justify-between">
      <div
        class="w-6 h-6 flex items-center justify-center border border-accented rounded-full"
      >
        {{ no }}
      </div>
      <div
        class="flex flex-row gap-2 justify-end group-hover:visible invisible"
      >
        <UButton
          label="削除"
          color="warning"
          icon="i-material-symbols-delete-outline"
          variant="solid"
          size="xs"
          class="mt-2"
        />
        <UButton
          label="複写"
          color="info"
          icon="i-material-symbols-content-copy-outline"
          variant="solid"
          size="xs"
          class="mt-2"
        />
      </div>
    </div>
    <div class="grid grid-cols-10 space-x-1">
      <UFormField label="予算数" size="xs">
        <UInputNumber
          :variant="variant"
          color="neutral"
          orientation="vertical"
        />
      </UFormField>
      <UFormField label="品群" size="xs">
        <ProposalsItemGroupSelect :variant="variant" class="w-full" />
      </UFormField>
      <UFormField label="品番" size="xs">
        <UInput :variant="variant" class="w-full" />
      </UFormField>
      <UFormField label="品名" size="xs" class="col-span-4">
        <UInput :variant="variant" class="w-full" />
      </UFormField>
      <UFormField label="売上単価" size="xs">
        <UInput :variant="variant" class="w-full" />
      </UFormField>
      <UFormField label="入数" size="xs">
        <UInput :variant="variant" class="w-full" />
      </UFormField>
      <UFormField label="定価" size="xs">
        <UInput :variant="variant" class="w-full" />
      </UFormField>
    </div>
    <div class="grid grid-cols-10 space-x-1">
      <UFormField label="予算単価" size="xs">
        <UInputNumber
          :variant="variant"
          color="neutral"
          orientation="vertical"
        />
      </UFormField>
      <UFormField label="カタログ名" size="xs">
        <ProposalsCatalogSelect :variant="variant" class="w-full" />
      </UFormField>
      <UFormField label="掲載ページ" size="xs">
        <ProposalsCategorySelect :variant="variant" class="w-full" />
      </UFormField>
      <UFormField label="メーカー名" size="xs">
        <UInput :variant="variant" class="w-full" />
      </UFormField>
      <UFormField label="帳合先" size="xs">
        <ProposalsAccountSelect :variant="variant" class="w-full" />
      </UFormField>
      <UFormField label="見積依頼区分" size="xs">
        <ProposalsRfqTypeSelect :variant="variant" class="w-full" />
      </UFormField>
      <UFormField label="依頼日" size="xs">
        <UInput :variant="variant" class="w-full" />
      </UFormField>
      <UFormField label="原価" size="xs">
        <UInput :variant="variant" class="w-full" />
      </UFormField>
      <UFormField label="サンプル数" size="xs">
        <UInput :variant="variant" class="w-full" />
      </UFormField>
      <UFormField label="入荷日" size="xs">
        <UInput :variant="variant" class="w-full" />
      </UFormField>
    </div>
    <div class="grid grid-cols-10 space-x-1">
      <UFormField label="備考(原価明細他)" size="xs" class="col-span-5">
        <UInput :variant="variant" class="w-full" />
      </UFormField>
      <UFormField label="納期/備考" size="xs" class="col-span-3">
        <UInput :variant="variant" class="w-full" />
      </UFormField>
      <UFormField label="採用区分" size="xs">
        <UInput :variant="variant" class="w-full" />
      </UFormField>
      <UFormField label="連絡日" size="xs">
        <UInput :variant="variant" class="w-full" />
      </UFormField>
    </div>
  </div>
</template>
