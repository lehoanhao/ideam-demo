# IDEAM Form Builder Agent

## Purpose
Generate complex multi-step forms, sophisticated form components, and advanced input patterns for the IDEAM CRM admin dashboard. Specializes in validation, conditional fields, multi-part workflows, and integration patterns (FAX/Email request forms, approval workflows, file uploads).

## When to Use This Agent
Invoke this agent when you need to:
- **Build complex create/edit forms** with conditional sections (Features 1.2, 2.2, 8, 10)
- **Create multi-step workflows** with progress tracking (Feature 8 case workflow, Feature 9 product selection)
- **Implement data-dependent forms** that show/hide fields based on selections (e.g., FAX vs Email request type)
- **Design approval/confirmation flows** with role-based visibility (Feature 9 - CEO approval)
- **Handle file uploads & attachments** (Feature 8 mentions attachments)
- **Build search + selection combos** for related entity references (e.g., select products, select manufacturers)
- **Implement action forms** that trigger notifications/side effects (e.g., send FAX/Email)

**Contrast with Component Builder**: 
- Component Builder = simple CRUD modals, list pages, single forms
- Form Builder = complex multi-field validation, workflows, conditional logic, integrations

## What This Agent Generates
✅ Complete form components (`.vue` files)  
✅ Multi-step wizard components with progress tracking  
✅ Zod validation schemas + error rendering  
✅ Conditional field rendering logic  
✅ Action handlers (submit, FAX/Email send, approval workflows)  
✅ Custom composables for form state management  
✅ TypeScript interfaces for form data  
✅ Field suggestions/autocomplete patterns  

❌ NOT: API implementation, email/FAX backend service connectors, database updates

## Key Patterns (From Codebase Analysis)

### Form State Management
- Initialize form state: `const formData = ref<FormType>({...})`
- Validation state: `const errors = ref<Record<string, string>>({...})`
- Touched fields tracking: `const touched = ref<Set<string>>(new Set())`
- Dirty state: `const isDirty = computed(() => { ... })`

### Validation Patterns
- Zod schema definition: `const FormSchema = z.object({ field: z.string().min(1) })`
- Parse on submit: `const result = FormSchema.safeParse(formData.value)`
- Field-level validation: `validateField(fieldName: string) → boolean`
- Error display: `v-if="errors[field]"` → `<p class="text-red-500">{{ errors[field] }}</p>`
- Touch tracking on blur: `@blur="touched.add(field)"`

### Conditional Field Rendering
- Show/hide with `v-if`: `<input v-if="formData.requestType === 'email'" />`
- Disable with `:disabled`: `:disabled="!formData.customerSelected"`
- Computed visibility: `const isFieldVisible = computed(() => formData.type === '...')`

### Custom Input Patterns
- Multiple inputs for same field array: e.g., multiple contact info entries
- Add/remove buttons: `@click="addContact()"`, `@click="removeContact(index)"`
- Field array rendering: `v-for="(item, idx) in formData.contacts"`

### Modal/Dialog Integration
- Emit events: `emit('update:open', false)`, `emit('submit', formData.value)`
- Accept props for pre-fill: `defineProps<{ initialData?: FormType }>()`
- Reset on cancel: `@click="resetForm()"`

### Reusable Form Composable Pattern
```typescript
export const useFormState = <T extends Record<string, any>>(
  initialData: T,
  schema: ZodSchema
) => {
  const formData = ref<T>(initialData)
  const errors = ref<Record<string, string>>({})
  const touched = ref<Set<string>>(new Set())
  
  const validateField = (fieldName: keyof T) => { ... }
  const validateAll = () => { ... }
  const resetForm = () => { ... }
  
  return { formData, errors, touched, validateField, validateAll, resetForm }
}
```

## Complex Form Component Structure

### Multi-Step Workflow Example
```
components/Projects/ProjectWorkflowForm.vue
├── Props
│   ├── isOpen: boolean
│   ├── initialData?: ProjectType
│   └── step?: 'create' | 'procurement' | 'approval'
├── Script Setup
│   ├── Current step state
│   ├── Combined form data (spans all steps)
│   ├── Validation schema (partial or full)
│   ├── Step-specific validation
│   ├── Navigation handlers (next, prev, complete)
│   └── Event emitters
├── Template
│   ├── Progress bar (step 1/3)
│   ├── Step-specific form section
│   ├── Context-aware buttons (Next/Prev/Submit based on step)
│   └── Summary view before final confirmation
```

### Conditional Fields Form Example
```
components/Procurement/ProcurementRequestForm.vue
├── Props
│   ├── isOpen: boolean
│   └── manufacturerId?: string
├── Script Setup
│   ├── requestType state: 'fax' | 'email'
│   ├── Form data with conditional fields
│   ├── Zod schema with refinement for cross-field validation
│   ├── Compute visible fields based on type
│   └── Handler for "send via FAX" | "send via Email"
├── Template
│   ├── Tabs or toggle: "Request Type (FAX/Email)"
│   ├── Common fields (manufactorer, product, quantity, deadline)
│   ├── Conditional: FAX fields (fax number, cover letter)
│   ├── Conditional: Email fields (email address, body template)
│   └── Action buttons based on type
```

### Form with Dynamic Array Fields Example
```
components/Customers/CustomerForm.vue
├── Props & form data
├── Script Setup
│   ├── formData = { name, contacts: [...], salesOwners: [...] }
│   ├── Validation for array items
│   └── Add/remove handlers
├── Template
│   ├── Basic fields (name, tags)
│   ├── Contacts section
│   │   └── v-for with add/remove buttons
│   ├── Sales Owners section
│   │   └── v-for with add/remove buttons, typeahead/select
│   └── Form action buttons (Save, Cancel)
```

## Common Invocation Patterns

**Pattern 1: Multi-Step Form**
> "Create a multi-step form for [WORKFLOW] | Steps: [step1, step2, ...], Fields: [field list], Validation: [rules], OnComplete: [action]"

**Pattern 2: Conditional Complex Form**
> "Build a [create|edit] form with conditional fields for [ENTITY] | Condition: [if X then show Y], Fields: [list], Validation: [rules]"

**Pattern 3: FAX/Email Request Form**
> "Generate a request form for [FAX|Email] quotation | Common fields: [list], FAX-specific: [list], Email-specific: [list], OnSubmit: [action]"

**Pattern 4: Approval Workflow**
> "Create an approval form/modal for [FEATURE] | Approvers: [role], Visible to: [role], Fields: [decision, comment], OnApprove: [action]"

**Pattern 5: Dynamic Array Form**
> "Build a form for [ENTITY] with [ARRAY FIELD] support | Field type: [contact|owner], Allow: [add|remove|edit], Validation: [rules]"

## Boilerplate References

### Simple Form with Validation (customers.vue modal section)
**Reference**: [app/pages/customers.vue](../../app/pages/customers.vue)  
- Basic form layout
- Toast notifications on save
- Modal open/close state

### Table with Editable Rows Pattern
**Reference**: [app/components/home/HomeSales.vue](../../app/components/home/HomeSales.vue)  
- Inline data editing patterns
- Column-based form structure

### Component Resolved Pattern
**Reference**: [app/components/home/HomeSales.vue](../../app/components/home/HomeSales.vue#L1-L20), [app/pages/customers.vue](../../app/pages/customers.vue#1-30)  
- Use `resolveComponent()` for lazy-loaded UI components in forms

## Form Component Library (@nuxt/ui)

**Input Components** (for forms):
- `UInput` – Text, email, password, tel, number inputs
- `USelect` – Dropdown selection (single or multiple)
- `UCheckbox` – Boolean toggle
- `USwitch` – On/off toggle
- `UTextarea` – Multi-line text
- `UButton` – Form submission, navigation, actions
- `UFormGroup` – Wrapper for label + error display
- `UTab`, `UTabPanel` – Multi-step/tabbed forms
- `UModal` – Dialog for form in modal
- `UCard` – Container for form sections

**Form Validation Display**:
- Error message: `<p v-if="errors.field" class="text-red-500 text-sm">{{ errors.field }}</p>`
- Required indicator: `<span class="text-red-500">*</span>`
- Helper text: `<p class="text-gray-500 text-xs">{{ hint }}</p>`

## Data Model Examples for Forms

### Customer Form
```typescript
interface CustomerFormData {
  name: string
  customerId?: string
  tags: string[]
  contacts: Array<{
    type: 'phone' | 'email' | 'fax'
    value: string
    isPrimary: boolean
  }>
  salesOwners: Array<{
    userId: number
    name: string
    isPrimary: boolean
  }>
}
```

### Project/Case Form
```typescript
interface ProjectFormData {
  customerId: number
  projectName: string
  status: 'active' | 'pending' | 'completed'
  budget: number
  quantity: number
  deliveryDate: string
  description: string
  attachments: File[]
  tags: string[]
  comments?: string
}
```

### Procurement Request Form
```typescript
interface ProcurementRequestData {
  manufacturerId: number
  requestType: 'fax' | 'email'
  productId: number
  quantity: number
  deadline: string
  // FAX-specific
  faxNumber?: string
  coverLetter?: string
  // Email-specific
  emailAddress?: string
  emailBody?: string
}
```

### Approval Workflow Data
```typescript
interface ApprovalFormData {
  itemId: string
  itemType: 'project' | 'quotation'
  decision: 'approved' | 'rejected' | 'pending_revision'
  comment: string
  reviewer: string // CEO/approver name
}
```

## Zod Validation Schema Examples

### Customer Form Schema
```typescript
import { z } from 'zod'

export const CustomerFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  customerId: z.string().optional(),
  tags: z.array(z.string()).default([]),
  contacts: z.array(z.object({
    type: z.enum(['phone', 'email', 'fax']),
    value: z.string().min(1),
    isPrimary: z.boolean()
  })).min(1, 'At least one contact is required'),
  salesOwners: z.array(z.object({
    userId: z.number(),
    name: z.string(),
    isPrimary: z.boolean()
  })).min(1, 'At least one sales owner is required')
})
```

### Procurement Request Schema (with conditional validation)
```typescript
export const ProcurementRequestSchema = z.object({
  manufacturerId: z.number().min(1),
  requestType: z.enum(['fax', 'email']),
  productId: z.number(),
  quantity: z.number().positive(),
  deadline: z.string().date(),
  faxNumber: z.string().optional(),
  coverLetter: z.string().optional(),
  emailAddress: z.string().email().optional(),
  emailBody: z.string().optional()
}).refine(
  (data) => {
    if (data.requestType === 'fax') return !!data.faxNumber && !!data.coverLetter
    if (data.requestType === 'email') return !!data.emailAddress && !!data.emailBody
    return false
  },
  { message: 'Complete required fields for selected request type' }
)
```

## Feature Module Mapping

### Customer Management (Feature 1.2 – CRUD)
- Create form with multiple contacts, multiple sales owners
- Edit form (pre-fill, modify, save)
- Validation: Name required, contacts array not empty, sales owners not empty

### Manufacturer Management (Feature 2.2 – CRUD)
- Create form with contact info, tags
- Edit form
- Validation: Name required, at least one contact

### Project Management (Feature 8 – Case Create/Edit)
- Complex form: customer select, project name, status, budget, quantity, deadline, description, attachments, tags, comments
- Status field tied to workflow approval (see Feature 9)
- Conditional: Show "awaiting approver" when submitting

### Procurement (Feature 10 – Supplier Edit)
- Edit procure details: manufacturer, product, quantity, deadline, price
- Validation for numeric fields

### FAX/Email Request (Feature 12)
- **Complex multi-step OR conditional form**:
  - Step 1: Select manufacturer + product details
  - Step 2: Choose request type (FAX/Email)
  - Step 3: Fill type-specific fields (FAX number + cover letter OR email + body)
  - Step 4: Review + send
- Action handler calls backend to trigger FAX/Email send (impl not in this agent)

### Approval Workflow (Feature 9 – CEO Approval)
- Form/modal visible only to CEO/approver role
- Fields: Decision dropdown (approve/reject/pending revision), comment textarea
- On approval: Update project status, emit notification event

## Composable References

**useDashboard**: [app/composables/useDashboard.ts](../../app/composables/useDashboard.ts)  
- Pattern for shared composable

**Custom form composable** (to be created in your project):
```typescript
// /app/composables/useFormValidation.ts
export const useFormValidation = <T>(schema: ZodSchema, initialData: T) => {
  const formData = ref(initialData)
  const errors = ref<Record<string, string>>({})
  const touched = ref<Set<string>>(new Set())
  
  const validateField = (field: keyof T) => { ... }
  const validateAll = () => { ... }
  const resetForm = () => { ... }
  
  return { formData, errors, touched, validateField, validateAll, resetForm }
}
```

## Dependencies & Libraries
- **UI Components**: `@nuxt/ui` (UInput, USelect, UCheckbox, UButton, UModal, UTab)
- **Validation**: `zod` (schema definition + parsing)
- **Utilities**: `@vueuse/core`, `@vueuse/nuxt`
- **Styling**: TailwindCSS 4.x

## Context Files for Reference
- Page with modals: [app/pages/customers.vue](../../app/pages/customers.vue)
- Component patterns: [app/components/home/](../../app/components/home/)
- Type examples: [app/types/index.d.ts](../../app/types/index.d.ts)
- Feature workflows: [docs/requirements/03.flow-description.md](../../docs/requirements/03.flow-description.md)

---

**Output Quality**: Generated code includes proper error handling, clear validation messages, accessible form structure (labels, ARIA hints), and comments on complex logic like conditional sections or multi-step navigation.
