<script setup lang="ts">
const state = reactive<{ [key: string]: boolean }>({
  email: true,
  desktop: false,
  product_updates: true,
  weekly_digest: false,
  important_updates: true
})

const sections = [{
  title: '通知チャンネル',
  description: '通知を受け取る方法を選択してください。',
  fields: [{
    name: 'email',
    label: 'メール',
    description: '毎日のアクティビティをメールで受け取ります。'
  }, {
    name: 'desktop',
    label: 'デスクトップ',
    description: 'デスクトップ通知を受け取ります。'
  }]
}, {
  title: 'アカウント更新',
  description: 'システム更新の通知を受け取ります。',
  fields: [{
    name: 'weekly_digest',
    label: '週次ダイジェスト',
    description: '週一回のサマリーを受け取ります。'
  }, {
    name: 'product_updates',
    label: 'システム更新',
    description: '新機能および更新の月次メールを受け取ります。'
  }, {
    name: 'important_updates',
    label: '重要な更新',
    description: 'セキュリティ修正やメンテナンスなどの重要な更新を受け取ります。'
  }]
}]

async function onChange() {
  // Do something with data
  console.log(state)
}
</script>

<template>
  <UDashboardPanel>
    <UDashboardNavbar title="通知設定" />
    <div class="p-4 space-y-4 max-w-2xl mx-auto">
      <div v-for="(section, index) in sections" :key="index">
        <UPageCard
          :title="section.title"
          :description="section.description"
          variant="naked"
          class="mb-4"
        />

        <UPageCard variant="subtle" :ui="{ container: 'divide-y divide-default' }">
          <UFormField
            v-for="field in section.fields"
            :key="field.name"
            :name="field.name"
            :label="field.label"
            :description="field.description"
            class="flex items-center justify-between not-last:pb-4 gap-2"
          >
            <USwitch
              v-model="state[field.name]"
              @update:model-value="onChange"
            />
          </UFormField>
        </UPageCard>
      </div>
    </div>
  </UDashboardPanel>
</template>
