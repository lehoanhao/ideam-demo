<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'
import type { DateValue } from '@internationalized/date'

const props = withDefaults(defineProps<{
  variant?: 'outline' | 'soft' | 'subtle' | 'ghost' | 'none'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'
  disabled?: boolean
  readonly?: boolean
}>(), {
  variant: 'outline',
  size: 'xs',
  color: 'neutral'
})

const model = defineModel<string>({ default: '' })

const calendarValue = computed<DateValue | undefined>({
  get() {
    if (!model.value) return undefined
    const parts = model.value.split('-')
    if (parts.length === 3) {
      const [y, m, d] = parts.map(Number)
      if (y && m && d) return new CalendarDate(y, m, d)
    }
    return undefined
  },
  set(val: DateValue | undefined) {
    if (!val) {
      model.value = ''
      return
    }
    const y = String(val.year).padStart(4, '0')
    const m = String(val.month).padStart(2, '0')
    const d = String(val.day).padStart(2, '0')
    model.value = `${y}-${m}-${d}`
  }
})

const displayValue = computed(() => {
  if (!model.value) return ''
  const parts = model.value.split('-')
  if (parts.length === 3) return `${parts[0]}/${parts[1]}/${parts[2]}`
  return model.value
})

const popoverOpen = ref(false)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onCalendarSelect(val: any) {
  if (val && typeof val === 'object' && 'year' in val) calendarValue.value = val as DateValue
  else calendarValue.value = undefined
  popoverOpen.value = false
}
</script>

<template>
  <UPopover v-model:open="popoverOpen">
    <UButton
      variant="outline"
      :size="props.size"
      :color="props.color"
      :disabled="props.disabled"
      :label="displayValue || '未選択'"
      class="w-full justify-start font-normal tabular-nums"
      :class="!displayValue && 'text-dimmed'"
    />
    <template #content>
      <UCalendar
        :model-value="calendarValue"
        class="p-2"
        @update:model-value="onCalendarSelect"
      />
    </template>
  </UPopover>
</template>
