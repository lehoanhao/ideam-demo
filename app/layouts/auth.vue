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

      <!-- ═══ Animated network / connection background ═══ -->
      <svg class="absolute inset-0 w-full h-full pointer-events-none z-[1]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Glow filter for nodes -->
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <!-- Animated gradient for lines -->
          <linearGradient
            id="lineGrad1"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stop-color="rgba(255,255,255,0)" />
            <stop offset="50%" stop-color="rgba(255,255,255,0.3)" />
            <stop offset="100%" stop-color="rgba(255,255,255,0)" />
          </linearGradient>
          <linearGradient
            id="lineGrad2"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stop-color="rgba(165,180,252,0)" />
            <stop offset="50%" stop-color="rgba(165,180,252,0.25)" />
            <stop offset="100%" stop-color="rgba(165,180,252,0)" />
          </linearGradient>
        </defs>

        <!-- Network connection lines -->
        <g class="network-lines">
          <line
            x1="10%"
            y1="15%"
            x2="30%"
            y2="25%"
            class="conn-line conn-line-1"
          />
          <line
            x1="30%"
            y1="25%"
            x2="55%"
            y2="12%"
            class="conn-line conn-line-2"
          />
          <line
            x1="55%"
            y1="12%"
            x2="85%"
            y2="20%"
            class="conn-line conn-line-3"
          />
          <line
            x1="85%"
            y1="20%"
            x2="70%"
            y2="40%"
            class="conn-line conn-line-4"
          />
          <line
            x1="70%"
            y1="40%"
            x2="90%"
            y2="55%"
            class="conn-line conn-line-5"
          />
          <line
            x1="30%"
            y1="25%"
            x2="20%"
            y2="50%"
            class="conn-line conn-line-6"
          />
          <line
            x1="20%"
            y1="50%"
            x2="40%"
            y2="60%"
            class="conn-line conn-line-7"
          />
          <line
            x1="40%"
            y1="60%"
            x2="70%"
            y2="40%"
            class="conn-line conn-line-2"
          />
          <line
            x1="15%"
            y1="80%"
            x2="40%"
            y2="60%"
            class="conn-line conn-line-3"
          />
          <line
            x1="40%"
            y1="60%"
            x2="65%"
            y2="75%"
            class="conn-line conn-line-1"
          />
          <line
            x1="65%"
            y1="75%"
            x2="90%"
            y2="55%"
            class="conn-line conn-line-4"
          />
          <line
            x1="65%"
            y1="75%"
            x2="80%"
            y2="90%"
            class="conn-line conn-line-5"
          />
          <line
            x1="15%"
            y1="80%"
            x2="35%"
            y2="92%"
            class="conn-line conn-line-6"
          />
          <line
            x1="55%"
            y1="12%"
            x2="70%"
            y2="40%"
            class="conn-line conn-line-7"
          />
          <line
            x1="20%"
            y1="50%"
            x2="15%"
            y2="80%"
            class="conn-line conn-line-1"
          />
        </g>

        <!-- Animated data-flow particles along paths -->
        <g class="data-particles">
          <circle r="2" fill="rgba(165,180,252,0.8)" filter="url(#glow)">
            <animateMotion dur="4s" repeatCount="indefinite" path="M48,72 L144,120 L264,58 L408,96" />
          </circle>
          <circle r="1.5" fill="rgba(196,181,253,0.7)" filter="url(#glow)">
            <animateMotion
              dur="5s"
              repeatCount="indefinite"
              path="M408,96 L336,192 L432,264 L312,288"
              begin="1s"
            />
          </circle>
          <circle r="2" fill="rgba(147,197,253,0.8)" filter="url(#glow)">
            <animateMotion
              dur="6s"
              repeatCount="indefinite"
              path="M96,384 L192,288 L312,288 L312,360"
              begin="2s"
            />
          </circle>
          <circle r="1.5" fill="rgba(255,255,255,0.6)" filter="url(#glow)">
            <animateMotion
              dur="3.5s"
              repeatCount="indefinite"
              path="M264,58 L336,192 L192,288 L96,240"
              begin="0.5s"
            />
          </circle>
        </g>

        <!-- Network nodes (circles at intersections) -->
        <g class="network-nodes" filter="url(#glow)">
          <circle
            cx="10%"
            cy="15%"
            r="3"
            class="node node-pulse-1"
          />
          <circle
            cx="30%"
            cy="25%"
            r="4"
            class="node node-pulse-2"
          />
          <circle
            cx="55%"
            cy="12%"
            r="3.5"
            class="node node-pulse-3"
          />
          <circle
            cx="85%"
            cy="20%"
            r="3"
            class="node node-pulse-1"
          />
          <circle
            cx="70%"
            cy="40%"
            r="4.5"
            class="node node-pulse-4"
          />
          <circle
            cx="90%"
            cy="55%"
            r="3"
            class="node node-pulse-2"
          />
          <circle
            cx="20%"
            cy="50%"
            r="4"
            class="node node-pulse-3"
          />
          <circle
            cx="40%"
            cy="60%"
            r="5"
            class="node node-pulse-1"
          />
          <circle
            cx="15%"
            cy="80%"
            r="3.5"
            class="node node-pulse-4"
          />
          <circle
            cx="65%"
            cy="75%"
            r="4"
            class="node node-pulse-2"
          />
          <circle
            cx="80%"
            cy="90%"
            r="3"
            class="node node-pulse-3"
          />
          <circle
            cx="35%"
            cy="92%"
            r="3"
            class="node node-pulse-1"
          />
        </g>

        <!-- Outer rings on some nodes -->
        <g class="node-rings">
          <circle
            cx="30%"
            cy="25%"
            r="8"
            class="ring ring-1"
          />
          <circle
            cx="70%"
            cy="40%"
            r="10"
            class="ring ring-2"
          />
          <circle
            cx="40%"
            cy="60%"
            r="9"
            class="ring ring-3"
          />
          <circle
            cx="65%"
            cy="75%"
            r="8"
            class="ring ring-4"
          />
        </g>
      </svg>

      <!-- Floating particles layer -->
      <div class="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        <div class="particle particle-1" />
        <div class="particle particle-2" />
        <div class="particle particle-3" />
        <div class="particle particle-4" />
        <div class="particle particle-5" />
        <div class="particle particle-6" />
        <div class="particle particle-7" />
        <div class="particle particle-8" />
      </div>

      <!-- Logo -->
      <div class="relative z-10 flex items-center gap-4">
        <AppLogo :collapsed="true" variant="light" class="scale-125" />
        <AppTitle :collapsed="false" variant="light" class="!text-2xl" />
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
            class="feature-card relative z-10 flex items-start gap-3 rounded-xl backdrop-blur-sm border p-3 cursor-pointer transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-1 hover:shadow-lg hover:shadow-white/10 hover:border-white/30"
            :class="item.cardClass"
          >
            <div
              class="flex items-center justify-center size-8 rounded-lg shrink-0 mt-0.5 transition-all duration-300"
              :class="item.iconClass"
            >
              <UIcon :name="item.icon" size="sm" class="transition-transform duration-300" />
            </div>
            <div>
              <p class="text-sm font-semibold transition-colors duration-300">
                {{ item.label }}
              </p>
              <p class="text-xs mt-0.5 transition-colors duration-300" :class="item.descClass">
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

<style scoped>
.feature-card {
  will-change: transform;
}

.feature-card:hover {
  backdrop-filter: blur(12px);
  background-color: rgba(255, 255, 255, 0.08);
}

.feature-card:hover .size-8 {
  transform: scale(1.15);
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.2);
}

.feature-card:hover :deep(.iconify) {
  transform: rotate(-8deg) scale(1.1);
}

/* ═══ Network connection lines ═══ */
.conn-line {
  stroke: rgba(255, 255, 255, 0.08);
  stroke-width: 1;
  stroke-dasharray: 6 4;
  stroke-dashoffset: 0;
}
.conn-line-1 { animation: dash-flow 8s linear infinite; }
.conn-line-2 { animation: dash-flow 10s linear infinite reverse; }
.conn-line-3 { animation: dash-flow 7s linear infinite; animation-delay: 1s; }
.conn-line-4 { animation: dash-flow 9s linear infinite reverse; animation-delay: 2s; }
.conn-line-5 { animation: dash-flow 6s linear infinite; animation-delay: 0.5s; }
.conn-line-6 { animation: dash-flow 11s linear infinite reverse; animation-delay: 3s; }
.conn-line-7 { animation: dash-flow 8s linear infinite; animation-delay: 1.5s; }

@keyframes dash-flow {
  to { stroke-dashoffset: -60; }
}

/* ═══ Network nodes ═══ */
.node {
  fill: rgba(199, 210, 254, 0.5);
}
.node-pulse-1 { animation: node-glow 3s ease-in-out infinite; }
.node-pulse-2 { animation: node-glow 3s ease-in-out infinite 0.8s; }
.node-pulse-3 { animation: node-glow 3s ease-in-out infinite 1.5s; }
.node-pulse-4 { animation: node-glow 3s ease-in-out infinite 2.2s; }

@keyframes node-glow {
  0%, 100% { fill: rgba(199, 210, 254, 0.3); r: inherit; }
  50%      { fill: rgba(199, 210, 254, 0.7); }
}

/* ═══ Outer rings ═══ */
.ring {
  fill: none;
  stroke: rgba(165, 180, 252, 0.2);
  stroke-width: 1;
}
.ring-1 { animation: ring-expand 4s ease-out infinite; }
.ring-2 { animation: ring-expand 4s ease-out infinite 1s; }
.ring-3 { animation: ring-expand 4s ease-out infinite 2s; }
.ring-4 { animation: ring-expand 4s ease-out infinite 3s; }

@keyframes ring-expand {
  0%   { r: 4; opacity: 0.6; stroke-width: 1.5; }
  100% { r: 20; opacity: 0; stroke-width: 0.5; }
}

/* ═══ Floating particles ═══ */
.particle {
  position: absolute;
  border-radius: 50%;
  background: rgba(199, 210, 254, 0.4);
  pointer-events: none;
}

.particle-1 { width: 3px; height: 3px; animation: float-up 12s linear infinite; left: 12%; bottom: -5%; }
.particle-2 { width: 2px; height: 2px; animation: float-up 15s linear infinite 2s; left: 28%; bottom: -5%; }
.particle-3 { width: 4px; height: 4px; animation: float-up 10s linear infinite 4s; left: 45%; bottom: -5%; background: rgba(165, 180, 252, 0.3); }
.particle-4 { width: 2px; height: 2px; animation: float-up 14s linear infinite 1s; left: 62%; bottom: -5%; }
.particle-5 { width: 3px; height: 3px; animation: float-up 11s linear infinite 3s; left: 78%; bottom: -5%; background: rgba(147, 197, 253, 0.35); }
.particle-6 { width: 2px; height: 2px; animation: float-up 16s linear infinite 5s; left: 88%; bottom: -5%; }
.particle-7 { width: 3px; height: 3px; animation: float-up 13s linear infinite 7s; left: 35%; bottom: -5%; background: rgba(196, 181, 253, 0.3); }
.particle-8 { width: 2px; height: 2px; animation: float-up 9s linear infinite 6s; left: 55%; bottom: -5%; }

@keyframes float-up {
  0%   { transform: translateY(0) translateX(0); opacity: 0; }
  10%  { opacity: 0.6; }
  90%  { opacity: 0.3; }
  100% { transform: translateY(-105vh) translateX(30px); opacity: 0; }
}
</style>
