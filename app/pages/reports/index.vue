<script setup lang="ts">
import type { DailyReport, SalesActivityType } from '~/types'
import { generateDailyReport } from '~/utils/mock-data'

const reportDate = ref(new Date().toISOString().slice(0, 10))
const groupBy = ref<'salesperson' | 'customer'>('salesperson')
const report = ref<DailyReport | null>(null)
const loading = ref(false)

const groupByOptions = [
  { label: '営業担当別', value: 'salesperson' },
  { label: '顧客別', value: 'customer' }
]

const typeLabelMap: Record<SalesActivityType, string> = {
  visit: '訪問',
  phone: '電話',
  email: 'メール',
  meeting: '会議',
  other: 'その他'
}
const typeIconMap: Record<SalesActivityType, string> = {
  visit: 'i-lucide-map-pin',
  phone: 'i-lucide-phone',
  email: 'i-lucide-mail',
  meeting: 'i-lucide-users',
  other: 'i-lucide-circle-dot'
}

async function fetchReport() {
  loading.value = true
  try {
    report.value = generateDailyReport(reportDate.value, groupBy.value)
  } finally {
    loading.value = false
  }
}

onMounted(fetchReport)
watch([reportDate, groupBy], fetchReport)

const totalEntries = computed(() => {
  if (!report.value) return 0
  return report.value.groups.reduce((sum, g) => sum + g.entries.length, 0)
})
function handlePrint() {
  if (import.meta.client) {
    window.print()
  }
}
</script>

<template>
  <UDashboardPanel>
    <UDashboardNavbar title="日報">
      <template #right>
        <UButton
          label="印刷"
          icon="i-lucide-printer"
          variant="outline"
          color="neutral"
          @click="handlePrint"
        />
      </template>
    </UDashboardNavbar>

    <UDashboardToolbar>
      <template #left>
        <UInput v-model="reportDate" type="date" class="w-44" />
        <USelectMenu
          v-model="groupBy"
          :items="groupByOptions"
          value-key="value"
          class="w-40"
        />
      </template>
      <template #right>
        <span class="text-sm text-muted">合計 {{ totalEntries }}件</span>
      </template>
    </UDashboardToolbar>

    <div class="p-6 space-y-6 overflow-y-auto">
      <div v-if="loading" class="text-center py-12">
        <UIcon name="i-lucide-loader-2" class="animate-spin text-2xl text-muted" />
      </div>

      <div v-else-if="report && report.groups.length">
        <div v-for="group in report.groups" :key="group.key" class="mb-6">
          <div class="flex items-center gap-2 mb-3 pb-2 border-b border-default">
            <UIcon :name="groupBy === 'salesperson' ? 'i-lucide-user' : 'i-lucide-building'" class="text-muted" />
            <h3 class="font-semibold text-base">
              {{ group.label }}
            </h3>
            <UBadge variant="subtle" color="neutral" size="sm">
              {{ group.entries.length }}件
            </UBadge>
          </div>

          <div class="space-y-3">
            <div v-for="entry in group.entries" :key="entry.activityId" class="flex gap-3 p-3 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors">
              <div class="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                <UIcon :name="typeIconMap[entry.type]" class="text-sm" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <NuxtLink :to="`/activities/${entry.activityId}`" class="text-sm font-medium text-primary hover:underline">
                    {{ entry.title }}
                  </NuxtLink>
                  <UBadge variant="outline" size="xs" color="neutral">
                    {{ typeLabelMap[entry.type] }}
                  </UBadge>
                </div>
                <div class="text-xs text-muted mt-1">
                  <span v-if="groupBy === 'salesperson'">顧客: {{ entry.customerName }}</span>
                  <span v-else>担当: {{ entry.assignedToName }}</span>
                </div>
                <p v-if="entry.description" class="text-sm text-muted mt-1 line-clamp-2">
                  {{ entry.description }}
                </p>
              </div>
              <div class="text-xs text-muted whitespace-nowrap">
                {{ entry.activityCode }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12 text-muted">
        <UIcon name="i-lucide-file-x" class="text-4xl mb-2" />
        <p>該当する活動データがありません</p>
      </div>
    </div>
  </UDashboardPanel>
</template>
