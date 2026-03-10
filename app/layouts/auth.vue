<template>
  <div class="h-screen flex overflow-hidden">
    <!-- Left panel — branding & decoration -->
    <div
      class="hidden lg:flex lg:w-1/2 relative bg-linear-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-blue-800 dark:via-blue-900 dark:to-indigo-950 text-white flex-col justify-between p-12 overflow-hidden"
    >
      <!-- Animated grid background -->
      <div class="absolute inset-0 opacity-10">
        <div
          class="absolute inset-0"
          style="
            background-image:
              linear-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px),
              linear-gradient(
                90deg,
                rgba(255, 255, 255, 0.15) 1px,
                transparent 1px
              );
            background-size: 40px 40px;
          "
        />
      </div>

      <!-- Floating accent shapes -->
      <div
        class="absolute -top-20 -left-20 size-72 rounded-full bg-white/5 blur-3xl animate-pulse"
      />
      <div
        class="absolute top-1/3 -right-16 size-56 rounded-full bg-indigo-400/10 blur-2xl animate-pulse [animation-delay:2s]"
      />
      <div
        class="absolute -bottom-24 left-1/4 size-64 rounded-full bg-sky-300/10 blur-3xl animate-pulse [animation-delay:4s]"
      />

      <!-- Logo -->
      <div class="relative z-10 flex items-center gap-3">
        <div
          class="flex items-center justify-center size-10 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20"
        >
          <AppLogo :collapsed="true" />
        </div>
        <span class="text-xl font-bold tracking-tight">iDeam Systems</span>
      </div>

      <!-- Feature highlights -->
      <div class="relative z-10 space-y-8 max-w-md">
        <h2 class="text-3xl font-bold leading-tight">
          スマートに管理。<br>シームレスに連携。
        </h2>
        <p class="text-blue-100 text-base leading-relaxed">
          提案を通じて、企業様のステークホルダーとの絆づくりをバックアップします。
        </p>

        <!-- Connected feature cards -->
        <div class="relative grid grid-cols-2 gap-4">
          <!-- Connection lines (SVG) -->
          <svg
            class="absolute inset-0 w-full h-full pointer-events-none z-0"
            preserveAspectRatio="none"
          >
            <!-- Horizontal top -->
            <line
              x1="42%"
              y1="28%"
              x2="58%"
              y2="28%"
              stroke="rgba(255,255,255,0.2)"
              stroke-width="1.5"
              stroke-dasharray="4 3"
            />
            <!-- Horizontal bottom -->
            <line
              x1="42%"
              y1="72%"
              x2="58%"
              y2="72%"
              stroke="rgba(255,255,255,0.2)"
              stroke-width="1.5"
              stroke-dasharray="4 3"
            />
            <!-- Vertical left -->
            <line
              x1="25%"
              y1="42%"
              x2="25%"
              y2="58%"
              stroke="rgba(255,255,255,0.2)"
              stroke-width="1.5"
              stroke-dasharray="4 3"
            />
            <!-- Vertical right -->
            <line
              x1="75%"
              y1="42%"
              x2="75%"
              y2="58%"
              stroke="rgba(255,255,255,0.2)"
              stroke-width="1.5"
              stroke-dasharray="4 3"
            />
            <!-- Diagonal -->
            <line
              x1="42%"
              y1="38%"
              x2="58%"
              y2="62%"
              stroke="rgba(255,255,255,0.1)"
              stroke-width="1"
              stroke-dasharray="3 4"
            />
            <line
              x1="58%"
              y1="38%"
              x2="42%"
              y2="62%"
              stroke="rgba(255,255,255,0.1)"
              stroke-width="1"
              stroke-dasharray="3 4"
            />
            <!-- Center node -->
            <circle
              cx="50%"
              cy="50%"
              r="4"
              fill="rgba(255,255,255,0.25)"
            />
          </svg>

          <div
            v-for="item in features"
            :key="item.label"
            class="relative z-10 flex items-start gap-3 rounded-xl backdrop-blur-sm border p-3"
            :class="item.cardClass"
          >
            <div
              class="flex items-center justify-center size-8 rounded-lg shrink-0 mt-0.5"
              :class="item.iconClass"
            >
              <UIcon :name="item.icon" size="sm" />
            </div>
            <div>
              <p class="text-sm font-semibold">
                {{ item.label }}
              </p>
              <p class="text-xs mt-0.5" :class="item.descClass">
                {{ item.desc }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom tagline -->
      <p class="relative z-10 text-xs text-blue-200">
        &copy; {{ new Date().getFullYear() }} iDeam Systems —
        統合業務管理プラットフォーム
      </p>
    </div>

    <!-- Right panel — form -->
    <div
      class="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-6"
    >
      <div class="w-full max-w-sm">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const features = [
  {
    icon: 'i-lucide-file-text',
    label: '提案管理',
    desc: '案件を一括管理',
    cardClass: 'bg-amber-500/15 border-amber-400/20',
    iconClass: 'bg-amber-400/25 text-amber-100',
    descClass: 'text-amber-200'
  },
  {
    icon: 'i-lucide-users',
    label: '顧客管理',
    desc: 'CRM統合',
    cardClass: 'bg-emerald-500/15 border-emerald-400/20',
    iconClass: 'bg-emerald-400/25 text-emerald-100',
    descClass: 'text-emerald-200'
  },
  {
    icon: 'i-lucide-shopping-cart',
    label: '仕入れ管理',
    desc: '発注・納品追跡',
    cardClass: 'bg-violet-500/15 border-violet-400/20',
    iconClass: 'bg-violet-400/25 text-violet-100',
    descClass: 'text-violet-200'
  },
  {
    icon: 'i-lucide-activity',
    label: '営業活動',
    desc: 'KPI分析・可視化',
    cardClass: 'bg-sky-500/15 border-sky-400/20',
    iconClass: 'bg-sky-400/25 text-sky-100',
    descClass: 'text-sky-200'
  }
]
</script>
