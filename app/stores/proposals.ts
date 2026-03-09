import { defineStore } from 'pinia'
import type { Proposal, ProposalFilter } from '~/types'
import { mockProposals, mockProposalFormData } from '~/utils/mock-data'

let _allProposals = [...mockProposals]

export interface FormRowData {
  budgetQty: number | null
  itemGroup: string
  productCode: string
  productName: string
  sellingPrice: string
  packQty: string
  listPrice: string
  budgetPrice: number | null
  catalogName: string
  catalogPage: string
  manufacturerName: string
  accountName: string
  rfqType: string
  requestDate: string
  costPrice: string
  sampleQty: string
  arrivalDate: string
  costNotes: string
  deliveryNotes: string
  adoptionType: string
  contactDate: string
}

export function createEmptyRowData(): FormRowData {
  return {
    budgetQty: null,
    itemGroup: '',
    productCode: '',
    productName: '',
    sellingPrice: '',
    packQty: '',
    listPrice: '',
    budgetPrice: null,
    catalogName: '',
    catalogPage: '',
    manufacturerName: '',
    accountName: '',
    rfqType: '',
    requestDate: '',
    costPrice: '',
    sampleQty: '',
    arrivalDate: '',
    costNotes: '',
    deliveryNotes: '',
    adoptionType: '',
    contactDate: ''
  }
}

export interface FormRow {
  id: number
  data: FormRowData
  createdAt: string
  updatedAt: string | null
}

export interface RivalEntry {
  id: number
  rival: string
  note: string
}

export const FORM_ROW_FIELDS = [
  { key: 'budgetQty', label: '予算数' },
  { key: 'itemGroup', label: '品群' },
  { key: 'productCode', label: '品番' },
  { key: 'productName', label: '品名' },
  { key: 'sellingPrice', label: '売上単価' },
  { key: 'packQty', label: '入数' },
  { key: 'listPrice', label: '定価' },
  { key: 'budgetPrice', label: '予算単価' },
  { key: 'catalogName', label: 'カタログ名' },
  { key: 'catalogPage', label: '掲載ページ' },
  { key: 'manufacturerName', label: 'メーカー名' },
  { key: 'accountName', label: '帳合先' },
  { key: 'rfqType', label: '見積依頼区分' },
  { key: 'requestDate', label: '依頼日' },
  { key: 'costPrice', label: '原価' },
  { key: 'sampleQty', label: 'サンプル数' },
  { key: 'arrivalDate', label: '入荷日' },
  { key: 'costNotes', label: '備考(原価明細他)' },
  { key: 'deliveryNotes', label: '納期/備考' },
  { key: 'adoptionType', label: '採用区分' },
  { key: 'contactDate', label: '連絡日' }
] as const

export interface NoteEntry {
  id: number
  text: string
  rowId: number | null
  fieldKey: string
}

export interface HighlightTarget {
  rowId: number
  fieldKey: string
}

export interface ProcessHistoryEntry {
  step: number
  userName: string
  userAvatar?: string
  completedAt: string
}

let _nextRowId = 1
let _nextRivalId = 1
let _nextNoteId = 1

interface ProposalState {
  proposals: Proposal[]
  selectedProposal: Proposal | null
  loading: boolean
  error: string | null
  filters: ProposalFilter
  totalCount: number
  formRows: FormRow[]
  rivals: RivalEntry[]
  notes: NoteEntry[]
  processHistory: ProcessHistoryEntry[]
  highlights: HighlightTarget[]
  pickingNoteId: number | null
  activeNoteId: number | null
  pickingCommentId: number | null
}

export const useProposalStore = defineStore('proposals', {
  state: (): ProposalState => ({
    proposals: [],
    selectedProposal: null,
    loading: false,
    error: null,
    filters: {},
    totalCount: 0,
    formRows: [{ id: _nextRowId++, data: createEmptyRowData(), createdAt: new Date().toISOString(), updatedAt: null }],
    rivals: [{ id: _nextRivalId++, rival: '', note: '' }],
    notes: [],
    processHistory: [],
    highlights: [],
    pickingNoteId: null,
    activeNoteId: null,
    pickingCommentId: null
  }),

  getters: {
    draftProposals: state => state.proposals.filter(p => p.status === 'draft'),
    pendingApproval: state => state.proposals.filter(p => p.approvalStatus === 'pending'),
    totalAmount: state => state.proposals.reduce((sum, p) => sum + p.totalAmount, 0)
  },

  actions: {
    async fetchProposals(filters?: ProposalFilter) {
      this.loading = true
      this.error = null
      try {
        const f = filters || this.filters
        let data = [..._allProposals]
        if (f.search) {
          const q = f.search.toLowerCase()
          data = data.filter(p => p.title?.toLowerCase().includes(q) || p.code?.toLowerCase().includes(q) || p.customerName?.toLowerCase().includes(q))
        }
        if (f.status) data = data.filter(p => p.status === f.status)
        this.proposals = data
        this.totalCount = data.length
        if (filters) this.filters = filters
      } finally {
        this.loading = false
      }
    },

    async getProposalById(id: string) {
      this.loading = true
      this.error = null
      try {
        const data = _allProposals.find(p => p.id === id) || null
        this.selectedProposal = data
        return data
      } finally {
        this.loading = false
      }
    },

    async createProposal(data: Omit<Proposal, 'id' | 'code' | 'createdAt' | 'updatedAt'>) {
      this.loading = true
      this.error = null
      try {
        const now = new Date().toISOString()
        const newProposal: Proposal = {
          ...data,
          id: `prop_${String(_allProposals.length + 1).padStart(3, '0')}`,
          code: `P2026-${String(_allProposals.length + 1).padStart(3, '0')}`,
          createdAt: now,
          updatedAt: now
        }
        _allProposals.unshift(newProposal)
        this.proposals.unshift(newProposal)
        this.totalCount++
        return newProposal
      } finally {
        this.loading = false
      }
    },

    async updateProposal(id: string, data: Partial<Proposal>) {
      this.loading = true
      this.error = null
      try {
        const idx = _allProposals.findIndex(p => p.id === id)
        if (idx === -1) throw new Error('Not found')
        const updated = { ..._allProposals[idx], ...data, updatedAt: new Date().toISOString() }
        _allProposals[idx] = updated
        const storeIdx = this.proposals.findIndex(p => p.id === id)
        if (storeIdx !== -1) this.proposals[storeIdx] = updated
        if (this.selectedProposal?.id === id) this.selectedProposal = updated
        return updated
      } finally {
        this.loading = false
      }
    },

    async deleteProposal(id: string) {
      this.loading = true
      this.error = null
      try {
        _allProposals = _allProposals.filter(p => p.id !== id)
        this.proposals = this.proposals.filter(p => p.id !== id)
        this.totalCount--
        if (this.selectedProposal?.id === id) this.selectedProposal = null
      } finally {
        this.loading = false
      }
    },

    setFilters(filters: ProposalFilter) {
      this.filters = filters
    },

    addFormRow() {
      this.formRows.push({ id: _nextRowId++, data: createEmptyRowData(), createdAt: new Date().toISOString(), updatedAt: null })
    },

    addFormRowsFromProducts(products: { productCode: string, productName: string, sellingPrice: string }[]) {
      for (const p of products) {
        const data = createEmptyRowData()
        data.productCode = p.productCode
        data.productName = p.productName
        data.sellingPrice = p.sellingPrice
        data.packQty = '1'
        this.formRows.push({ id: _nextRowId++, data, createdAt: new Date().toISOString(), updatedAt: null })
      }
    },

    removeFormRow(id: number) {
      if (this.formRows.length <= 1) return
      this.formRows = this.formRows.filter(r => r.id !== id)
    },

    duplicateFormRow(id: number) {
      const idx = this.formRows.findIndex(r => r.id === id)
      if (idx !== -1) {
        const clonedData = { ...this.formRows[idx].data }
        this.formRows.splice(idx + 1, 0, { id: _nextRowId++, data: clonedData, createdAt: new Date().toISOString(), updatedAt: null })
      }
    },

    // Rivals
    addRival() {
      this.rivals.push({ id: _nextRivalId++, rival: '', note: '' })
    },

    removeRival(id: number) {
      this.rivals = this.rivals.filter(r => r.id !== id)
    },

    // Notes
    addNote() {
      this.notes.push({ id: _nextNoteId++, text: '', rowId: null, fieldKey: '' })
    },

    removeNote(id: number) {
      this.notes = this.notes.filter(n => n.id !== id)
    },

    startPicking(noteId: number) {
      this.pickingNoteId = noteId
      this.pickingCommentId = null
    },

    cancelPicking() {
      this.pickingNoteId = null
    },

    startCommentPicking(commentId: number) {
      this.pickingCommentId = commentId
      this.pickingNoteId = null
    },

    cancelCommentPicking() {
      this.pickingCommentId = null
    },

    pickField(rowId: number, fieldKey: string) {
      if (this.pickingNoteId === null) return
      const noteId = this.pickingNoteId
      const note = this.notes.find(n => n.id === noteId)
      if (note) {
        note.rowId = rowId
        note.fieldKey = fieldKey
      }
      this.pickingNoteId = null
      this.activeNoteId = noteId
      this.highlights = [{ rowId, fieldKey }]
    },

    setHighlights(targets: HighlightTarget[]) {
      this.highlights = targets
    },

    toggleActiveNote(noteId: number) {
      if (this.activeNoteId === noteId) {
        this.activeNoteId = null
        this.highlights = []
      } else {
        this.activeNoteId = noteId
        const note = this.notes.find(n => n.id === noteId)
        if (note?.rowId && note.fieldKey) {
          this.highlights = [{ rowId: note.rowId, fieldKey: note.fieldKey }]
        } else {
          this.highlights = []
        }
      }
    },

    async loadProposalIntoForm(id: string) {
      this.loading = true
      this.error = null
      try {
        const proposal = _allProposals.find(p => p.id === id) || null
        this.selectedProposal = proposal

        const formData = mockProposalFormData[id]

        if (formData?.formRows && formData.formRows.length > 0) {
          this.formRows = formData.formRows
        } else {
          this.formRows = [{ id: 1, data: createEmptyRowData(), createdAt: new Date().toISOString(), updatedAt: null }]
        }

        if (formData?.rivals && formData.rivals.length > 0) {
          this.rivals = formData.rivals
        } else {
          this.rivals = [{ id: 1, rival: '', note: '' }]
        }

        if (formData?.notes && formData.notes.length > 0) {
          this.notes = formData.notes
        } else {
          this.notes = []
        }

        if (formData?.processHistory && formData.processHistory.length > 0) {
          this.processHistory = formData.processHistory
        } else {
          this.processHistory = []
        }

        return proposal
      } finally {
        this.loading = false
      }
    },

    resetForm() {
      this.selectedProposal = null
      this.formRows = [{ id: 1, data: createEmptyRowData(), createdAt: new Date().toISOString(), updatedAt: null }]
      this.rivals = [{ id: 1, rival: '', note: '' }]
      this.notes = []
      this.processHistory = []
      this.highlights = []
      this.pickingNoteId = null
      this.activeNoteId = null
      this.pickingCommentId = null
    }
  }
})
