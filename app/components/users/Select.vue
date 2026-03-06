<script setup lang="ts">
import type { SelectMenuItem } from '@nuxt/ui'

const items = ref([
  {
    label: '01: 田中 太郎',
    value: '01',
    avatar: {
      src: 'https://i.pravatar.cc/128?u=tanaka_taro',
      alt: '田中 太郎',
      loading: 'lazy' as const
    }
  },
  {
    label: '02: 佐藤 花子',
    value: '02',
    avatar: {
      src: 'https://i.pravatar.cc/128?u=sato_hanako',
      alt: '佐藤 花子',
      loading: 'lazy' as const
    }
  },
  {
    label: '03: 鈴木 一郎',
    value: '03',
    avatar: {
      src: 'https://i.pravatar.cc/128?u=suzuki_ichiro',
      alt: '鈴木 一郎',
      loading: 'lazy' as const
    }
  },
  {
    label: '04: 高橋 美咲',
    value: '04',
    avatar: {
      src: 'https://i.pravatar.cc/128?u=takahashi_misaki',
      alt: '高橋 美咲',
      loading: 'lazy' as const
    }
  },
  {
    label: '05: 渡辺 健太',
    value: '05',
    avatar: {
      src: 'https://i.pravatar.cc/128?u=watanabe_kenta',
      alt: '渡辺 健太',
      loading: 'lazy' as const
    }
  },
  {
    label: '06: 伊藤 さくら',
    value: '06',
    avatar: {
      src: 'https://i.pravatar.cc/128?u=ito_sakura',
      alt: '伊藤 さくら',
      loading: 'lazy' as const
    }
  },
  {
    label: '07: 山本 大輔',
    value: '07',
    avatar: {
      src: 'https://i.pravatar.cc/128?u=yamamoto_daisuke',
      alt: '山本 大輔',
      loading: 'lazy' as const
    }
  },
  {
    label: '08: 中村 優子',
    value: '08',
    avatar: {
      src: 'https://i.pravatar.cc/128?u=nakamura_yuko',
      alt: '中村 優子',
      loading: 'lazy' as const
    }
  },
  {
    label: '09: 小林 翔太',
    value: '09',
    avatar: {
      src: 'https://i.pravatar.cc/128?u=kobayashi_shota',
      alt: '小林 翔太',
      loading: 'lazy' as const
    }
  },
  {
    label: '10: 加藤 真理',
    value: '10',
    avatar: {
      src: 'https://i.pravatar.cc/128?u=kato_mari',
      alt: '加藤 真理',
      loading: 'lazy' as const
    }
  }
] satisfies SelectMenuItem[])

const value = ref(items.value[0])
</script>

<template>
  <USelectMenu
    v-model="value"
    :avatar="value?.avatar"
    :items="items"
    class="w-48"
  />
</template>
