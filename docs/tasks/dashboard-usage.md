You are GitHub Copilot Coding Agent acting as a Senior Nuxt 3 + Nuxt UI Pro + Data Visualization Engineer.

Task: Implement a production-ready Usage Dashboard screen using Nuxt 3 + Nuxt UI Pro. Do NOT use mock data. Data must come from an existing Pinia store named `usageStore` which provides an async action `fetchAllTenantsUsages()` that returns/sets the JSON payload shape below.

DATA SHAPE (from store state after fetch):
{
  "from_date": "YYYY-MM-DD",
  "to_date": "YYYY-MM-DD",
  "usages": [
    {
      "tenant_id": "string",
      "usage": {
        "azure_search": { "total": number, "usage": [{ "endpoint": string, "index_name": string, "count": number }] },
        "batch": { "total": number, "usage": [{ "chat_model_name": string, "embedding_model_name": string, "token_count": number, "prompt_tokens": number, "completion_tokens": number }] },
        "chat": { "total": number, "queries": number, "usage": [{ "chat_model_name": string|null, "embedding_model_name": string|null, "token_count": number, "prompt_tokens": number, "completion_tokens": number, "queries": number }] },
        "google_search": { "total": number },
        "knowledge": { "total": number, "usage": [{ "storage_account_name": string, "container_name": string, "documents_count": number, "contents_count": number }] }
      }
    }
  ]
}

DATA SAMPLE:
docs/api/usage-sample.json

TECH STACK (MUST FOLLOW)
- Nuxt 3 + TypeScript
- Nuxt UI Pro (@nuxt/ui-pro) components primarily
- Tailwind CSS utilities
- Icons: Iconify (Heroicons + Simple Icons)
- State: Pinia + pinia-plugin-persistedstate (filters persisted)
- Validation: Zod
- Charts: ECharts preferred (Unovis optional)
- Editor: CodeMirror 6 (Raw JSON tab)

IMPORTANT:
- Use store data, not mock JSON.
- Handle loading/error/empty states with Nuxt UI Pro skeletons and alerts.
- “front-design skills”: modern SaaS dashboard aesthetic with strong hierarchy, spacing, and responsive layout.

---------------------------------------
DELIVERABLE FILES (create/modify)
---------------------------------------
1) app/pages/operator/index.vue

2) components/usage/
- UsageDashboardLayout.vue
- UsageKpiCards.vue
- UsageFiltersPanel.vue
- UsageTenantDrilldownDrawer.vue
- UsageRawJsonViewer.vue (CodeMirror 6)

3) components/usage/charts/ (ECharts)
- UsageChartTenantUsageStackedBar.vue
- UsageChartServiceDistributionDonut.vue
- UsageChartPromptVsCompletionStackedBar.vue
- UsageChartChatModelBreakdownBar.vue
- UsageChartGoogleSearchBar.vue

4) components/usage/tables/
- UsageTableTenantRankingTable.vue
- UsageTableAzureSearchIndexTable.vue
- UsageTableKnowledgeContainerTable.vue

5) composables/
- useUsageDashboard.ts (connect store -> transforms -> filtered VMs)

6) stores/
- usageDashboardFilters.ts (Pinia persisted filters ONLY; do not replace usageStore)
   (If such store exists already, extend it.)

7) lib/usage/
- types.ts (Zod schema + TS types)
- transform.ts (pure transform functions)
- format.ts (compact number, percent, date range, safe division)
- csv.ts (export rows)

---------------------------------------
STORE INTEGRATION
---------------------------------------
Assume there is a Pinia store in `stores/usageStore.ts` (already exists).
Use it like:
const usageStore = useUsageStore()
and it exposes:
- action: `fetchAllTenantsUsages()` which fetches and populates the payload.
- add state and getters as needed

Implementation requirement:
- In `app/pages/operator/index.vue`, call `await usageStore.fetchAllTenantsUsages()` on mounted (or useAsyncData) and handle pending/error.
- Do not change the behavior of usageStore; only consume it.

If the exact property name for the payload in the store is unknown, implement a small resolver in the composable that checks common keys:
- usageStore.data
- usageStore.usagesData
- usageStore.payload
Pick the first truthy. (Do NOT ask user.)

---------------------------------------
VALIDATION (lib/usage/types.ts)
---------------------------------------
- Implement Zod schema for the payload.
- In composable, validate store payload once:
  const parsed = UsagePayloadSchema.safeParse(payload)
- If invalid, show an error UAlert with readable message and a “Copy error details” button.

---------------------------------------
FILTER STATE (stores/usageDashboardFilters.ts)
---------------------------------------
Persist:
- selectedTenants: string[]
- selectedServices: ("chat"|"batch"|"azure_search"|"knowledge"|"google_search")[]
- tenantSearch: string
- tableSort: { key: string, direction: "asc"|"desc" }
- tablePage, tablePageSize
- drilldownTenantId: string|null
- activeTab: "overview"|"tenants"|"operations"|"raw"
Use persistedstate.

---------------------------------------
NUXT UI PRO PAGE + SKELETON UI (MUST DO)
---------------------------------------
Build page with Nuxt UI Pro layout primitives:

In `app/pages/operator/index.vue`:
- Use <UPage> and <UPageHeader>:
  title: "Usage Dashboard"
  description: "Tenant & service usage analytics"
  actions: Refresh button and Export CSV button (export filtered tenant table)

- Use <UTabs> (persist active tab):
  Tabs:
  1) Overview
  2) Tenants
  3) Operations
  4) Raw JSON

- Global Filters panel at top (inside UCard):
  <UsageFiltersPanel />

SKELETON STATES:
- While loading:
  show a full skeleton layout, not a spinner:
  - KPI cards skeleton (4-6 cards)
  - chart skeleton blocks
  - table skeleton rows
Use <USkeleton> and <UCard> placeholders.

- On error:
  <UAlert color="red" icon="i-heroicons-exclamation-triangle">
    Show message + Retry button.
  </UAlert>

- On empty data (no usages or filtered out):
  <UCard>
    Icon + "No data" + Reset filters button.
  </UCard>

---------------------------------------
COMPONENT REQUIREMENTS (Nuxt UI Pro style)
---------------------------------------
1) UsageDashboardLayout.vue
- Responsible for section spacing, responsive grids, and consistent card headers.
- Provide slots: filters, kpis, charts, tables.
- Use Tailwind grid: `grid grid-cols-1 lg:grid-cols-12 gap-4`.

2) UsageKpiCards.vue
- Use UCard for each KPI and UTooltip for metric definitions.
- Display:
  - Date range
  - Total tokens (chat+batch)
  - Total chat queries
  - Active tenants
  - Most used service
  - Avg tokens/query
- Use compact formatting.

3) UsageFiltersPanel.vue
- Use:
  - USelectMenu multiple for tenants
  - UButtonGroup or UCheckboxGroup for services
  - UInput for tenant search
  - Reset button
- Show UBadge counts.
- Persist to filters store.

4) UsageTableTenantRankingTable.vue
- Use UTable with sortable columns + UPagination.
- Provide CSV export for filtered rows.
- Row click sets drilldownTenantId and opens drawer.

Columns:
tenant_id, tokens_all, chat_total, batch_total, chat_queries, tokens_per_query, share_pct,
azure_search_total, knowledge_total, google_search_total

5) Charts (ECharts components)
Each chart component:
- Accept props: data (already transformed & filtered)
- Create ECharts instance on mounted; dispose on unmounted.
- Watch props deeply and setOption(notMerge=true).
- Use theme-friendly defaults (avoid hardcoded colors).

Charts:
- UsageChartTenantUsageStackedBar: stacked per tenant for enabled services.
- UsageChartServiceDistributionDonut: donut of enabled services.
- UsageChartPromptVsCompletionStackedBar: per tenant prompt vs completion (chat only).
- UsageChartChatModelBreakdownBar: global tokens by model (include "(unknown)").
- UsageChartGoogleSearchBar: per tenant google_search total.

6) Operations tables:
- UsageTableAzureSearchIndexTable: rows by tenant+endpoint+index_name with count; filterable by tenant.
- UsageTableKnowledgeContainerTable: rows by tenant+container_name with documents_count, contents_count; show totals footer.

7) UsageTenantDrilldownDrawer.vue
- Use UDrawer (right side).
- When open:
  - Show tenant KPI mini cards
  - Model breakdown table (Nuxt UI table)
  - Prompt vs completion mini chart
  - Azure Search and Knowledge tables filtered to tenant
  - Google search badge
- Close resets drilldownTenantId.

8) UsageRawJsonViewer.vue
- Use CodeMirror 6 read-only.
- Show validated payload as pretty JSON with search.

---------------------------------------
COMPOSABLE (useUsageDashboard.ts)
---------------------------------------
- Connect: usageStore payload -> Zod parse -> transforms -> filtered VMs
- Expose:
  - pending, error, parsedPayload
  - kpis, donutData, tenantBarsData, promptCompletionData, modelBarData
  - tenantRankingRows, azureIndexRows, knowledgeRows
  - handlers: refresh, resetFilters, exportCsv, openTenant, closeTenant

---------------------------------------
NOW IMPLEMENT
---------------------------------------
Implement all files with complete code.
Then the page and components with skeleton UI using Nuxt UI Pro.

Do NOT ask questions. Make reasonable assumptions for store property names and provide a small resolver.
