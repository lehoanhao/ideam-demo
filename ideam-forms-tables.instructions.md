---
applyTo: '**.vue'
---

# IDEAM Forms, Tables & Modals Guidelines

## Form Layout & Structure

### Standard Form Section Pattern
```vue
<div class="space-y-6">
  <!-- Header -->
  <div class="border-b border-gray-200 pb-4">
    <h2 class="text-lg font-semibold">Customer Information</h2>
    <p class="text-sm text-gray-600">Basic details about the customer</p>
  </div>

  <!-- Form fields -->
  <div class="space-y-4">
    <!-- Single field -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Customer Name
        <span class="text-red-500">*</span>
      </label>
      <UInput
        v-model="formData.name"
        placeholder="Enter customer name"
        @blur="validateField('name')"
      />
      <p v-if="errors.name" class="mt-1 text-sm text-red-500">
        {{ errors.name }}
      </p>
    </div>

    <!-- Multiple in row -->
    <div class="grid gap-4 sm:grid-cols-2">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">ID</label>
        <UInput v-model="formData.customerId" placeholder="Auto-generated" disabled />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <USelect v-model="formData.status" :options="statusOptions" />
      </div>
    </div>

    <!-- Textarea -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
      <UTextarea
        v-model="formData.description"
        placeholder="Add notes about this customer..."
        rows="4"
      />
    </div>

    <!-- Tags/Multi-select -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Tags</label>
      <USelect
        v-model="formData.tags"
        :options="availableTags"
        multiple
        placeholder="Select tags..."
      />
    </div>
  </div>
</div>
```

### Form Validation Error Display
```vue
<script setup lang="ts">
const errors = ref<Record<string, string>>({})
const touched = ref<Set<string>>(new Set())

const hasError = (field: string) => touched.value.has(field) && !!errors.value[field]

const validateField = (field: string) => {
  touched.value.add(field)
  // Validation logic
}

const showError = (field: string) => {
  return hasError(field)
}
</script>

<template>
  <!-- Inline error (only show after blur/touched) -->
  <div class="space-y-1">
    <label class="block text-sm font-medium">Email</label>
    <UInput
      v-model="formData.email"
      :class="{ 'border-red-500': showError('email') }"
      @blur="validateField('email')"
    />
    <p v-if="showError('email')" class="text-sm text-red-500">
      {{ errors.email }}
    </p>
  </div>
</template>
```

### Form with Dynamic Array Fields (Contacts, Owners, etc.)

```vue
<script setup lang="ts">
const formData = ref({
  name: '',
  contacts: [
    { type: 'email', value: '', isPrimary: true }
  ],
  salesOwners: []
})

const addContact = () => {
  formData.value.contacts.push({
    type: 'phone',
    value: '',
    isPrimary: false
  })
}

const removeContact = (index: number) => {
  formData.value.contacts.splice(index, 1)
}
</script>

<template>
  <!-- Array section -->
  <div class="border-t border-gray-200 pt-6 mt-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-semibold">Contact Information</h3>
      <button
        @click="addContact"
        class="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
      >
        <span class="i-lucide-plus w-4 h-4"></span>
        Add Contact
      </button>
    </div>

    <div class="space-y-4">
      <div v-for="(contact, idx) in formData.contacts" :key="idx" class="relative">
        <!-- Remove button (top-right corner) -->
        <button
          v-if="formData.contacts.length > 1"
          @click="removeContact(idx)"
          class="absolute top-0 right-0 text-red-500 hover:text-red-700"
          title="Remove contact"
        >
          <span class="i-lucide-x w-4 h-4"></span>
        </button>

        <!-- Contact fields -->
        <div class="grid gap-4 sm:grid-cols-3 pr-8">
          <!-- Type -->
          <div>
            <label class="block text-sm font-medium mb-1">Type</label>
            <USelect
              v-model="contact.type"
              :options="['email', 'phone', 'fax']"
            />
          </div>

          <!-- Value -->
          <div>
            <label class="block text-sm font-medium mb-1">Value</label>
            <UInput
              v-model="contact.value"
              :placeholder="`Enter ${contact.type}...`"
            />
          </div>

          <!-- Primary checkbox -->
          <div class="flex items-end">
            <label class="flex items-center gap-2 cursor-pointer">
              <UCheckbox v-model="contact.isPrimary" />
              <span class="text-sm">Primary</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
```

### Form Submit & Reset
```vue
<script setup lang="ts">
const emit = defineEmits<{
  'update:open': [value: boolean]
  submit: [data: any]
}>()

const toast = useToast()

const handleSubmit = async () => {
  if (!validateAll()) {
    toast.add({
      title: 'Validation Error',
      description: 'Please fix errors before saving',
      color: 'red'
    })
    return
  }

  try {
    const response = await $fetch('/api/customers', {
      method: props.item ? 'PUT' : 'POST',
      body: formData.value
    })
    
    emit('submit', response)
    toast.add({ title: 'Saved successfully!' })
    emit('update:open', false)
  } catch (error) {
    toast.add({
      title: 'Error',
      description: error.data?.statusMessage || 'Failed to save',
      color: 'red'
    })
  }
}

const handleCancel = () => {
  resetForm()
  emit('update:open', false)
}
</script>

<template>
  <div class="flex gap-2 justify-end pt-6 border-t border-gray-200 mt-6">
    <UButton
      color="gray"
      variant="soft"
      @click="handleCancel"
    >
      Cancel
    </UButton>
    <UButton
      :loading="isSubmitting"
      @click="handleSubmit"
    >
      {{ props.item ? 'Update' : 'Create' }}
    </UButton>
  </div>
</template>
```

## Table Display & Interaction

### Basic Table Structure
```vue
<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Customer } from '~/types'

const UCheckbox = resolveComponent('UCheckbox')
const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')

const columns: TableColumn<Customer>[] = [
  {
    id: 'select',
    header: ({ table }) => h(UCheckbox, {
      checked: table.getIsAllRowsSelected()
    }),
    cell: ({ row }) => h(UCheckbox, {
      checked: row.getIsSelected(),
      onChange: row.toggleSelected
    }),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'customerId',
    header: 'Customer ID',
    cell: ({ row }) => `#${row.original.customerId}`
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => row.original.name
  },
  {
    accessorKey: 'tags',
    header: 'Tags',
    cell: ({ row }) => {
      const tags = row.original.tags
      return h('div', { class: 'flex gap-1 flex-wrap' }, [
        ...tags.map(tag => h(UBadge, {
          color: 'blue',
          label: tag,
          key: tag
        }))
      ])
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }),
    enableHiding: false
  }
]
</script>

<template>
  <div class="rounded-lg border border-gray-200 overflow-hidden">
    <UTable
      :columns="columns"
      :rows="data"
      :loading="isLoading"
    >
      <template #actions-data="{ row }">
        <UDropdownMenu :items="getRowItems(row)" />
      </template>
    </UTable>
  </div>
</template>
```

### Table with Search & Filters
```vue
<script setup lang="ts">
const searchTerm = ref('')
const selectedTag = ref('')

// Client-side filtering
const filteredData = computed(() => {
  return data.value?.filter(item => {
    const matchesSearch = searchTerm.value === '' || 
      item.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    const matchesTag = selectedTag.value === '' || 
      item.tags.includes(selectedTag.value)
    return matchesSearch && matchesTag
  }) ?? []
})

// Or server-side filtering
const fetchData = async () => {
  const query: Record<string, any> = {}
  if (searchTerm.value) query.search = searchTerm.value
  if (selectedTag.value) query.tag = selectedTag.value
  
  const { data } = await useFetch('/api/customers', { query })
}

watch([searchTerm, selectedTag], () => {
  fetchData()
})
</script>

<template>
  <!-- Filter/Search Bar -->
  <div class="flex gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
    <div class="flex-1">
      <UInput
        v-model="searchTerm"
        placeholder="Search customers..."
        icon="i-lucide-search"
      />
    </div>
    <div class="w-40">
      <USelect
        v-model="selectedTag"
        :options="availableTags"
        placeholder="Filter by tag..."
      />
    </div>
  </div>

  <!-- Table -->
  <UTable :columns="columns" :rows="filteredData" />
</template>
```

### Table with Pagination
```vue
<script setup lang="ts">
import { getPaginationRowModel } from '@tanstack/table-core'

const pageSize = ref(20)
const pageIndex = ref(0)

const paginated = computed(() => {
  const start = pageIndex.value * pageSize.value
  return filteredData.value.slice(start, start + pageSize.value)
})

const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / pageSize.value)
})

const handlePreviousPage = () => {
  if (pageIndex.value > 0) pageIndex.value--
}

const handleNextPage = () => {
  if (pageIndex.value < totalPages.value - 1) pageIndex.value++
}
</script>

<template>
  <div class="space-y-4">
    <!-- Table -->
    <UTable :columns="columns" :rows="paginated" />

    <!-- Pagination controls -->
    <div class="flex items-center justify-between px-4 py-3 border-t border-gray-200">
      <div class="text-sm text-gray-600">
        Page {{ pageIndex + 1 }} of {{ totalPages }}
        {{ filteredData.length }} total results
      </div>
      <div class="flex gap-2">
        <UButton
          icon="i-lucide-chevron-left"
          color="gray"
          variant="soft"
          :disabled="pageIndex === 0"
          @click="handlePreviousPage"
        >
          Previous
        </UButton>
        <UButton
          icon="i-lucide-chevron-right"
          color="gray"
          variant="soft"
          :disabled="pageIndex >= totalPages - 1"
          @click="handleNextPage"
        >
          Next
        </UButton>
      </div>
    </div>
  </div>
</template>
```

### Table Row Actions Menu
```typescript
function getRowItems(row: Row<Customer>) {
  return [
    {
      type: 'label',
      label: 'Actions'
    },
    {
      label: 'View Details',
      icon: 'i-lucide-eye',
      onSelect() {
        router.push(`/customers/${row.original.id}`)
      }
    },
    {
      label: 'Edit',
      icon: 'i-lucide-edit',
      onSelect() {
        selectedCustomer.value = row.original
        isEditModalOpen.value = true
      }
    },
    {
      label: 'Copy ID',
      icon: 'i-lucide-copy',
      onSelect() {
        navigator.clipboard.writeText(row.original.customerId)
        toast.add({ title: 'Copied!' })
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Delete',
      icon: 'i-lucide-trash',
      color: 'red',
      onSelect() {
        isDeleteModalOpen.value = true
        selectedCustomer.value = row.original
      }
    }
  ]
}
```

## Modal & Slideover Patterns

### Basic Modal (Create/Edit Form)
```vue
<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean
  item?: Customer
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  submit: [data: Customer]
}>()

const isEditMode = computed(() => !!props.item)

const resetForm = () => {
  formData.value = props.item ? { ...props.item } : {
    name: '',
    tags: [],
    contacts: [{ type: 'email', value: '', isPrimary: true }]
  }
  errors.value = {}
  touched.value.clear()
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) resetForm()
})
</script>

<template>
  <UModal
    v-model="isOpen"
    :title="isEditMode ? 'Edit Customer' : 'New Customer'"
  >
    <!-- Form content -->
    <div class="space-y-4">
      <!-- Form fields here -->
    </div>

    <!-- Modal footer with actions -->
    <template #footer>
      <div class="flex gap-2 justify-end">
        <UButton
          color="gray"
          variant="soft"
          @click="$emit('update:open', false)"
        >
          Cancel
        </UButton>
        <UButton @click="handleSubmit">
          {{ isEditMode ? 'Update' : 'Create' }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
```

### Delete Confirmation Modal
```vue
<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean
  item?: Customer
  isLoading?: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  confirm: []
}>()

const handleDelete = async () => {
  emit('confirm')
}
</script>

<template>
  <UModal v-model="isOpen" title="Delete Customer">
    <div class="space-y-4">
      <p class="text-gray-600">
        Are you sure you want to delete
        <strong>{{ item?.name }}</strong>?
      </p>
      <p class="text-sm text-gray-500">
        This action cannot be undone.
      </p>
    </div>

    <template #footer>
      <div class="flex gap-2 justify-end">
        <UButton
          color="gray"
          variant="soft"
          @click="$emit('update:open', false)"
        >
          Cancel
        </UButton>
        <UButton
          color="red"
          :loading="isLoading"
          @click="handleDelete"
        >
          Delete
        </UButton>
      </div>
    </template>
  </UModal>
</template>
```

### Slideover for Side Panel (Timeline, Details)
```vue
<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean
  item?: Customer
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()
</script>

<template>
  <USlideover v-model="isOpen" title="Customer Details">
    <div class="space-y-6">
      <!-- Customer basic info -->
      <div class="space-y-2">
        <h3 class="font-semibold">Information</h3>
        <div class="text-sm space-y-1">
          <p><span class="text-gray-600">ID:</span> {{ item?.customerId }}</p>
          <p><span class="text-gray-600">Name:</span> {{ item?.name }}</p>
        </div>
      </div>

      <!-- Timeline section -->
      <div class="space-y-2">
        <h3 class="font-semibold">Interaction History</h3>
        <div class="space-y-2">
          <div
            v-for="activity in activities"
            :key="activity.id"
            class="text-sm border-l-2 border-gray-200 pl-3 py-1"
          >
            <p class="text-gray-600">{{ activity.activityType }}</p>
            <p class="text-xs text-gray-400">{{ formatDate(activity.createdAt) }}</p>
            <p>{{ activity.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </USlideover>
</template>
```

## Conditional Fields & Multi-Step Forms

### Conditional Visible Fields (FAX vs Email Form)
```vue
<script setup lang="ts">
const requestType = ref<'fax' | 'email'>('email')

const isFaxRequest = computed(() => requestType.value === 'fax')
const isEmailRequest = computed(() => requestType.value === 'email')

// Schema with conditional validation
const schema = z.object({
  manufacturerId: z.number(),
  requestType: z.enum(['fax', 'email']),
  productId: z.number(),
  quantity: z.number().positive(),
  deadline: z.string(),
  // FAX
  faxNumber: z.string().optional(),
  coverLetter: z.string().optional(),
  // EMAIL
  emailAddress: z.string().email().optional(),
  emailBody: z.string().optional()
}).refine(
  (data) => {
    if (data.requestType === 'fax') {
      return !!data.faxNumber && !!data.coverLetter
    }
    if (data.requestType === 'email') {
      return !!data.emailAddress && !!data.emailBody
    }
    return false
  },
  { message: 'Complete required fields' }
)
</script>

<template>
  <div class="space-y-4">
    <!-- Request type tabs -->
    <div class="flex gap-2 border-b border-gray-200">
      <button
        @click="requestType = 'email'"
        :class="[
          'px-4 py-2 font-medium border-b-2',
          isEmailRequest ? 'border-blue-500' : 'border-transparent'
        ]"
      >
        Email
      </button>
      <button
        @click="requestType = 'fax'"
        :class="[
          'px-4 py-2 font-medium border-b-2',
          isFaxRequest ? 'border-blue-500' : 'border-transparent'
        ]"
      >
        FAX
      </button>
    </div>

    <!-- Common fields -->
    <div class="space-y-4">
      <!-- Manufacturer, product, deadline, etc. -->
    </div>

    <!-- Request type-specific fields -->
    <div v-if="isEmailRequest" class="space-y-4 pt-4 border-t">
      <div>
        <label class="block text-sm font-medium mb-1">Email Address</label>
        <UInput v-model="formData.emailAddress" type="email" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Email Body</label>
        <UTextarea v-model="formData.emailBody" rows="4" />
      </div>
    </div>

    <div v-if="isFaxRequest" class="space-y-4 pt-4 border-t">
      <div>
        <label class="block text-sm font-medium mb-1">FAX Number</label>
        <UInput v-model="formData.faxNumber" placeholder="+81-..." />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Cover Letter</label>
        <UTextarea v-model="formData.coverLetter" rows="4" />
      </div>
    </div>
  </div>
</template>
```

### Multi-Step Wizard
```vue
<script setup lang="ts">
const currentStep = ref(0)

const steps = ['Select Manufacturer', 'Choose Request Type', 'Enter Details', 'Review']

const canProceed = computed(() => {
  // Validate current step before allowing next
  return validateStep(currentStep.value)
})

const handleNext = () => {
  if (canProceed.value && currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

const handlePrevious = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const handleComplete = async () => {
  if (validateAll()) {
    // Submit form
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Progress steps -->
    <div class="flex items-center justify-between">
      <div v-for="(step, idx) in steps" :key="idx" class="flex-1">
        <div
          :class="[
            'flex items-center justify-center h-10 rounded-full text-sm font-medium',
            idx <= currentStep
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-600'
          ]"
        >
          {{ idx + 1 }}
        </div>
        <p v-if="idx < steps.length - 1" class="text-xs text-gray-600 text-center mt-1">
          {{ step }}
        </p>
      </div>
    </div>

    <!-- Step content -->
    <div class="min-h-64 py-4">
      <!-- Step 0: Select manufacturer -->
      <div v-if="currentStep === 0" class="space-y-4">
        <h3 class="font-semibold">Select Manufacturer</h3>
        <!-- Manufacturer selection form -->
      </div>

      <!-- Step 1: Request type -->
      <div v-if="currentStep === 1" class="space-y-4">
        <h3 class="font-semibold">How do you want to send the request?</h3>
        <!-- FAX/Email radio buttons or tabs -->
      </div>

      <!-- Step 2: Details -->
      <div v-if="currentStep === 2" class="space-y-4">
        <h3 class="font-semibold">Enter Request Details</h3>
        <!-- Type-specific fields -->
      </div>

      <!-- Step 3: Review -->
      <div v-if="currentStep === 3" class="space-y-4">
        <h3 class="font-semibold">Review & Confirm</h3>
        <!-- Summary of all entered data -->
      </div>
    </div>

    <!-- Navigation -->
    <div class="flex gap-2 justify-between border-t pt-4">
      <UButton
        color="gray"
        variant="soft"
        :disabled="currentStep === 0"
        @click="handlePrevious"
      >
        Previous
      </UButton>
      <div class="flex gap-2">
        <UButton
          v-if="currentStep < steps.length - 1"
          :disabled="!canProceed"
          @click="handleNext"
        >
          Next
        </UButton>
        <UButton
          v-if="currentStep === steps.length - 1"
          color="green"
          @click="handleComplete"
        >
          Send Request
        </UButton>
      </div>
    </div>
  </div>
</template>
```

## Timeline / Activity Component

```vue
<script setup lang="ts">
import type { Activity } from '~/types'

const props = defineProps<{
  activities: Activity[]
}>()

const emit = defineEmits<{
  navigate: [entityType: string, entityId: number]
}>()

const handleActivityClick = (activity: Activity) => {
  if (activity.relatedEntityType && activity.relatedEntityId) {
    emit('navigate', activity.relatedEntityType, activity.relatedEntityId)
  }
}
</script>

<template>
  <div class="space-y-4">
    <h3 class="font-semibold">Interaction History</h3>

    <div v-if="activities.length === 0" class="text-center py-8 text-gray-500">
      No activities yet
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="activity in activities"
        :key="activity.id"
        class="relative pl-8 pb-4 border-l-2 border-gray-200 last:border-l-transparent cursor-pointer hover:bg-gray-50 -mx-3 px-3 py-2 rounded"
        @click="handleActivityClick(activity)"
      >
        <!-- Timeline dot -->
        <div class="absolute left-0 w-4 h-4 bg-blue-500 rounded-full border-2 border-white -translate-x-2.5 translate-y-1"></div>

        <!-- Activity content -->
        <div class="space-y-1">
          <p class="font-medium text-sm">
            {{ activity.activityType.replace(/_/g, ' ') }}
          </p>
          <p class="text-sm text-gray-700">
            {{ activity.description }}
          </p>
          <p class="text-xs text-gray-500">
            {{ formatDate(activity.createdAt) }} by {{ activity.actor.userName }}
          </p>

          <!-- Related entity link -->
          <p v-if="activity.relatedEntityName" class="text-sm text-blue-600">
            → {{ activity.relatedEntityName }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
```

## Best Practices Checklist

- ✅ Form validation shows errors only on touched fields (after blur)
- ✅ Required fields marked with red asterisk `*`
- ✅ Helper text below inputs for complex fields
- ✅ Array fields have add/remove buttons (remove only if >1 item)
- ✅ Modals have clear title + footer with Cancel/Action buttons
- ✅ Delete modals require explicit confirmation
- ✅ Tables support selection, filtering, pagination
- ✅ Row actions in dropdown menu (copy ID, edit, delete, etc.)
- ✅ Conditional fields use `v-if` with clear visual separation
- ✅ Multi-step forms show progress and validate per-step
- ✅ Timeline shows related entity links as navigation points
- ✅ Forms disable submit button until valid
- ✅ Async operations show loading state
- ✅ Success/error feedback via toast, not console
