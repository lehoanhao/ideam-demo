<script setup lang="ts">
import type { SelectMenuItem } from '@nuxt/ui'

const model = defineModel<string>({ default: '' })

const items = ref([
  {
    label: 'C001: サンプル銀行',
    value: 'cust_001',
    avatar: {
      src: 'https://ui-avatars.com/api/?name=SB&background=0D6EFD&color=fff&size=128',
      alt: 'サンプル銀行',
      loading: 'lazy' as const
    }
  },
  {
    label: 'C002: テスト信用金庫',
    value: 'cust_002',
    avatar: {
      src: 'https://ui-avatars.com/api/?name=TSK&background=2E7D32&color=fff&size=128',
      alt: 'テスト信用金庫',
      loading: 'lazy' as const
    }
  },
  {
    label: 'C003: ダミーファイナンス銀行',
    value: 'cust_003',
    avatar: {
      src: 'https://ui-avatars.com/api/?name=DF&background=6A1B9A&color=fff&size=128',
      alt: 'ダミーファイナンス銀行',
      loading: 'lazy' as const
    }
  },
  {
    label: 'C004: 仮想第一銀行',
    value: 'cust_004',
    avatar: {
      src: 'https://ui-avatars.com/api/?name=KD&background=E65100&color=fff&size=128',
      alt: '仮想第一銀行',
      loading: 'lazy' as const
    }
  },
  {
    label: 'C005: モック資産銀行',
    value: 'cust_005',
    avatar: {
      src: 'https://ui-avatars.com/api/?name=MS&background=00838F&color=fff&size=128',
      alt: 'モック資産銀行',
      loading: 'lazy' as const
    }
  },
  {
    label: 'C006: 開発信用銀行',
    value: 'cust_006',
    avatar: {
      src: 'https://ui-avatars.com/api/?name=KS&background=C62828&color=fff&size=128',
      alt: '開発信用銀行',
      loading: 'lazy' as const
    }
  },
  {
    label: 'C007: テストデータバンク',
    value: 'cust_007',
    avatar: {
      src: 'https://ui-avatars.com/api/?name=TD&background=283593&color=fff&size=128',
      alt: 'テストデータバンク',
      loading: 'lazy' as const
    }
  },
  {
    label: 'C008: ダミー中央銀行',
    value: 'cust_008',
    avatar: {
      src: 'https://ui-avatars.com/api/?name=DC&background=004D40&color=fff&size=128',
      alt: 'ダミー中央銀行',
      loading: 'lazy' as const
    }
  },
  {
    label: 'C009: 開発ファイナンス銀行',
    value: 'cust_009',
    avatar: {
      src: 'https://ui-avatars.com/api/?name=KF&background=AD1457&color=fff&size=128',
      alt: '開発ファイナンス銀行',
      loading: 'lazy' as const
    }
  },
  {
    label: 'C010: テストバンク',
    value: 'cust_010',
    avatar: {
      src: 'https://ui-avatars.com/api/?name=TB&background=0078D4&color=fff&size=128',
      alt: 'テストバンク',
      loading: 'lazy' as const
    }
  }
] satisfies SelectMenuItem[])

const selected = computed({
  get() {
    return items.value.find(i => i.value === model.value) ?? null
  },
  set(item: SelectMenuItem | null) {
    model.value = (item as any)?.value ?? ''
  }
})
</script>

<template>
  <USelectMenu
    v-model="selected"
    :avatar="selected?.avatar"
    :items="items"
    placeholder="顧客を選択"
    class="w-48"
  />
</template>
