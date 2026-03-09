<script setup lang="ts">
import type { SelectMenuItem } from '@nuxt/ui'

const model = defineModel<string>({ default: '' })

const items = ref([
  {
    label: '00705: 東京電力ホールディングス',
    value: '00705',
    avatar: {
      src: 'https://ui-avatars.com/api/?name=TEPCO&background=0D6EFD&color=fff&size=128',
      alt: '東京電力ホールディングス',
      loading: 'lazy' as const
    }
  },
  {
    label: '01023: トヨタ自動車株式会社',
    value: '01023',
    avatar: {
      src: 'https://ui-avatars.com/api/?name=Toyota&background=EB0A1E&color=fff&size=128',
      alt: 'トヨタ自動車株式会社',
      loading: 'lazy' as const
    }
  },
  {
    label: '01548: ソニーグループ株式会社',
    value: '01548',
    avatar: {
      src: 'https://ui-avatars.com/api/?name=Sony&background=000000&color=fff&size=128',
      alt: 'ソニーグループ株式会社',
      loading: 'lazy' as const
    }
  },
  {
    label: '02101: パナソニック株式会社',
    value: '02101',
    avatar: {
      src: 'https://ui-avatars.com/api/?name=Panasonic&background=0053A0&color=fff&size=128',
      alt: 'パナソニック株式会社',
      loading: 'lazy' as const
    }
  },
  {
    label: '02876: 日立製作所',
    value: '02876',
    avatar: {
      src: 'https://ui-avatars.com/api/?name=Hitachi&background=E60012&color=fff&size=128',
      alt: '日立製作所',
      loading: 'lazy' as const
    }
  },
  {
    label: '03412: 三菱商事株式会社',
    value: '03412',
    avatar: {
      src: 'https://ui-avatars.com/api/?name=Mitsubishi&background=CC0000&color=fff&size=128',
      alt: '三菱商事株式会社',
      loading: 'lazy' as const
    }
  },
  {
    label: '04089: 富士通株式会社',
    value: '04089',
    avatar: {
      src: 'https://ui-avatars.com/api/?name=Fujitsu&background=E4002B&color=fff&size=128',
      alt: '富士通株式会社',
      loading: 'lazy' as const
    }
  },
  {
    label: '04530: NTTデータグループ',
    value: '04530',
    avatar: {
      src: 'https://ui-avatars.com/api/?name=NTT&background=0078D4&color=fff&size=128',
      alt: 'NTTデータグループ',
      loading: 'lazy' as const
    }
  },
  {
    label: '05217: 任天堂株式会社',
    value: '05217',
    avatar: {
      src: 'https://ui-avatars.com/api/?name=Nintendo&background=E60012&color=fff&size=128',
      alt: '任天堂株式会社',
      loading: 'lazy' as const
    }
  },
  {
    label: '05943: 楽天グループ株式会社',
    value: '05943',
    avatar: {
      src: 'https://ui-avatars.com/api/?name=Rakuten&background=BF0000&color=fff&size=128',
      alt: '楽天グループ株式会社',
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
