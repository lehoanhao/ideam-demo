---
applyTo: '**.ts,**.d.ts'
---

# IDEAM API & Data Model Guidelines

## Type Definition Location & Structure

### Primary Type File
**File**: [app/types/index.d.ts](app/types/index.d.ts)

All domain model interfaces should be defined here to maintain single source of truth for API contracts and frontend state.

### Existing Types (Reference)
```typescript
// From app/types/index.d.ts
export interface User {
  id: number
  email: string
  name: string
  // ... more fields
}

export interface Sale {
  id: string
  date: string
  status: 'paid' | 'failed' | 'refunded'
  email: string
  amount: number
}

export type Period = 'day' | 'week' | 'month' | 'year'
export type Range = 'current' | 'previous' | 'custom'
```

## Domain Models for IDEAM Features

### Customer (顧客)
```typescript
export interface Customer {
  id: number
  customerId: string          // Internal business ID
  name: string
  tags: string[]
  
  // Navigation/Relations
  contacts: Contact[]
  salesOwners: SalesOwner[]
  
  // Metadata
  createdAt: string           // ISO date
  updatedAt: string
}

export interface Contact {
  id?: number
  type: 'phone' | 'email' | 'fax'
  value: string
  isPrimary: boolean
  note?: string
}

export interface SalesOwner {
  id: number
  userId: number
  name: string
  email?: string
  isPrimary: boolean
}

// Request/Response types for API
export type CreateCustomerRequest = Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateCustomerRequest = Partial<CreateCustomerRequest>
export type CustomerResponse = Customer
export type CustomerListResponse = Customer[]
```

### Manufacturer (メーカー)
```typescript
export interface Manufacturer {
  id: number
  manufacturerId: string      // Business ID
  name: string
  tags: string[]
  
  // Navigation/Relations
  contacts: Contact[]
  
  // Metadata
  createdAt: string
  updatedAt: string
}

export type CreateManufacturerRequest = Omit<Manufacturer, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateManufacturerRequest = Partial<CreateManufacturerRequest>
```

### Project / Case (案件)
```typescript
export interface Project {
  id: number
  projectId: string                    // Business ID
  customerId: number                   // FK to Customer
  projectName: string
  
  // Procurement details
  status: ProjectStatus               // See enum below
  budget: number                      // Expected budget
  quantity: number
  deliveryDate: string               // ISO date
  
  // Additional info
  description?: string
  tags: string[]
  attachments?: Attachment[]
  comments?: string
  
  // Procurement workflow
  procurement?: ProcurementInfo
  approval?: ApprovalInfo
  
  // Metadata
  createdAt: string
  updatedAt: string
}

export type ProjectStatus = 'draft' | 'active' | 'pending_approval' | 'approved' | 'completed' | 'cancelled'

export interface Attachment {
  id: number
  filename: string
  url: string
  uploadedAt: string
}

export interface ProcurementInfo {
  id: number
  projectId: number
  manufacturerId: number
  status: ProcurementStatus
  
  // Supplier/product selection
  productId: number
  productName: string
  quantity: number
  deadline: string              // ISO date
  
  // Pricing
  costPrice: number            // 仕入れ価格
  proposedPrice?: number       // 提案金額
  quotationFiles?: Attachment[]
  
  // Communication
  requestComments?: string
  responseComments?: string
  
  // Metadata
  createdAt: string
  updatedAt: string
}

export type ProcurementStatus = 'draft' | 'quote_requested' | 'quote_received' | 'accepted' | 'rejected' | 'cancelled'

export interface ApprovalInfo {
  id: number
  projectId: number
  status: ApprovalStatus
  approverUserId: number
  approverName: string
  decision?: 'approved' | 'rejected' | 'pending_revision'
  comment?: string
  approvedAt?: string           // ISO date
}

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'under_revision'

export type CreateProjectRequest = Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'procurement' | 'approval'>
export type UpdateProjectRequest = Partial<CreateProjectRequest>
```

### Quotation Request (見積依頼)
```typescript
export interface QuotationRequest {
  id: number
  projectId: number
  manufacturerId: number
  manufacturerFaxOrEmail: string      // The actual fax/email to send request to
  
  requestType: 'fax' | 'email'
  
  // Common request fields
  productId: number
  productName: string
  quantity: number
  deadline: string                   // ISO date
  requiredDate: string               // 納期
  
  // FAX-specific
  faxNumber?: string
  coverLetter?: string
  
  // Email-specific
  emailAddress?: string
  emailSubject?: string
  emailBody?: string
  
  // Response tracking
  status: QuotationStatus
  quotationFile?: string             // Path to received quotation (FAX scan/email attachment)
  quotedPrice?: number               // From received quotation
  quotedDeliveryDate?: string
  responseReceivedAt?: string
  
  // Metadata
  sentAt: string
  createdAt: string
  updatedAt: string
}

export type QuotationStatus = 'draft' | 'sent' | 'awaiting_response' | 'received' | 'cancelled'

export type CreateQuotationRequestRequest = Omit<QuotationRequest, 'id' | 'createdAt' | 'updatedAt' | 'sentAt'>
```

### Activity / Timeline Entry (対応履歴)
```typescript
export interface Activity {
  id: number
  entityType: 'customer' | 'manufacturer' | 'project'    // What entity this activity relates to
  entityId: number
  
  activityType: ActivityType
  description: string
  
  actor: {
    userId: number
    userName: string
  }
  
  // Related entity references (for linking in UI)
  relatedEntityType?: 'project' | 'quotation' | 'procurement'
  relatedEntityId?: number
  relatedEntityName?: string
  
  createdAt: string
}

export type ActivityType = 
  | 'customer_created'
  | 'customer_updated'
  | 'project_created'
  | 'project_submitted'
  | 'quotation_requested'
  | 'quotation_received'
  | 'approval_submitted'
  | 'approval_completed'
  | 'proposal_sent'
  | 'comment_added'
  | 'status_changed'

export type ActivityListResponse = Activity[]
```

## API Route Structure

### Naming Convention
- Resource-based: `/api/[resource]`
- Standard CRUD:
  - `GET /api/[resource]` → List (with query params for filters)
  - `POST /api/[resource]` → Create
  - `GET /api/[resource]/[id]` → Get one
  - `PUT /api/[resource]/[id]` → Update
  - `DELETE /api/[resource]/[id]` → Delete

### Query Parameters (Filtering & Pagination)
```typescript
// Example: GET /api/customers?page=1&limit=20&search=acme&status=active

// Standard pagination
?page=1&limit=20

// Search/Filter
?search=customer_name
?status=active
?tags=premium
?dateFrom=2026-01-01&dateTo=2026-03-05

// Multiple values
?tags[]=premium&tags[]=vip

// Sorting
?sortBy=name&sortOrder=asc|desc
```

### API Route Implementation Pattern

```typescript
// /server/api/customers.ts
export default defineEventHandler(async (event) => {
  const method = getHeader(event, 'method')

  if (method === 'GET') {
    // Query params from URL
    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 20
    const search = query.search as string

    // Fetch from data source (mock or database)
    const customers = await getCustomersFromDB(page, limit, search)
    return customers
  }

  if (method === 'POST') {
    const body: CreateCustomerRequest = await readBody(event)
    
    // Validation can happen here or in middleware
    const validation = validateCustomer(body)
    if (!validation.success) {
      throw createError({
        statusCode: 400,
        statusMessage: validation.error
      })
    }

    const customer = await createCustomerInDB(body)
    setResponseStatus(event, 201)
    return customer
  }
})

// /server/api/customers/[id].ts
export default defineEventHandler(async (event) => {
  const id = parseInt(getRouterParam(event, 'id')!)
  const method = getHeader(event, 'method')

  if (method === 'GET') {
    const customer = await getCustomerFromDB(id)
    if (!customer) {
      throw createError({ statusCode: 404, statusMessage: 'Not found' })
    }
    return customer
  }

  if (method === 'PUT') {
    const body: UpdateCustomerRequest = await readBody(event)
    const updated = await updateCustomerInDB(id, body)
    return updated
  }

  if (method === 'DELETE') {
    await deleteCustomerFromDB(id)
    setResponseStatus(event, 204)
    return null
  }
})
```

### Reference Implementations
- [server/api/customers.ts](server/api/customers.ts)
- [server/api/mails.ts](server/api/mails.ts)
- [server/api/members.ts](server/api/members.ts)

## Validation Patterns with Zod

### Zod Schema Definition
```typescript
import { z } from 'zod'

// Base schemas
const ContactSchema = z.object({
  type: z.enum(['phone', 'email', 'fax']),
  value: z.string().min(1),
  isPrimary: z.boolean()
})

const SalesOwnerSchema = z.object({
  userId: z.number().positive(),
  name: z.string().min(1),
  isPrimary: z.boolean()
})

// Customer validation
export const CreateCustomerSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name too long'),
  tags: z.array(z.string()).default([]),
  contacts: z.array(ContactSchema)
    .min(1, 'At least one contact is required'),
  salesOwners: z.array(SalesOwnerSchema)
    .min(1, 'At least one sales owner is required')
})

export const UpdateCustomerSchema = CreateCustomerSchema.partial()

export type CreateCustomerInput = z.infer<typeof CreateCustomerSchema>
export type UpdateCustomerInput = z.infer<typeof UpdateCustomerSchema>

// Project/Case validation
export const CreateProjectSchema = z.object({
  customerId: z.number().positive(),
  projectName: z.string().min(1),
  status: z.enum(['draft', 'active', 'pending_approval', 'approved', 'completed', 'cancelled']),
  budget: z.number().positive(),
  quantity: z.number().positive(),
  deliveryDate: z.string().date(),
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),
  comments: z.string().optional()
})

export const UpdateProjectSchema = CreateProjectSchema.partial()

// Quotation request validation (with conditional fields)
export const CreateQuotationRequestSchema = z.object({
  projectId: z.number().positive(),
  manufacturerId: z.number().positive(),
  requestType: z.enum(['fax', 'email']),
  productId: z.number().positive(),
  productName: z.string().min(1),
  quantity: z.number().positive(),
  deadline: z.string().date(),
  requiredDate: z.string().date(),
  // Optional fields populated based on requestType
  faxNumber: z.string().optional(),
  coverLetter: z.string().optional(),
  emailAddress: z.string().email().optional(),
  emailSubject: z.string().optional(),
  emailBody: z.string().optional()
}).refine(
  (data) => {
    if (data.requestType === 'fax') {
      return !!data.faxNumber && !!data.coverLetter
    }
    if (data.requestType === 'email') {
      return !!data.emailAddress && !!data.emailSubject && !!data.emailBody
    }
    return false
  },
  {
    message: 'Complete all required fields for selected request type',
    path: ['requestType']
  }
)

export type CreateQuotationRequestInput = z.infer<typeof CreateQuotationRequestSchema>
```

### Using Zod in API Routes
```typescript
import { CreateCustomerSchema } from '~/types/schemas'

export default defineEventHandler(async (event) => {
  if (getHeader(event, 'method') === 'POST') {
    const body = await readBody(event)

    // Parse and validate
    const parseResult = CreateCustomerSchema.safeParse(body)
    
    if (!parseResult.success) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Validation failed',
        data: parseResult.error.flatten()
      })
    }

    // Use validated data
    const customer = await createCustomerInDB(parseResult.data)
    return customer
  }
})
```

### Using Zod in Frontend Forms
```typescript
import { CreateCustomerSchema } from '~/types/schemas'
import type { CreateCustomerInput } from '~/types/schemas'

const formData = ref<CreateCustomerInput>({
  name: '',
  contacts: [{ type: 'email', value: '', isPrimary: true }],
  salesOwners: [],
  tags: []
})

const errors = ref<Record<string, string>>({})

const validateField = (fieldName: keyof CreateCustomerInput) => {
  const fieldSchema = CreateCustomerSchema.pick({ [fieldName]: true })
  const result = fieldSchema.safeParse({
    [fieldName]: formData.value[fieldName]
  })

  if (!result.success) {
    errors.value[fieldName] = result.error.issues[0].message
    return false
  } else {
    delete errors.value[fieldName]
    return true
  }
}

const validateAll = () => {
  const result = CreateCustomerSchema.safeParse(formData.value)
  
  if (!result.success) {
    errors.value = Object.fromEntries(
      result.error.issues.map(issue => [issue.path[0], issue.message])
    )
    return false
  }
  
  errors.value = {}
  return true
}

const handleSubmit = async () => {
  if (!validateAll()) return

  const response = await $fetch('/api/customers', {
    method: 'POST',
    body: formData.value
  })

  toast.add({ title: 'Customer created!' })
}
```

## Response Format Convention

### Success Response
```typescript
// Single resource
{
  id: 1,
  name: 'ACME Corp',
  ...
}

// List response
[
  { id: 1, name: 'ACME Corp', ... },
  { id: 2, name: 'BigCorp Inc', ... }
]
```

### Error Response
```typescript
{
  statusCode: 400 | 404 | 500 | ...
  statusMessage: 'Human-readable error message',
  data?: {
    // Optional additional error details
    fieldErrors?: { field: 'error message' }
  }
}
```

## Data Examples (Mock Data Pattern)

### Customer Mock Data
```typescript
const mockCustomers: Customer[] = [
  {
    id: 1,
    customerId: 'CUST-001',
    name: 'ACME Corporation',
    tags: ['premium', 'active'],
    contacts: [
      { id: 1, type: 'email', value: 'contact@acme.co.jp', isPrimary: true },
      { id: 2, type: 'phone', value: '+81-90-1234-5678', isPrimary: false }
    ],
    salesOwners: [
      { id: 1, userId: 10, name: 'Tanaka Yamada', email: 'tanaka@company.jp', isPrimary: true }
    ],
    createdAt: '2026-01-15T10:30:00Z',
    updatedAt: '2026-03-05T14:20:00Z'
  }
]
```

### Project Mock Data
```typescript
const mockProjects: Project[] = [
  {
    id: 1,
    projectId: 'PROJ-001',
    customerId: 1,
    projectName: 'Q1 Food Supply Order',
    status: 'active',
    budget: 4000000,
    quantity: 1000,
    deliveryDate: '2026-04-30T00:00:00Z',
    description: '食品・飲料商品の大量仕入れ',
    tags: ['food', 'bulk'],
    procurement: undefined,
    approval: undefined,
    createdAt: '2026-03-01T09:00:00Z',
    updatedAt: '2026-03-05T15:00:00Z'
  }
]
```

## Best Practices Checklist

- ✅ Keep types centralized in [app/types/index.d.ts](app/types/index.d.ts)
- ✅ Use request/response type suffixes: `CreateCustomerRequest`, `CustomerResponse`
- ✅ Define Zod schemas alongside or in separate `types/schemas.ts`
- ✅ Use `z.infer<typeof Schema>` to derive TypeScript types from schemas
- ✅ API routes follow REST conventions and standard CRUD pattern
- ✅ Query parameters for filtering, pagination, search
- ✅ Validation happens in API route before data processing
- ✅ Return 201 on POST (create), 204 on DELETE (no content)
- ✅ Error responses include statusCode and statusMessage
- ✅ Use conditional validation in Zod `.refine()` for cross-field dependencies
- ✅ Frontend and backend both validate (belt-and-suspenders)
