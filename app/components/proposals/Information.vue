<template>
  <div class="space-y-3">
    <UFormField label="担当者" class="w-full">
      <UsersSelect class="w-full" />
    </UFormField>
    <UFormField label="顧客" class="w-full">
      <CustomersSelect class="w-full" />
    </UFormField>
    <UFormField label="部門" class="w-full">
      <ProposalsDepartmentSelect class="w-full" />
    </UFormField>
    <UFormField label="大分類" class="w-full">
      <ProposalsCategorySelect class="w-full" />
    </UFormField>
    <UFormField label="目的" class="w-full">
      <ProposalsPurposeSelect class="w-full" />
    </UFormField>
    <UFormField label="固有名" class="w-full">
      <UInput class="w-full" placeholder="固有名を入力" />
    </UFormField>
  </div>
</template>
