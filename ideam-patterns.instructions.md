---
applyTo: '**.vue,**.ts'
---

# IDEAM Component Patterns & Best Practices

## File Organization & Structure

### Page vs Component Distinction
- **Pages** (`/app/pages/`) — Full-page containers, handle routing, compose multiple components
  - Usually start with data fetch (`useFetch`, `useAsyncData`)
  - Include main layout + sidebar/header references
  - Example: [app/pages/customers.vue](app/pages/customers.vue)

- **Components** (`/app/components/`) — Reusable, composable UI pieces, accept props/emit events
  - Usually receive data via props
  - Example: [app/components/home/HomeSales.vue](app/components/home/HomeSales.vue)

### Module-Based Organization
```
/app
├── pages/
│   ├── customers.vue              # Customer search page
│   ├── manufacturers.vue           # Manufacturer search page (to create)
│   ├── projects.vue               # Project/case search page (to create)
│   └── ...
├── components/
│   ├── customers/
│   │   ├── AddModal.vue           # Create customer modal
│   │   ├── DeleteModal.vue        # Delete confirmation
│   │   ├── CustomerTimeline.vue   # Interaction history (to create)
│   │   └── ...
│   ├── manufacturers/             # (to create)
│   │   ├── AddModal.vue
│   │   └── ...
│   ├── projects/                  # (to create)
│   │   ├── AddModal.vue
│   │   ├── EditModal.vue
│   │   ├── ProjectTimeline.vue
│   │   └── ...
│   └── home/
│       ├── HomeSales.vue
│       └── ...
├── composables/
│   ├── useDashboard.ts            # Shared dashboard state
│   ├── useFormValidation.ts       # Form validation composable (to create)
│   └── useCustomerData.ts         # Entity-specific fetching (to create)
└── types/
    └── index.d.ts                 # All TypeScript interfaces
```

## Script Setup Pattern

### Standard Vue Component Header
```typescript
<script setup lang="ts">
// Imports: component resolve, types, composables, utilities
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Customer, Contact } from '~/types'
import { useRouter } from 'vue-router'
import { useToast } from '#ui/composables/useToast'

// Props definition (optional)
const props = withDefaults(
  defineProps<{
    customerId?: number
    isEditable?: boolean
  }>(),
  {
    isEditable: false
  }
)

// Resolved components (for lazy loading)
const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')

// Router
const router = useRouter()

// Composables
const toast = useToast()

// Local reactive state
const columnFilters = ref([{ id: 'name', value: '' }])
const columnVisibility = ref()
const rowSelection = ref({})

// Data fetching
const { data, status, error } = await useFetch<Customer[]>('/api/customers', {
  lazy: true
})

// Computed
const isLoading = computed(() => status.value === 'pending')

// Table columns definition
const columns: TableColumn<Customer>[] = [...]

// Methods
function handleRowAction(action: string, row: Customer) { ... }
</script>
```

### Key Guidelines

1. **Always use `<script setup lang="ts">`** — Modern Vue 3 style, better DX
2. **Resolve UI components explicitly** — Enables tree-shaking and lazy loading
   ```typescript
   const UButton = resolveComponent('UButton')
   const UCheckbox = resolveComponent('UCheckbox')
   ```
3. **Import types** — Keep type imports separate for readability
   ```typescript
   import type { Customer, TableColumn } from '~/types'
   ```
4. **Group logic clearly** — Props → composables → state → fetching → computed → methods
5. **Use `ref`, `computed`** — Reactive state management
6. **Use `withDefaults`** for props with defaults
7. **Use `const router = useRouter()`** for navigation

### Example Minimal Component
```typescript
<script setup lang="ts">
import type { User } from '~/types'

const props = defineProps<{ user: User }>()
const emit = defineEmits<{ update: [id: number] }>()

const handleClick = () => {
  emit('update', props.user.id)
}
</script>

<template>
  <div class="flex items-center gap-2">
    <span>{{ props.user.name }}</span>
    <button @click="handleClick">Update</button>
  </div>
</template>
```

## Template & Styling Pattern

### Standard Layout Structure
```vue
<template>
  <!-- Container with standard spacing -->
  <div class="space-y-6">
    <!-- Header section -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Customers</h1>
      <button class="...">Add New</button>
    </div>

    <!-- Filters/Search section -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <input v-model="searchTerm" placeholder="Search..." />
      <select v-model="selectedTag">
        <option value="">All Tags</option>
        <!-- options -->
      </select>
    </div>

    <!-- Main content (table, list, cards) -->
    <component :is="contentType" :data="filteredData" />

    <!-- Modals/sideovers -->
    <Modal
      v-if="isModalOpen"
      :item="selectedItem"
      @update:open="isModalOpen = $event"
      @submit="handleSubmit"
    />
  </div>
</template>
```

### Tailwind Spacing Convention
- **Outer container**: `space-y-6` (vertical gap between sections)
- **Section internal gaps**: `space-y-4` (between related items)
- **Grid layouts**: `grid gap-4 sm:grid-cols-2 lg:grid-cols-3`
- **Flex alignment**: `flex items-center justify-between`
- **Padding**: `px-4 py-2` (buttons), `px-6 py-4` (cards)

### Responsive Classes
- Mobile-first: no prefix = mobile, `sm:` = 640px+, `lg:` = 1024px+
- Example: `w-full sm:w-1/2 lg:w-1/3`

### Icon Classes
All icons use Lucide via Tailwind classes:
```vue
<button class="i-lucide-plus">Add</button>
<span class="i-lucide-check text-green-500"></span>
<button class="i-lucide-trash text-red-500">Delete</button>
```

Common icons:
- `i-lucide-plus`, `i-lucide-minus`, `i-lucide-edit`, `i-lucide-trash`, `i-lucide-copy`
- `i-lucide-eye`, `i-lucide-eye-off`, `i-lucide-check`, `i-lucide-x`
- `i-lucide-list`, `i-lucide-grid`, `i-lucide-calendar`, `i-lucide-mail`

## Table Pattern (@tanstack/table-core + @nuxt/ui)

### Table Column Definition
```typescript
import type { TableColumn } from '@nuxt/ui'
import { h, resolveComponent } from 'vue'
import type { Customer } from '~/types'

const UBadge = resolveComponent('UBadge')

const columns: TableColumn<Customer>[] = [
  {
    accessorKey: 'id',
    header: 'Customer ID',
    cell: ({ row }) => `#${row.getValue('id')}`
  },
  {
    accessorKey: 'name',
    header: 'Customer Name'
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return h(UBadge, {
        color: status === 'active' ? 'green' : 'gray',
        label: status
      })
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => h('button', {
      class: 'i-lucide-more-horizontal'
    })
  }
]
```

### Table with Filters + Pagination
```typescript
const columnFilters = ref([
  { id: 'name', value: '' },
  { id: 'status', value: '' }
])
const columnVisibility = ref({})
const rowSelection = ref({})

const { data } = await useFetch<Customer[]>('/api/customers', { lazy: true })

// Apply filters (client-side example)
const filteredData = computed(() => {
  return data.value?.filter(item => {
    return columnFilters.value.every(filter => {
      if (!filter.value) return true
      return String(item[filter.id as keyof Customer])
        .toLowerCase()
        .includes(String(filter.value).toLowerCase())
    })
  }) ?? []
})
```

### Table in Template
```vue
<UTable
  :columns="columns"
  :rows="filteredData"
  :loading="status === 'pending'"
>
  <template #id-data="{ row }">
    #{{ row.id }}
  </template>
  <template #actions-data="{ row }">
    <UDropdownMenu :items="getRowItems(row)" />
  </template>
</UTable>
```

## Modal/Form Pattern

### Modal Component Structure
```typescript
<script setup lang="ts">
import type { Customer } from '~/types'

const props = defineProps<{
  isOpen: boolean
  item?: Customer
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  submit: [data: Customer]
}>()

const isEditMode = computed(() => !!props.item)

const formData = ref<Customer>(props.item || { name: '', email: '' })

const handleSubmit = async () => {
  // Validate
  // API call
  emit('submit', formData.value)
  emit('update:open', false)
}

const handleCancel = () => {
  formData.value = props.item || { name: '', email: '' }
  emit('update:open', false)
}
</script>

<template>
  <UModal v-model="isOpen" :title="isEditMode ? 'Edit' : 'Create' Customer">
    <!-- Form fields -->
    <div class="space-y-4">
      <div>
        <label class="text-sm font-medium">Name</label>
        <UInput v-model="formData.name" placeholder="Customer name" />
      </div>
      <!-- more fields -->
    </div>

    <!-- Actions -->
    <template #footer>
      <div class="flex gap-2 justify-end">
        <UButton color="gray" @click="handleCancel">Cancel</UButton>
        <UButton @click="handleSubmit">{{ isEditMode ? 'Update' : 'Create' }}</UButton>
      </div>
    </template>
  </UModal>
</template>
```

### Modal Usage in Page
```typescript
const isAddModalOpen = ref(false)
const selectedCustomer = ref<Customer | undefined>()

function handleAddClick() {
  selectedCustomer.value = undefined
  isAddModalOpen.value = true
}

function handleEditClick(customer: Customer) {
  selectedCustomer.value = customer
  isAddModalOpen.value = true
}

function handleModalSubmit(data: Customer) {
  // Call API to create/update
  // Refresh data
  // Show toast
  toast.add({ title: 'Saved!' })
}
```

## Composable Pattern

### Shared State Composable
```typescript
// /app/composables/useDashboard.ts
import { createSharedComposable } from '@vueuse/core'

const _useDashboard = () => {
  const route = useRoute()
  const router = useRouter()
  const isNotificationsSlideoverOpen = ref(false)

  defineShortcuts({
    'g-c': () => router.push('/customers'),
    'g-m': () => router.push('/manufacturers'),
    'g-p': () => router.push('/projects'),
    'n': () => isNotificationsSlideoverOpen.value = !isNotificationsSlideoverOpen.value
  })

  return {
    isNotificationsSlideoverOpen,
    // ... other shared state
  }
}

export const useDashboard = createSharedComposable(_useDashboard)
```

### Data Fetching Composable
```typescript
// /app/composables/useCustomerData.ts
export const useCustomerData = () => {
  const { data, status, error, refresh } = useFetch<Customer[]>(
    '/api/customers',
    { lazy: true }
  )

  const add = async (customer: Omit<Customer, 'id'>) => {
    const result = await $fetch('/api/customers', {
      method: 'POST',
      body: customer
    })
    await refresh()
    return result
  }

  const update = async (id: number, customer: Partial<Customer>) => {
    const result = await $fetch(`/api/customers/${id}`, {
      method: 'PUT',
      body: customer
    })
    await refresh()
    return result
  }

  const delete_ = async (id: number) => {
    await $fetch(`/api/customers/${id}`, { method: 'DELETE' })
    await refresh()
  }

  return {
    data,
    status,
    error,
    refresh,
    add,
    update,
    delete: delete_
  }
}
```

## API Route Pattern

### Standard CRUD Routes
```typescript
// /server/api/customers.ts
export default defineEventHandler(async (event) => {
  const method = getHeader(event, 'method')

  if (method === 'GET') {
    return getCustomers()
  }
  if (method === 'POST') {
    const body = await readBody(event)
    return createCustomer(body)
  }
})

// /server/api/customers/[id].ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const method = getHeader(event, 'method')

  if (method === 'GET') {
    return getCustomer(parseInt(id!))
  }
  if (method === 'PUT') {
    const body = await readBody(event)
    return updateCustomer(parseInt(id!), body)
  }
  if (method === 'DELETE') {
    return deleteCustomer(parseInt(id!))
  }
})
```

### Reference Implementation
See existing routes:
- [server/api/customers.ts](server/api/customers.ts)
- [server/api/mails.ts](server/api/mails.ts)
- [server/api/members.ts](server/api/members.ts)

## Notification Pattern (Toast)

```typescript
const toast = useToast()

// Success
toast.add({
  title: 'Success',
  description: 'Customer created successfully',
  color: 'green',
  icon: 'i-lucide-check'
})

// Error
toast.add({
  title: 'Error',
  description: 'Failed to save customer',
  color: 'red',
  icon: 'i-lucide-x'
})

// Info
toast.add({
  title: 'Info',
  description: 'Changes will be saved automatically',
  color: 'blue'
})
```

## State Management (Shared)

For pages that need to sync with navigation or other modules:
- Use `useDashboard()` for dashboard-level state (notifications, modals, navigation)
- Use `useRoute()` / `useRouter()` for route-based state
- Use `ref()` / `computed()` for component-level state
- Create custom composables for entity-specific data

**Avoid**: Pinia/global state management (not used in this project)

## Best Practices Checklist

- ✅ Use `<script setup lang="ts">` with explicit imports
- ✅ Resolve UI components explicitly (`resolveComponent`)
- ✅ Separate concerns: template, script, styles
- ✅ Use `computed()` for derived state, not `watch()`
- ✅ Props with defaults use `withDefaults()`
- ✅ Emit events clearly with `defineEmits`
- ✅ Keep components focused (single responsibility)
- ✅ Lazy-load data with `useFetch` + `lazy: true`
- ✅ Show loading state from `status === 'pending'`
- ✅ Provide user feedback with toast notifications
- ✅ Handle errors gracefully (show error toast, no red console logs)
- ✅ Use TailwindCSS for all styling (no `<style>` blocks)
- ✅ Follow module-based folder organization
- ✅ Use TypeScript types from `~/types/index.d.ts`
