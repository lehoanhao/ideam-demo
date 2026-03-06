<script setup lang="ts">
const route = useRoute()

interface BreadcrumbItem {
  label: string
  to?: string
}

const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  const path = route.path.split('/').filter(Boolean)
  const items: BreadcrumbItem[] = [
    { label: 'Dashboard', to: '/' }
  ]

  let currentPath = ''
  for (const segment of path) {
    currentPath += `/${segment}`
    const label = segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    items.push({
      label,
      to: currentPath
    })
  }

  return items
})
</script>

<template>
  <nav class="flex items-center space-x-2 text-sm">
    <template v-for="(item, index) in breadcrumbs" :key="item.label">
      <UButton
        v-if="item.to"
        :to="item.to"
        variant="ghost"
        color="gray"
        class="px-1 py-0"
      >
        {{ item.label }}
      </UButton>
      <span v-else class="text-gray-500 dark:text-gray-400">
        {{ item.label }}
      </span>

      <UIcon
        v-if="index < breadcrumbs.length - 1"
        name="i-lucide-chevron-right"
        class="w-4 h-4 text-gray-400"
      />
    </template>
  </nav>
</template>
