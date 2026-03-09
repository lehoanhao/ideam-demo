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
  openProductSearch: []
  openManufacturerSearch: []
}>()

const variant = computed(() => (props.active ? 'outline' : 'outline'))

const expanded = ref(false)

const FIELD_SPANS: Record<string, { normal: string, expanded: string }> = {
  budgetQty: { normal: '', expanded: 'col-span-2' },
  itemGroup: { normal: '', expanded: 'col-span-2' },
  productCode: { normal: '', expanded: 'col-span-2' },
  productName: { normal: 'col-span-4', expanded: 'col-span-4' },
  sellingPrice: { normal: '', expanded: 'col-span-2' },
  packQty: { normal: '', expanded: 'col-span-2' },
  listPrice: { normal: '', expanded: 'col-span-2' },
  budgetPrice: { normal: '', expanded: 'col-span-2' },
  catalogName: { normal: '', expanded: 'col-span-2' },
  catalogPage: { normal: '', expanded: 'col-span-2' },
  manufacturerName: { normal: '', expanded: 'col-span-3' },
  accountName: { normal: '', expanded: 'col-span-2' },
  rfqType: { normal: '', expanded: 'col-span-2' },
  requestDate: { normal: '', expanded: 'col-span-1' },
  costPrice: { normal: '', expanded: 'col-span-2' },
  sampleQty: { normal: '', expanded: 'col-span-2' },
  arrivalDate: { normal: '', expanded: 'col-span-1' },
  costNotes: { normal: 'col-span-5', expanded: 'col-span-5' },
  deliveryNotes: { normal: 'col-span-3', expanded: 'col-span-5' },
  adoptionType: { normal: '', expanded: 'col-span-4' },
  contactDate: { normal: '', expanded: 'col-span-1' }
}

function spanClass(fieldKey: string) {
  const cfg = FIELD_SPANS[fieldKey]
  return cfg ? (expanded.value ? cfg.expanded : cfg.normal) : ''
}

function isHighlighted(fieldKey: string) {
  return props.highlights.some(
    h => h.rowId === props.rowId && h.fieldKey === fieldKey
  )
}

function onFieldClick(fieldKey: string, e: MouseEvent) {
  if (props.picking) {
    e.stopPropagation()
    emit('pickField', fieldKey)
  }
}

function formatDateTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}
</script>

<template>
  <div
    :data-row-id="rowId"
    class="flex flex-col gap-2 group border rounded-md p-3 bg-white dark:bg-neutral-800 transition-colors"
    :class="
      picking ? 'border-primary border-dashed cursor-pointer' : 'border-muted'
    "
  >
    <div class="flex flex-row gap-3 justify-between">
      <div class="flex items-center gap-2">
        <div
          class="w-6 h-6 flex items-center justify-center rounded-full text-xs font-semibold"
          :class="
            updatedAt ? 'bg-primary text-white' : 'border border-accented'
          "
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
        <UButton
          :label="expanded ? '縮小' : '展開'"
          color="neutral"
          :icon="expanded ? 'i-lucide-minimize-2' : 'i-lucide-maximize-2'"
          variant="solid"
          size="xs"
          class="mt-2"
          @click.stop="expanded = !expanded"
        />
      </div>
    </div>
    <div class="grid grid-cols-10 space-x-1 space-y-2">
      <UFormField
        label="予算数"
        size="xs"
        data-field="budgetQty"
        :class="[
          spanClass('budgetQty'),
          isHighlighted('budgetQty')
            && 'ring ring-warning rounded-md bg-warning/10',
          picking && 'hover:bg-primary/10 cursor-pointer'
        ]"
        @click="onFieldClick('budgetQty', $event)"
      >
        <UInputNumber
          v-model="model.budgetQty"
          class="w-full"
          :variant="variant"
          color="neutral"
          orientation="vertical"
        />
      </UFormField>
      <UFormField
        label="品群"
        size="xs"
        data-field="itemGroup"
        :class="[
          spanClass('itemGroup'),
          isHighlighted('itemGroup')
            && 'ring ring-warning rounded-md bg-warning/10',
          picking && 'hover:bg-primary/10 cursor-pointer'
        ]"
        @click="onFieldClick('itemGroup', $event)"
      >
        <ProposalsItemGroupSelect
          v-model="model.itemGroup"
          :variant="variant"
          class="w-full"
        />
      </UFormField>
      <UFormField
        label="品番"
        size="xs"
        data-field="productCode"
        :class="[
          spanClass('productCode'),
          isHighlighted('productCode')
            && 'ring ring-warning rounded-md bg-warning/10',
          picking && 'hover:bg-primary/10 cursor-pointer'
        ]"
        @click="onFieldClick('productCode', $event)"
      >
        <div class="flex gap-0.5 w-full">
          <UInput
            v-model="model.productCode"
            :variant="variant"
            class="flex-1"
          />
          <UButton
            icon="i-lucide-search"
            variant="outline"
            color="neutral"
            size="xs"
            class="shrink-0"
            @click.stop="emit('openProductSearch')"
          />
        </div>
      </UFormField>
      <UFormField
        label="品名"
        size="xs"
        data-field="productName"
        :class="[
          spanClass('productName'),
          isHighlighted('productName')
            && 'ring ring-warning rounded-md bg-warning/10',
          picking && 'hover:bg-primary/10 cursor-pointer'
        ]"
        @click="onFieldClick('productName', $event)"
      >
        <UInput v-model="model.productName" :variant="variant" class="w-full" />
      </UFormField>
      <UFormField
        label="売上単価"
        size="xs"
        data-field="sellingPrice"
        :class="[
          spanClass('sellingPrice'),
          isHighlighted('sellingPrice')
            && 'ring ring-warning rounded-md bg-warning/10',
          picking && 'hover:bg-primary/10 cursor-pointer'
        ]"
        @click="onFieldClick('sellingPrice', $event)"
      >
        <UInput
          v-model="model.sellingPrice"
          :variant="variant"
          class="w-full"
        />
      </UFormField>
      <UFormField
        label="入数"
        size="xs"
        data-field="packQty"
        :class="[
          spanClass('packQty'),
          isHighlighted('packQty')
            && 'ring ring-warning rounded-md bg-warning/10',
          picking && 'hover:bg-primary/10 cursor-pointer'
        ]"
        @click="onFieldClick('packQty', $event)"
      >
        <UInput v-model="model.packQty" :variant="variant" class="w-full" />
      </UFormField>
      <UFormField
        label="定価"
        size="xs"
        data-field="listPrice"
        :class="[
          spanClass('listPrice'),
          isHighlighted('listPrice')
            && 'ring ring-warning rounded-md bg-warning/10',
          picking && 'hover:bg-primary/10 cursor-pointer'
        ]"
        @click="onFieldClick('listPrice', $event)"
      >
        <UInput v-model="model.listPrice" :variant="variant" class="w-full" />
      </UFormField>
      <UFormField
        label="予算単価"
        size="xs"
        data-field="budgetPrice"
        :class="[
          spanClass('budgetPrice'),
          isHighlighted('budgetPrice')
            && 'ring ring-warning rounded-md bg-warning/10',
          picking && 'hover:bg-primary/10 cursor-pointer'
        ]"
        @click="onFieldClick('budgetPrice', $event)"
      >
        <UInputNumber
          v-model="model.budgetPrice"
          class="w-full"
          :variant="variant"
          color="neutral"
          orientation="vertical"
        />
      </UFormField>
      <UFormField
        label="カタログ名"
        size="xs"
        data-field="catalogName"
        :class="[
          spanClass('catalogName'),
          isHighlighted('catalogName')
            && 'ring ring-warning rounded-md bg-warning/10',
          picking && 'hover:bg-primary/10 cursor-pointer'
        ]"
        @click="onFieldClick('catalogName', $event)"
      >
        <ProposalsCatalogSelect
          v-model="model.catalogName"
          :variant="variant"
          class="w-full"
        />
      </UFormField>
      <UFormField
        label="掲載ページ"
        size="xs"
        data-field="catalogPage"
        :class="[
          spanClass('catalogPage'),
          isHighlighted('catalogPage')
            && 'ring ring-warning rounded-md bg-warning/10',
          picking && 'hover:bg-primary/10 cursor-pointer'
        ]"
        @click="onFieldClick('catalogPage', $event)"
      >
        <ProposalsCategorySelect
          v-model="model.catalogPage"
          :variant="variant"
          class="w-full"
        />
      </UFormField>
      <UFormField
        label="メーカー名"
        size="xs"
        data-field="manufacturerName"
        :class="[
          spanClass('manufacturerName'),
          isHighlighted('manufacturerName')
            && 'ring ring-warning rounded-md bg-warning/10',
          picking && 'hover:bg-primary/10 cursor-pointer'
        ]"
        @click="onFieldClick('manufacturerName', $event)"
      >
        <!-- <ProposalsManufacturerSelect v-model="model.manufacturerName" :variant="variant" /> -->
        <UButton
          trailing-icon="i-lucide-search"
          variant="outline"
          color="neutral"
          size="xs"
          class="w-full"
          :label="model.manufacturerName || '未指定'"
          :ui="{
            trailingIcon: 'ml-auto'
          }"
          @click.stop="emit('openManufacturerSearch')"
        />
      </UFormField>
      <UFormField
        label="帳合先"
        size="xs"
        data-field="accountName"
        :class="[
          spanClass('accountName'),
          isHighlighted('accountName')
            && 'ring ring-warning rounded-md bg-warning/10',
          picking && 'hover:bg-primary/10 cursor-pointer'
        ]"
        @click="onFieldClick('accountName', $event)"
      >
        <ProposalsAccountSelect
          v-model="model.accountName"
          :variant="variant"
          class="w-full"
        />
      </UFormField>
      <UFormField
        label="見積依頼区分"
        size="xs"
        data-field="rfqType"
        :class="[
          spanClass('rfqType'),
          isHighlighted('rfqType')
            && 'ring ring-warning rounded-md bg-warning/10',
          picking && 'hover:bg-primary/10 cursor-pointer'
        ]"
        @click="onFieldClick('rfqType', $event)"
      >
        <ProposalsRfqTypeSelect
          v-model="model.rfqType"
          :variant="variant"
          class="w-full"
        />
      </UFormField>
      <UFormField
        label="依頼日"
        size="xs"
        data-field="requestDate"
        :class="[
          spanClass('requestDate'),
          isHighlighted('requestDate')
            && 'ring ring-warning rounded-md bg-warning/10',
          picking && 'hover:bg-primary/10 cursor-pointer'
        ]"
        @click="onFieldClick('requestDate', $event)"
      >
        <CommonDatePicker v-model="model.requestDate" :variant="variant" />
      </UFormField>
      <UFormField
        label="原価"
        size="xs"
        data-field="costPrice"
        :class="[
          spanClass('costPrice'),
          isHighlighted('costPrice')
            && 'ring ring-warning rounded-md bg-warning/10',
          picking && 'hover:bg-primary/10 cursor-pointer'
        ]"
        @click="onFieldClick('costPrice', $event)"
      >
        <UInput v-model="model.costPrice" :variant="variant" class="w-full" />
      </UFormField>
      <UFormField
        label="サンプル数"
        size="xs"
        data-field="sampleQty"
        :class="[
          spanClass('sampleQty'),
          isHighlighted('sampleQty')
            && 'ring ring-warning rounded-md bg-warning/10',
          picking && 'hover:bg-primary/10 cursor-pointer'
        ]"
        @click="onFieldClick('sampleQty', $event)"
      >
        <UInput v-model="model.sampleQty" :variant="variant" class="w-full" />
      </UFormField>
      <UFormField
        label="入荷日"
        size="xs"
        data-field="arrivalDate"
        :class="[
          spanClass('arrivalDate'),
          isHighlighted('arrivalDate')
            && 'ring ring-warning rounded-md bg-warning/10',
          picking && 'hover:bg-primary/10 cursor-pointer'
        ]"
        @click="onFieldClick('arrivalDate', $event)"
      >
        <CommonDatePicker v-model="model.arrivalDate" :variant="variant" />
      </UFormField>
      <UFormField
        label="備考(原価明細他)"
        size="xs"
        data-field="costNotes"
        :class="[
          spanClass('costNotes'),
          isHighlighted('costNotes')
            && 'ring ring-warning rounded-md bg-warning/10',
          picking && 'hover:bg-primary/10 cursor-pointer'
        ]"
        @click="onFieldClick('costNotes', $event)"
      >
        <UInput v-model="model.costNotes" :variant="variant" class="w-full" />
      </UFormField>
      <UFormField
        label="納期/備考"
        size="xs"
        data-field="deliveryNotes"
        :class="[
          spanClass('deliveryNotes'),
          isHighlighted('deliveryNotes')
            && 'ring ring-warning rounded-md bg-warning/10',
          picking && 'hover:bg-primary/10 cursor-pointer'
        ]"
        @click="onFieldClick('deliveryNotes', $event)"
      >
        <UInput
          v-model="model.deliveryNotes"
          :variant="variant"
          class="w-full"
        />
      </UFormField>
      <UFormField
        label="採用区分"
        size="xs"
        data-field="adoptionType"
        :class="[
          spanClass('adoptionType'),
          isHighlighted('adoptionType')
            && 'ring ring-warning rounded-md bg-warning/10',
          picking && 'hover:bg-primary/10 cursor-pointer'
        ]"
        @click="onFieldClick('adoptionType', $event)"
      >
        <UInput
          v-model="model.adoptionType"
          :variant="variant"
          class="w-full"
        />
      </UFormField>
      <UFormField
        label="連絡日"
        size="xs"
        data-field="contactDate"
        :class="[
          spanClass('contactDate'),
          isHighlighted('contactDate')
            && 'ring ring-warning rounded-md bg-warning/10',
          picking && 'hover:bg-primary/10 cursor-pointer'
        ]"
        @click="onFieldClick('contactDate', $event)"
      >
        <CommonDatePicker v-model="model.contactDate" :variant="variant" />
      </UFormField>
    </div>
  </div>
</template>
