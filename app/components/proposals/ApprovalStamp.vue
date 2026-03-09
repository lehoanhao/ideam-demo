<script setup lang="ts">
const props = defineProps<{
  approvedBy?: string
  approvalDate?: string
}>()

const displayDate = computed(() => {
  if (!props.approvalDate) return ''
  const d = new Date(props.approvalDate)
  const y = d.getFullYear()
  const m = d.getMonth() + 1
  const day = d.getDate()
  return `${y}.${m}.${day}`
})
</script>

<template>
  <div class="inline-flex flex-col items-center gap-1">
    <svg
      class="stamp-svg"
      :title="`承認: ${approvedBy ?? ''} ${displayDate}`"
      width="72"
      height="72"
      viewBox="0 0 72 72"
    >
      <!-- Outer circle with irregular dashed stroke for realistic stamp look -->
      <circle
        cx="36"
        cy="36"
        r="33"
        fill="rgba(255,255,255,0.85)"
        stroke="#c53030"
        stroke-width="2.5"
        stroke-dasharray="5 1.5 3 2 7 1 4 2.5"
        stroke-linecap="round"
      />
      <!-- Top divider -->
      <line
        x1="14"
        y1="25"
        x2="58"
        y2="25"
        stroke="#c53030"
        stroke-width="1.2"
        stroke-dasharray="6 2 3 1.5"
        stroke-linecap="round"
      />
      <!-- Bottom divider -->
      <line
        x1="14"
        y1="43"
        x2="58"
        y2="43"
        stroke="#c53030"
        stroke-width="1.2"
        stroke-dasharray="5 1.5 4 2"
        stroke-linecap="round"
      />
      <!-- 承認 text -->
      <text
        x="36"
        y="21"
        text-anchor="middle"
        fill="#c53030"
        font-size="13"
        font-weight="900"
        font-family="'Yu Mincho','Hiragino Mincho Pro','MS Mincho',serif"
        letter-spacing="3"
      >
        承認
      </text>
      <!-- Date -->
      <text
        x="36"
        y="37"
        text-anchor="middle"
        fill="#c53030"
        font-size="8.5"
        font-weight="600"
        font-family="'Yu Mincho','Hiragino Mincho Pro','MS Mincho',serif"
      >
        {{ displayDate }}
      </text>
      <!-- Name -->
      <text
        x="36"
        y="55"
        text-anchor="middle"
        fill="#c53030"
        font-size="12"
        font-weight="900"
        font-family="'Yu Mincho','Hiragino Mincho Pro','MS Mincho',serif"
        letter-spacing="1"
      >
        {{ approvedBy ?? '' }}
      </text>
    </svg>
  </div>
</template>

<style scoped>
.stamp-svg {
  user-select: none;
  opacity: 0.82;
  transform: rotate(-8deg);
  filter: url(#stamp-noise) saturate(0.9);
}
</style>
