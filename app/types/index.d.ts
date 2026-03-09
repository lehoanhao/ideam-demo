import type { AvatarProps } from '@nuxt/ui'

// ============================================================================
// AUTHENTICATION & USERS (認証とユーザー)
// ============================================================================

export type UserRole = 'admin' | 'manager' | 'salesperson' | 'procurement' | 'viewer'
export type UserStatus = 'active' | 'inactive' | 'suspended'

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: UserRole
  status: UserStatus
  department?: string
  avatar?: string
  lastLogin?: string
  createdAt: string
  updatedAt: string
}

export interface AuthToken {
  accessToken: string
  refreshToken?: string
  expiresIn: number
}

export interface AuthSession {
  user: User
  token: AuthToken
  loginAt: string
}

// ============================================================================
// CUSTOMER MANAGEMENT (顧客情報管理)
// ============================================================================

export interface CustomerContact {
  id: string
  type: 'email' | 'phone' | 'fax'
  value: string
  name?: string
  isPrimary: boolean
  notes?: string
}

export interface Customer {
  id: string
  code: string
  name: string
  furigana?: string // ふりがな
  tags: string[]
  contacts: CustomerContact[]
  assignedSalesStaff: string[] // User IDs
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CustomerFilter {
  search?: string
  tags?: string[]
  assignedStaff?: string
  sortBy?: 'name' | 'createdAt' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
}

// ============================================================================
// MANUFACTURER MANAGEMENT (メーカー情報管理)
// ============================================================================

export interface Manufacturer {
  id: string
  code: string
  name: string
  furigana?: string
  tags: string[]
  contactEmail?: string
  contactPhone?: string
  faxNumber?: string
  preferredContactMethod: 'email' | 'fax' | 'phone'
  productCategories: string[]
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface ManufacturerFilter {
  search?: string
  tags?: string[]
  productCategory?: string
  sortBy?: 'name' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}

// ============================================================================
// PROPOSAL MANAGEMENT (提案管理) - CORE FEATURE
// ============================================================================

export type ProposalStatus = 'draft' | 'submitted' | 'quoted' | 'pricing' | 'pending_approval' | 'approved' | 'rejected' | 'completed' | 'confirming' | 'archived'

export interface ProposalLineItem {
  id: string
  manufacturerId: string
  manufacturerName: string
  productName: string
  productCode?: string
  quantity: number
  unit: string
  unitPrice: number
  total: number
  notes?: string
  deliveryDate: string
  tags?: string[]
}

export interface Proposal {
  id: string
  code: string
  customerId: string
  customerName: string
  title: string
  description?: string
  status: ProposalStatus
  lineItems: ProposalLineItem[]
  totalAmount: number
  budget?: number
  deadline: string
  requiredDeliveryDate: string
  createdBy: string // User ID
  assignedTo?: string // User ID
  tags: string[]
  attachments?: string[] // File URLs or paths
  comments?: ProposalComment[]
  approvalStatus: 'pending' | 'approved' | 'rejected'
  approvedBy?: string // User ID
  approvalDate?: string
  createdAt: string
  updatedAt: string
}

export interface ProposalComment {
  id: string
  userId: string
  userName: string
  content: string
  createdAt: string
}

export interface ProposalFilter {
  search?: string
  customerId?: string
  status?: ProposalStatus[]
  createdBy?: string
  tags?: string[]
  dateFrom?: string
  dateTo?: string
  sortBy?: 'createdAt' | 'deadline' | 'totalAmount'
  sortOrder?: 'asc' | 'desc'
}

// ============================================================================
// PROCUREMENT MANAGEMENT (仕入れ管理)
// ============================================================================

export type ProcurementStatus = 'draft' | 'rfq_sent' | 'quoted' | 'ordered' | 'received' | 'completed' | 'cancelled'
export type ProcurementChannel = 'email' | 'fax' | 'phone' | 'manual'

export interface ProcurementItem {
  id: string
  proposalLineItemId?: string
  manufacturerId: string
  manufacturerName: string
  productName: string
  quantity: number
  unit: string
  requestedUnitPrice?: number
  quotedUnitPrice?: number
  finalUnitPrice?: number
  deliveryDate: string
  notes?: string
}

export interface Procurement {
  id: string
  code: string
  proposalId?: string
  proposalCode?: string
  items: ProcurementItem[]
  status: ProcurementStatus
  rfqSentDate?: string
  rfqChannel?: ProcurementChannel
  quotationReceivedDate?: string
  orderDate?: string
  expectedDeliveryDate: string
  actualDeliveryDate?: string
  totalQuotedAmount?: number
  totalOrderedAmount?: number
  notes?: string
  attachments?: string[]
  comments?: ProcurementComment[]
  createdBy: string
  assignedTo: string
  createdAt: string
  updatedAt: string
}

export interface ProcurementComment {
  id: string
  userId: string
  userName: string
  content: string
  createdAt: string
}

export interface ProcurementFilter {
  search?: string
  status?: ProcurementStatus[]
  manufacturerId?: string
  proposalId?: string
  dateFrom?: string
  dateTo?: string
  sortBy?: 'createdAt' | 'expectedDeliveryDate'
  sortOrder?: 'asc' | 'desc'
}

// ============================================================================
// HISTORICAL DATA (過去実績)
// ============================================================================

export interface HistoricalRecord {
  id: string
  proposalCode: string
  customerId: string
  customerName: string
  customerCode: string
  manufacturerId: string
  manufacturerName: string
  productCode: string
  productName: string
  quantity: number
  unit: string
  unitPrice: number
  totalAmount: number
  orderDate: string
  deliveryDate: string
  completionDate: string
  profit?: number
  profitMargin?: number
  notes?: string
  tags?: string[]
  createdAt: string
}

export interface HistoricalFilter {
  search?: string
  customerId?: string
  manufacturerId?: string
  dateFrom?: string
  dateTo?: string
  minAmount?: number
  maxAmount?: number
  sortBy?: 'orderDate' | 'totalAmount' | 'profit'
  sortOrder?: 'asc' | 'desc'
}

// ============================================================================
// APPROVAL WORKFLOW (承認)
// ============================================================================

export type ApprovalType = 'proposal' | 'procurement' | 'order'
export type ApprovalStatus = 'pending' | 'approved' | 'rejected'

export interface ApprovalRequest {
  id: string
  type: ApprovalType
  targetId: string
  targetCode?: string
  targetTitle?: string
  requesterName: string
  requestedAt: string
  status: ApprovalStatus
  approverRole: UserRole
  approverName?: string
  approvedAt?: string
  rejectionReason?: string
  notes?: string
}

// ============================================================================
// SALES ACTIVITY MANAGEMENT (営業活動管理)
// ============================================================================

export type SalesActivityStatus = 'planned' | 'in_progress' | 'completed' | 'cancelled'
export type SalesActivityType = 'visit' | 'phone' | 'email' | 'meeting' | 'other'

export interface SalesActivity {
  id: string
  code: string
  customerId: string
  customerName: string
  proposalId?: string
  proposalCode?: string
  assignedTo: string
  assignedToName: string
  type: SalesActivityType
  status: SalesActivityStatus
  title: string
  description?: string
  contactPerson?: string
  interestLevel?: 'high' | 'medium' | 'low'
  activityDate: string
  tags: string[]
  comments?: SalesActivityComment[]
  createdAt: string
  updatedAt: string
}

export interface SalesActivityComment {
  id: string
  userId: string
  userName: string
  content: string
  createdAt: string
}

export interface SalesActivityFilter {
  search?: string
  customerId?: string
  assignedTo?: string
  status?: SalesActivityStatus[]
  type?: SalesActivityType[]
  tags?: string[]
  dateFrom?: string
  dateTo?: string
  sortBy?: 'activityDate' | 'createdAt' | 'customerName'
  sortOrder?: 'asc' | 'desc'
}

// ============================================================================
// TAG MANAGEMENT (タグ管理)
// ============================================================================

export type TagCategory = 'customer' | 'manufacturer' | 'proposal' | 'procurement' | 'activity'

export interface Tag {
  id: string
  name: string
  category: TagCategory
  color?: string
  usageCount: number
  createdAt: string
  updatedAt: string
}

// ============================================================================
// COMMUNICATION HISTORY (送信履歴)
// ============================================================================

export type CommunicationChannel = 'fax' | 'email'
export type CommunicationStatus = 'sent' | 'delivered' | 'failed' | 'pending'

export interface CommunicationRecord {
  id: string
  channel: CommunicationChannel
  procurementId?: string
  procurementCode?: string
  recipientAddress: string
  recipientName?: string
  subject?: string
  status: CommunicationStatus
  sentAt: string
  operatorId: string
  operatorName: string
  notes?: string
}

// ============================================================================
// DAILY REPORT (日報)
// ============================================================================

export interface DailyReportEntry {
  activityId: string
  activityCode: string
  customerName: string
  assignedToName: string
  type: SalesActivityType
  title: string
  description?: string
  activityDate: string
}

export interface DailyReport {
  date: string
  groupBy: 'customer' | 'salesperson'
  groups: {
    key: string
    label: string
    entries: DailyReportEntry[]
  }[]
}

// ============================================================================
// DASHBOARD & ANALYTICS (ダッシュボード)
// ============================================================================

export interface DashboardStat {
  title: string
  value: number | string
  change: number
  changeType: 'increase' | 'decrease' | 'neutral'
  icon?: string
  formatter?: (value: number) => string
}

export interface DashboardChart {
  title: string
  data: Array<{
    label: string
    value: number
  }>
  type: 'line' | 'bar' | 'pie'
}

// ============================================================================
// SETTINGS & MASTER DATA (設定)
// ============================================================================

export type MasterDataType = 'tags' | 'units' | 'productCategories' | 'departments'

export interface MasterDataItem {
  id: string
  code: string
  name: string
  description?: string
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface Settings {
  companyName: string
  companyCode?: string
  defaultCurrency: string
  fiscalYearStart: number // Month (1-12)
  timezone: string
  defaultLanguage: 'ja' | 'en'
  allowMultipleCurrencies: boolean
}

// ============================================================================
// LEGACY COMPATIBILITY (後方互換性)
// ============================================================================

export type SaleStatus = 'paid' | 'failed' | 'refunded'

export interface Mail {
  id: number
  unread?: boolean
  from: User & { status: 'subscribed' | 'unsubscribed' | 'bounced'; location: string }
  subject: string
  body: string
  date: string
}

export interface Member {
  name: string
  username: string
  role: 'member' | 'owner'
  avatar: AvatarProps
}

export interface Stat {
  title: string
  icon: string
  value: number | string
  variation: number
  formatter?: (value: number) => string
}

export interface Sale {
  id: string
  date: string
  status: SaleStatus
  email: string
  amount: number
}

export interface Notification {
  id: number
  unread?: boolean
  sender: any
  body: string
  date: string
}

export type Period = 'daily' | 'weekly' | 'monthly'

export interface Range {
  start: Date
  end: Date
}
