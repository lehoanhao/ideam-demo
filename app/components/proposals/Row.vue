<script setup lang="ts">
import type { FormRowData, HighlightTarget } from '~/stores/proposals'

const props = defineProps<{
  active?: boolean
  no: number
  rowId: number
  createdAt: string
  updatedAt: string | null
  highlights: HighlightTarget[]
  picking: boolean
}>()

const model = defineModel<FormRowData>({ required: true })

const emit = defineEmits<{
  delete: []
  duplicate: []
  pickField: [fieldKey: string]
}>()

const variant = computed(() => (props.active ? 'outline' : 'outline'))

function isHighlighted(fieldKey: string) {
  return props.highlights.some(h => h.rowId === props.rowId && h.fieldKey === fieldKey)
}

function onFieldClick(fieldKey: string, e: MouseEvent) {
  if (props.picking) {
    e.stopPropagation()
    emit('pickField', fieldKey)
  }
}

function formatDateTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })
}
</script>

<template>
  <div
    :data-row-id="rowId"
    class="flex flex-col gap-2 group border rounded-md p-3 bg-white dark:bg-gray-800 transition-colors"
    :class="picking ? 'border-primary border-dashed cursor-pointer' : 'border-muted'"
  >
    <div class="flex flex-row gap-3 justify-between">
      <div class="flex items-center gap-2">
        <div
          class="w-6 h-6 flex items-center justify-center rounded-full text-xs font-semibold"
          :class="updatedAt ? 'bg-primary text-white' : 'border border-accented'"
        >
          {{ no }}
        </div>
        <span class="text-xs text-muted">
          作成: {{ formatDateTime(createdAt) }}
        </span>
        <span v-if="updatedAt" class="text-xs text-primary font-medium">
          更新: {{ formatDateTime(updatedAt) }}
        </span>
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
          @click.stop="emit('delete')"
        />
        <UButton
          label="複写"
          color="info"
          icon="i-material-symbols-content-copy-outline"
          variant="solid"
          size="xs"
          class="mt-2"
          @click.stop="emit('duplicate')"
        />
      </div>
    </div>
    <div class="grid grid-cols-10 space-x-1">
      <UFormField
        label="予算数"
        size="xs"
        data-field="budgetQty"
        :class="[isHighlighted('budgetQty') && 'ring ring-warning rounded-md bg-warning/10', picking && 'hover:bg-primary/10 cursor-pointer']"
        @click="onFieldClick('budgetQty', $event)"
      >
        <UInputNumber
          v-model="model.budgetQty"
          :variant="variant"
          color="neutral"
          orientation="vertical"
        />
      </UFormField>
      <UFormField
        label="品群"
        size="xs"
        data-field="itemGroup"
        :class="[isHighlighted('itemGroup') && 'ring ring-warning rounded-md bg-warning/10', picking && 'hover:bg-primary/10 cursor-pointer']"
        @click="onFieldClick('itemGroup', $event)"
      >
        <ProposalsItemGroupSelect v-model="model.itemGroup" :variant="variant" class="w-full" />
      </UFormField>
      <UFormField
        label="品番"
        size="xs"
        data-field="productCode"
        :class="[isHighlighted('productCode') && 'ring ring-warning rounded-md bg-warning/10', picking && 'hover:bg-primary/10 cursor-pointer']"
        @click="onFieldClick('productCode', $event)"
      >
        <UInput v-model="model.productCode" :variant="variant" class="w-full" />
      </UFormField>
      <UFormField
        label="品名"
        size="xs"
        class="col-span-4"
        data-field="productName"
        :class="[isHighlighted('productName') && 'ring ring-warning rounded-md bg-warning/10', picking && 'hover:bg-primary/10 cursor-pointer']"
        @click="onFieldClick('productName', $event)"
      >
        <UInput v-model="model.productName" :variant="variant" class="w-full" />
      </UFormField>
      <UFormField
        label="売上単価"
        size="xs"
        data-field="sellingPrice"
        :class="[isHighlighted('sellingPrice') && 'ring ring-warning rounded-md bg-warning/10', picking && 'hover:bg-primary/10 cursor-pointer']"
        @click="onFieldClick('sellingPrice', $event)"
      >
        <UInput v-model="model.sellingPrice" :variant="variant" class="w-full" />
      </UFormField>
      <UFormField
        label="入数"
        size="xs"
        data-field="packQty"
        :class="[isHighlighted('packQty') && 'ring ring-warning rounded-md bg-warning/10', picking && 'hover:bg-primary/10 cursor-pointer']"
        @click="onFieldClick('packQty', $event)"
      >
        <UInput v-model="model.packQty" :variant="variant" class="w-full" />
      </UFormField>
      <UFormField
        label="定価"
        size="xs"
        data-field="listPrice"
        :class="[isHighlighted('listPrice') && 'ring ring-warning rounded-md bg-warning/10', picking && 'hover:bg-primary/10 cursor-pointer']"
        @click="onFieldClick('listPrice', $event)"
      >
        <UInput v-model="model.listPrice" :variant="variant" class="w-full" />
      </UFormField>
    </div>
    <div class="grid grid-cols-10 space-x-1">
      <UFormField
        label="予算単価"
        size="xs"
        data-field="budgetPrice"
        :class="[isHighlighted('budgetPrice') && 'ring ring-warning rounded-md bg-warning/10', picking && 'hover:bg-primary/10 cursor-pointer']"
        @click="onFieldClick('budgetPrice', $event)"
      >
        <UInputNumber
          v-model="model.budgetPrice"
          :variant="variant"
          color="neutral"
          orientation="vertical"
        />
      </UFormField>
      <UFormField
        label="カタログ名"
        size="xs"
        data-field="catalogName"
        :class="[isHighlighted('catalogName') && 'ring ring-warning rounded-md bg-warning/10', picking && 'hover:bg-primary/10 cursor-pointer']"
        @click="onFieldClick('catalogName', $event)"
      >
        <ProposalsCatalogSelect v-model="model.catalogName" :variant="variant" class="w-full" />
      </UFormField>
      <UFormField
        label="掲載ページ"
        size="xs"
        data-field="catalogPage"
        :class="[isHighlighted('catalogPage') && 'ring ring-warning rounded-md bg-warning/10', picking && 'hover:bg-primary/10 cursor-pointer']"
        @click="onFieldClick('catalogPage', $event)"
      >
        <ProposalsCategorySelect v-model="model.catalogPage" :variant="variant" class="w-full" />
      </UFormField>
      <UFormField
        label="メーカー名"
        size="xs"
        data-field="manufacturerName"
        :class="[isHighlighted('manufacturerName') && 'ring ring-warning rounded-md bg-warning/10', picking && 'hover:bg-primary/10 cursor-pointer']"
        @click="onFieldClick('manufacturerName', $event)"
      >
        <ProposalsManufacturerSelect v-model="model.manufacturerName" :variant="variant" class="w-full" />
      </UFormField>
      <UFormField
        label="帳合先"
        size="xs"
        data-field="accountName"
        :class="[isHighlighted('accountName') && 'ring ring-warning rounded-md bg-warning/10', picking && 'hover:bg-primary/10 cursor-pointer']"
        @click="onFieldClick('accountName', $event)"
      >
        <ProposalsAccountSelect v-model="model.accountName" :variant="variant" class="w-full" />
      </UFormField>
      <UFormField
        label="見積依頼区分"
        size="xs"
        data-field="rfqType"
        :class="[isHighlighted('rfqType') && 'ring ring-warning rounded-md bg-warning/10', picking && 'hover:bg-primary/10 cursor-pointer']"
        @click="onFieldClick('rfqType', $event)"
      >
        <ProposalsRfqTypeSelect v-model="model.rfqType" :variant="variant" class="w-full" />
      </UFormField>
      <UFormField
        label="依頼日"
        size="xs"
        data-field="requestDate"
        :class="[isHighlighted('requestDate') && 'ring ring-warning rounded-md bg-warning/10', picking && 'hover:bg-primary/10 cursor-pointer']"
        @click="onFieldClick('requestDate', $event)"
      >
        <UInput v-model="model.requestDate" :variant="variant" class="w-full" />
      </UFormField>
      <UFormField
        label="原価"
        size="xs"
        data-field="costPrice"
        :class="[isHighlighted('costPrice') && 'ring ring-warning rounded-md bg-warning/10', picking && 'hover:bg-primary/10 cursor-pointer']"
        @click="onFieldClick('costPrice', $event)"
      >
        <UInput v-model="model.costPrice" :variant="variant" class="w-full" />
      </UFormField>
      <UFormField
        label="サンプル数"
        size="xs"
        data-field="sampleQty"
        :class="[isHighlighted('sampleQty') && 'ring ring-warning rounded-md bg-warning/10', picking && 'hover:bg-primary/10 cursor-pointer']"
        @click="onFieldClick('sampleQty', $event)"
      >
        <UInput v-model="model.sampleQty" :variant="variant" class="w-full" />
      </UFormField>
      <UFormField
        label="入荷日"
        size="xs"
        data-field="arrivalDate"
        :class="[isHighlighted('arrivalDate') && 'ring ring-warning rounded-md bg-warning/10', picking && 'hover:bg-primary/10 cursor-pointer']"
        @click="onFieldClick('arrivalDate', $event)"
      >
        <UInput v-model="model.arrivalDate" :variant="variant" class="w-full" />
      </UFormField>
    </div>
    <div class="grid grid-cols-10 space-x-1">
      <UFormField
        label="備考(原価明細他)"
        size="xs"
        class="col-span-5"
        data-field="costNotes"
        :class="[isHighlighted('costNotes') && 'ring ring-warning rounded-md bg-warning/10', picking && 'hover:bg-primary/10 cursor-pointer']"
        @click="onFieldClick('costNotes', $event)"
      >
        <UInput v-model="model.costNotes" :variant="variant" class="w-full" />
      </UFormField>
      <UFormField
        label="納期/備考"
        size="xs"
        class="col-span-3"
        data-field="deliveryNotes"
        :class="[isHighlighted('deliveryNotes') && 'ring ring-warning rounded-md bg-warning/10', picking && 'hover:bg-primary/10 cursor-pointer']"
        @click="onFieldClick('deliveryNotes', $event)"
      >
        <UInput v-model="model.deliveryNotes" :variant="variant" class="w-full" />
      </UFormField>
      <UFormField
        label="採用区分"
        size="xs"
        data-field="adoptionType"
        :class="[isHighlighted('adoptionType') && 'ring ring-warning rounded-md bg-warning/10', picking && 'hover:bg-primary/10 cursor-pointer']"
        @click="onFieldClick('adoptionType', $event)"
      >
        <UInput v-model="model.adoptionType" :variant="variant" class="w-full" />
      </UFormField>
      <UFormField
        label="連絡日"
        size="xs"
        data-field="contactDate"
        :class="[isHighlighted('contactDate') && 'ring ring-warning rounded-md bg-warning/10', picking && 'hover:bg-primary/10 cursor-pointer']"
        @click="onFieldClick('contactDate', $event)"
      >
        <UInput v-model="model.contactDate" :variant="variant" class="w-full" />
      </UFormField>
    </div>
  </div>
</template>
