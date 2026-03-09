<script setup lang="ts">
import type { SalesActivity, SalesActivityType } from '~/types'
import { useActivitiesStore } from '~/stores/activities'

const store = useActivitiesStore()

const selectedDate = ref(new Date().toISOString().slice(0, 10))
const groupBy = ref<'customer' | 'salesperson'>('customer')

const groupByOptions = [
  { label: '顧客別', value: 'customer' },
  { label: '営業担当別', value: 'salesperson' }
]

const typeLabelMap: Record<SalesActivityType, string> = {
  visit: '訪問',
  phone: '電話',
  email: 'メール',
  meeting: '会議',
  other: 'その他'
}
const typeIconMap: Record<SalesActivityType, string> = {
  visit: 'i-lucide-footprints',
  phone: 'i-lucide-phone',
  email: 'i-lucide-mail',
  meeting: 'i-lucide-users',
  other: 'i-lucide-circle-dot'
}

onMounted(() => {
  fetchByDate()
})

watch(selectedDate, () => {
  fetchByDate()
})

async function fetchByDate() {
  await store.fetchActivities({ activityDate: selectedDate.value })
}

const grouped = computed(() => {
  const activities = store.activities
  const map = new Map<string, { label: string, items: SalesActivity[] }>()

  for (const a of activities) {
    const key = groupBy.value === 'customer' ? a.customerId : a.assignedTo
    const label = groupBy.value === 'customer' ? a.customerName : a.assignedToName

    if (!map.has(key)) {
      map.set(key, { label, items: [] })
    }
    map.get(key)!.items.push(a)
  }

  return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label, 'ja'))
})
</script>

<template>
  <UDashboardPanel>
    <div class="p-4 space-y-4">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 class="text-lg font-semibold">
          日報
        </h2>
        <div class="flex items-center gap-3">
          <UInput
            v-model="selectedDate"
            type="date"
            class="w-44"
          />
          <USelectMenu
            v-model="groupBy"
            :items="groupByOptions"
            value-key="value"
            class="w-36"
          />
        </div>
      </div>

      <!-- Loading -->
      <div v-if="store.loading" class="flex justify-center py-20">
        <UIcon name="i-lucide-loader-circle" class="w-8 h-8 animate-spin text-muted" />
      </div>

      <!-- Empty state -->
      <div v-else-if="!grouped.length" class="text-center py-20">
        <UIcon name="i-lucide-calendar-x" class="w-12 h-12 text-muted mx-auto mb-3" />
        <p class="text-muted text-sm">
          {{ selectedDate }} の活動記録はありません
        </p>
      </div>

      <!-- Grouped activities -->
      <div v-else class="space-y-6">
        <div
          v-for="group in grouped"
          :key="group.label"
          class="space-y-2"
        >
          <h3 class="text-sm font-semibold text-muted flex items-center gap-2">
            <UIcon :name="groupBy === 'customer' ? 'i-lucide-building-2' : 'i-lucide-user'" class="size-4" />
            {{ group.label }}
            <UBadge
              :label="String(group.items.length)"
              color="neutral"
              variant="subtle"
              size="sm"
            />
          </h3>

          <div class="space-y-0 ml-2 border-l-2 border-default pl-4">
            <div
              v-for="item in group.items"
              :key="item.id"
              class="flex items-start gap-3 py-2.5 cursor-pointer hover:bg-elevated/50 rounded-md px-2 -ml-2 transition-colors"
              @click="navigateTo(`/activities/d/${item.id}`)"
            >
              <UIcon :name="typeIconMap[item.type]" class="size-4 mt-0.5 text-muted shrink-0" />
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium truncate">{{ item.title }}</span>
                  <UBadge
                    :label="typeLabelMap[item.type]"
                    color="neutral"
                    variant="subtle"
                    size="xs"
                  />
                </div>
                <p v-if="item.description" class="text-xs text-muted mt-0.5 line-clamp-2">
                  {{ item.description }}
                </p>
                <p class="text-xs text-muted mt-0.5">
                  <template v-if="groupBy === 'customer'">
                    担当: {{ item.assignedToName }}
                  </template>
                  <template v-else>
                    顧客: {{ item.customerName }}
                  </template>
                </p>
              </div>
              <UIcon name="i-lucide-chevron-right" class="size-4 text-muted shrink-0 mt-0.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </UDashboardPanel>
</template>
