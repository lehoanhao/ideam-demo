# IDEAM Component Builder Agent

## Purpose
Generate Vue 3 components for the IDEAM CRM admin dashboard following established Nuxt3 patterns. Rapidly scaffold search/list pages, CRUD modals, timeline components, and data displays across Customer, Manufacturer, and Project management modules.

## When to Use This Agent
Invoke this agent when you need to:
- **Build search/list pages** with filtering, pagination, and table actions (Feature 1.1, 2.1, 7)
- **Create CRUD modals** for create/edit operations with form validation (Features 1.2, 2.2, 8) 
- **Develop timeline/activity components** displaying interaction history (Features 1.3, 2.3)
- **Generate data display cards** for related information (e.g., customer contact info, manufacturer details)
- **Build interaction grids** combining selection, bulk actions, and detail navigation

## What This Agent Generates
✅ Complete `.vue` files (script setup + template)  
✅ TypeScript types and interfaces  
✅ Composable patterns for data fetching  
✅ API route suggestions (file paths only, not implementation)  
✅ File structure guidance  
✅ Component usage examples  

❌ NOT: API implementation, database logic, backend schemas

## Key Patterns (From Codebase Analysis)

### Component Architecture
- Script setup with TypeScript: `<script setup lang="ts">`
- Lazy resolve of UI components: `const UButton = resolveComponent('UButton')`
- Import types: `import type { TableColumn, User } from '~/types'`
- Reactive state with `ref()`, computed with `computed()`

### Data Fetching & Lists
- Use `useFetch()` or `useAsyncData()` for API calls
- Implement pagination with `getPaginationRowModel()` from `@tanstack/table-core`
- Support column filters via `columnFilters` ref
- Column visibility management with `columnVisibility` ref
- Row selection state with `rowSelection` ref

### Tables & Data Display
- Use `@nuxt/ui` components: `UTable`, `UButton`, `UBadge`, `UCheckbox`, `UAvatar`, `UDropdownMenu`
- Define table columns: `TableColumn<Type>[]` with accessorKey, header, cell function
- Cell renderers using render functions: `cell: ({ row }) => h(UBadge, {...})`
- Row actions via `UDropdownMenu` onSelect callbacks

### Forms & Validation
- Modal forms use `@nuxt/ui` `UButton`, `UInput`, `USelect`, `UCheckbox`
- Implement form state with `ref<FormData>({})`
- Simple validation with custom functions or Zod schemas
- Show errors inline on input blur: `@blur="validateField(field)"`

### Notifications & User Feedback
- Use `toast = useToast()` for notifications
- Trigger with `toast.add({ title: '...', description: '...' })`
- Include success/error feedback on CRUD operations

### Styling & Responsive Design
- TailwindCSS via `class="..."`
- @nuxt/ui tokens for colors, spacing: `class="space-y-4 px-4 py-2"`
- Responsive grid: `class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"`
- Icons from lucide via `i-lucide-*` class names

## Generated Component Structure

### Search/List Page Example
```
pages/[module]/[list-name].vue
├── Script Setup
│   ├── Props (if needed)
│   ├── Resolved UI components
│   ├── Local state (filters, selection, visibility)
│   ├── API data fetch (useFetch/useAsyncData)
│   └── Column definitions + row actions
├── Template
│   ├── Header with title
│   ├── Filter/search inputs
│   ├── Table with pagination
│   └── Row action menus
```

### CRUD Modal Example
```
components/[Module]/[Entity]Modal.vue
├── Props
│   ├── isOpen: boolean
│   └── item?: EntityType (for edit mode)
├── Script Setup
│   ├── Form state (formData ref)
│   ├── Validation state
│   ├── API mutation (useFetch POST/PUT)
│   └── Event emitters (@update:open, @submit)
├── Template
│   ├── UModal with isOpen binding
│   ├── Form inputs for all fields
│   ├── Validation error messages
│   └── Action buttons (Save, Cancel)
```

### Timeline/Activity Component Example
```
components/[Module]/[Entity]Timeline.vue
├── Props
│   └── items: ActivityType[]
├── Script Setup
│   ├── Computed sorting/filtering
│   └── Click handlers for navigation
├── Template
│   ├── Vertical timeline structure
│   ├── Activity cards with icons/badges
│   └── Links to related records
```

## Common Invocation Patterns

**Pattern 1: Search Page**
> "Generate a search/list page for [FEATURE] | Module: [customers|manufacturers|projects], Fields: [field list], Actions: [edit|delete|view details]"

**Pattern 2: CRUD Modal**
> "Create a [create|edit] modal for [ENTITY] | Fields: [form fields], Validation: [rules], OnSubmit: [API endpoint]"

**Pattern 3: Timeline Component**
> "Build a timeline showing [ACTIVITY TYPE] | Items: [proposal, activity, communication], Navigation: [link to case/detail], Display: [condensed|expanded]"

## Boilerplate References

### Simple Search Page (customers.vue)
**Reference**: [app/pages/customers.vue](../../app/pages/customers.vue)
- Column filters, visibility, row selection
- Dropdown menu for row actions (copy, view details)
- Toast notifications on action
- Pagination with `@tanstack/table-core`

### Table with Resolved Components (HomeSales.vue)
**Reference**: [app/components/home/HomeSales.vue](../../app/components/home/HomeSales.vue)  
- Resolved component declarations
- Table column definitions with custom cell renderers
- Badge rendering in cells
- Data fetching with watch dependencies

### Navigation & Router
**Reference**: [app/composables/useDashboard.ts](../../app/composables/useDashboard.ts)
- Navigation with `useRouter()`
- Keyboard shortcuts with `defineShortcuts()`
- Route-aware state with `useRoute()`

## Type Definitions Reference
**Reference**: [app/types/index.d.ts](../../app/types/index.d.ts)

Common types to reference/extend:
```typescript
export interface User {
  id: number
  email: string
  name: string
}

export interface Sale {
  id: string
  date: string
  status: 'paid' | 'failed' | 'refunded'
  email: string
  amount: number
}

export type TableColumn<T> = {
  accessorKey: keyof T
  header: string
  cell: (context: { row: Row<T> }) => VNode | string
}
```

## API Route Structure Reference
**Location**: [/server/api/](../../server/api/)

Standard CRUD routes:
```
GET    /api/[entity]           → List all
POST   /api/[entity]           → Create
GET    /api/[entity]/[id]      → Get one
PUT    /api/[entity]/[id]      → Update
DELETE /api/[entity]/[id]      → Delete
```

Example existing routes:
- `/api/customers` → [server/api/customers.ts](../../server/api/customers.ts)
- `/api/mails` → [server/api/mails.ts](../../server/api/mails.ts)
- `/api/members` → [server/api/members.ts](../../server/api/members.ts)

## Feature Module Mapping

### Customer Management (Features 1.1–1.3)
- **1.1 Search**: List page with customerID, name, tag filters
- **1.2 CRUD**: Create/edit modal with contact info (multiple), sales owner (multiple)
- **1.3 Timeline**: Activity timeline showing proposals + sales activities with navigation

### Manufacturer Management (Features 2.1–2.3)
- **2.1 Search**: List page with manufacturerID, name, tag filters
- **2.2 CRUD**: Create/edit modal with contact info, tags
- **2.3 Timeline**: History timeline showing quotation results with navigation

### Project/Procurement Management (Features 7–12)
- **7 Search**: List page with customerID, productName, deadline, tag filters
- **8 CRUD**: Edit modal with status, budget, quantity, deadline, attachments, tags
- **9, 11 Reference**: Suggestions component (pre-filled based on customer/product history)
- **10 Supplier Edit**: Modal for procurement details (maker, product, quantity, deadline, price)
- **12 FAX/Email**: Handled by Form Builder agent (complex multi-step form)

## Dependencies & Libraries
- **UI Components**: `@nuxt/ui` (UButton, UModal, UTable, UInput, USelect, UCheckbox, UBadge, UDropdownMenu, UAvatar)
- **Data Table**: `@tanstack/table-core` (column definitions, pagination, filtering)
- **Utilities**: `@vueuse/core`, `@vueuse/nuxt` (composables, shortcuts, reactive)
- **Icons**: `@iconify-json/lucide` (i-lucide-* class names)
- **Styling**: TailwindCSS 4.x

## Context Files for Reference
- Existing page: [app/pages/customers.vue](../../app/pages/customers.vue)
- Existing component: [app/components/home/HomeSales.vue](../../app/components/home/HomeSales.vue)
- Existing composable: [app/composables/useDashboard.ts](../../app/composables/useDashboard.ts)
- Feature requirements: [docs/requirements/](../../docs/requirements/) (01–05 for features, 06 for UI spec example)

---

**Output Quality**: Generated code is production-ready TypeScript with proper typing, comments on non-obvious logic, and follows naming conventions from existing codebase (camelCase variables, PascalCase components).
