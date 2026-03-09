<script setup lang="ts">
const props = withDefaults(defineProps<{
  label?: string
  confirmedLabel?: string
  icon?: string
  confirmedIcon?: string
  color?: 'primary' | 'success' | 'error' | 'warning'
  threshold?: number
}>(), {
  label: 'スライドして確認',
  confirmedLabel: '確認済み',
  icon: 'i-lucide-chevrons-right',
  confirmedIcon: 'i-lucide-check',
  color: 'success',
  threshold: 0.92
})

const emit = defineEmits<{
  confirmed: []
}>()

const trackRef = ref<HTMLElement | null>(null)
const dragging = ref(false)
const progress = ref(0)
const confirmed = ref(false)

type ColorDef = { bg: string, track: string, thumb: string, text: string }

const colorMap: Record<typeof props.color, ColorDef> = {
  primary: { bg: 'bg-primary/10', track: 'bg-primary', thumb: 'bg-primary', text: 'text-primary' },
  success: { bg: 'bg-success/10', track: 'bg-success', thumb: 'bg-success', text: 'text-success' },
  error: { bg: 'bg-error/10', track: 'bg-error', thumb: 'bg-error', text: 'text-error' },
  warning: { bg: 'bg-warning/10', track: 'bg-warning', thumb: 'bg-warning', text: 'text-warning' }
}

const bgClass = computed(() => colorMap[props.color].bg)
const trackClass = computed(() => colorMap[props.color].track)
const thumbClass = computed(() => colorMap[props.color].thumb)
const textClass = computed(() => colorMap[props.color].text)

function getProgress(clientX: number) {
  if (!trackRef.value) return 0
  const rect = trackRef.value.getBoundingClientRect()
  const thumbSize = 48
  const maxTravel = rect.width - thumbSize
  const x = clientX - rect.left - thumbSize / 2
  return Math.min(1, Math.max(0, x / maxTravel))
}

function onPointerDown(e: PointerEvent) {
  if (confirmed.value) return
  dragging.value = true
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
}

function onPointerMove(e: PointerEvent) {
  if (!dragging.value || confirmed.value) return
  progress.value = getProgress(e.clientX)
}

function onPointerUp() {
  if (!dragging.value) return
  dragging.value = false
  if (progress.value >= props.threshold) {
    confirmed.value = true
    progress.value = 1
    emit('confirmed')
  } else {
    progress.value = 0
  }
}

function reset() {
  confirmed.value = false
  progress.value = 0
}

defineExpose({ reset })
</script>

<template>
  <div
    ref="trackRef"
    class="relative h-14 rounded-full overflow-hidden select-none touch-none"
    :class="[bgClass, confirmed ? '' : 'cursor-grab']"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <!-- Progress fill -->
    <div
      class="absolute inset-y-0 left-0 rounded-full opacity-20 transition-[width]"
      :class="[trackClass, dragging ? 'duration-0' : 'duration-300']"
      :style="{ width: `${progress * 100}%` }"
    />

    <!-- Label -->
    <div
      class="absolute inset-0 flex items-center justify-center text-sm font-medium pointer-events-none transition-opacity duration-200"
      :class="textClass"
      :style="{ opacity: confirmed ? 0 : 1 - progress * 1.5 }"
    >
      <UIcon :name="icon" class="size-4 mr-1.5 animate-pulse" />
      {{ label }}
    </div>

    <!-- Confirmed label -->
    <div
      class="absolute inset-0 flex items-center justify-center text-sm font-semibold pointer-events-none transition-opacity duration-300"
      :class="textClass"
      :style="{ opacity: confirmed ? 1 : 0 }"
    >
      <UIcon :name="confirmedIcon" class="size-5 mr-1.5" />
      {{ confirmedLabel }}
    </div>

    <!-- Thumb -->
    <div
      class="absolute top-1 bottom-1 w-12 rounded-full flex items-center justify-center text-white shadow-lg transition-[left]"
      :class="[
        thumbClass,
        dragging ? 'duration-0 scale-105' : 'duration-300',
        confirmed ? 'opacity-0' : 'opacity-100'
      ]"
      :style="{ left: `${4 + progress * (100 - 14)}%` }"
      style="transform-origin: center"
    >
      <UIcon :name="icon" class="size-5" />
    </div>
  </div>
</template>
