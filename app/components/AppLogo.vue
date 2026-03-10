<script setup lang="ts">
defineProps<{
  collapsed?: boolean
  variant?: 'default' | 'light'
}>()
</script>

<template>
  <NuxtLink to="/" class="group flex items-center gap-2 px-0 py-0 font-bold select-none" :class="collapsed ? 'justify-center' : ''">
    <div
      class="relative flex items-center justify-center size-10 rounded-xl overflow-hidden shrink-0 transition-all duration-300 group-hover:scale-110"
      :class="variant === 'light' ? 'app-logo-light' : 'app-logo'"
    >
      <!-- Background gradient -->
      <div
        class="absolute inset-0"
        :class="variant === 'light'
          ? 'bg-gradient-to-br from-white/20 via-white/10 to-white/5 border border-white/25'
          : 'bg-gradient-to-br from-primary-400 via-primary-600 to-primary-800'"
      />

      <!-- Animated network mesh SVG -->
      <svg class="network-svg absolute inset-0 w-full h-full" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <!-- Connection lines -->
        <line
          x1="8"
          y1="8"
          x2="20"
          y2="14"
          class="net-line line-1"
        />
        <line
          x1="20"
          y1="14"
          x2="33"
          y2="8"
          class="net-line line-2"
        />
        <line
          x1="20"
          y1="14"
          x2="20"
          y2="26"
          class="net-line line-3"
        />
        <line
          x1="8"
          y1="32"
          x2="20"
          y2="26"
          class="net-line line-4"
        />
        <line
          x1="20"
          y1="26"
          x2="33"
          y2="32"
          class="net-line line-5"
        />
        <line
          x1="8"
          y1="8"
          x2="8"
          y2="32"
          class="net-line line-6"
        />
        <line
          x1="33"
          y1="8"
          x2="33"
          y2="32"
          class="net-line line-7"
        />
        <line
          x1="8"
          y1="8"
          x2="20"
          y2="26"
          class="net-line line-8"
        />
        <line
          x1="33"
          y1="8"
          x2="20"
          y2="26"
          class="net-line line-9"
        />

        <!-- Data pulse particles -->
        <circle r="1.2" class="pulse-dot pulse-1">
          <animateMotion dur="2s" repeatCount="indefinite" path="M8,8 L20,14" />
        </circle>
        <circle r="1.2" class="pulse-dot pulse-2">
          <animateMotion dur="2.5s" repeatCount="indefinite" path="M20,14 L33,32" />
        </circle>
        <circle r="1" class="pulse-dot pulse-3">
          <animateMotion dur="1.8s" repeatCount="indefinite" path="M33,8 L20,26" />
        </circle>

        <!-- Network nodes -->
        <circle
          cx="8"
          cy="8"
          r="2.5"
          class="net-node node-1"
        />
        <circle
          cx="33"
          cy="8"
          r="2.5"
          class="net-node node-2"
        />
        <circle
          cx="20"
          cy="14"
          r="3"
          class="net-node node-center"
        />
        <circle
          cx="20"
          cy="26"
          r="3"
          class="net-node node-center-2"
        />
        <circle
          cx="8"
          cy="32"
          r="2.5"
          class="net-node node-3"
        />
        <circle
          cx="33"
          cy="32"
          r="2.5"
          class="net-node node-4"
        />
      </svg>

      <!-- Hover overlay -->
      <div class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  </NuxtLink>
</template>

<style scoped>
.app-logo {
  box-shadow: 0 4px 16px rgba(var(--color-primary-500), 0.35);
  animation: logo-glow 3s ease-in-out infinite;
}

.app-logo:hover {
  box-shadow: 0 4px 24px rgba(var(--color-primary-500), 0.6);
}

@keyframes logo-glow {
  0%, 100% { box-shadow: 0 4px 16px rgba(var(--color-primary-500), 0.35); }
  50% { box-shadow: 0 4px 22px rgba(var(--color-primary-500), 0.55); }
}

.app-logo-light {
  box-shadow: 0 4px 16px rgba(255, 255, 255, 0.15);
  animation: logo-glow-light 3s ease-in-out infinite;
  backdrop-filter: blur(8px);
  border-radius: 0.75rem;
}

.app-logo-light:hover {
  box-shadow: 0 4px 24px rgba(255, 255, 255, 0.3);
}

@keyframes logo-glow-light {
  0%, 100% { box-shadow: 0 4px 16px rgba(255, 255, 255, 0.15); }
  50% { box-shadow: 0 4px 22px rgba(255, 255, 255, 0.3); }
}

/* Network lines */
.app-logo-light .net-line {
  stroke: rgba(255, 255, 255, 0.5);
}
.app-logo-light .net-node {
  fill: rgba(255, 255, 255, 0.95);
  filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.8));
}
.app-logo-light .pulse-dot {
  fill: rgba(255, 255, 255, 1);
  filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.9));
}

.net-line {
  stroke: rgba(255, 255, 255, 0.3);
  stroke-width: 0.6;
  stroke-linecap: round;
}

.line-1 { animation: line-glow 3s ease-in-out 0s infinite; }
.line-2 { animation: line-glow 3s ease-in-out 0.4s infinite; }
.line-3 { animation: line-glow 3s ease-in-out 0.8s infinite; }
.line-4 { animation: line-glow 3s ease-in-out 1.2s infinite; }
.line-5 { animation: line-glow 3s ease-in-out 1.6s infinite; }
.line-6 { animation: line-glow 3s ease-in-out 0.6s infinite; }
.line-7 { animation: line-glow 3s ease-in-out 1.0s infinite; }
.line-8 { animation: line-glow 3s ease-in-out 0.2s infinite; }
.line-9 { animation: line-glow 3s ease-in-out 1.4s infinite; }

@keyframes line-glow {
  0%, 100% { stroke: rgba(255, 255, 255, 0.2); stroke-width: 0.5; }
  50% { stroke: rgba(255, 255, 255, 0.7); stroke-width: 0.8; }
}

/* Network nodes */
.net-node {
  fill: rgba(255, 255, 255, 0.85);
  filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.6));
}

.node-1 { animation: node-pulse 2.5s ease-in-out 0s infinite; }
.node-2 { animation: node-pulse 2.5s ease-in-out 0.5s infinite; }
.node-3 { animation: node-pulse 2.5s ease-in-out 1.0s infinite; }
.node-4 { animation: node-pulse 2.5s ease-in-out 1.5s infinite; }
.node-center { animation: node-pulse 2s ease-in-out 0.2s infinite; }
.node-center-2 { animation: node-pulse 2s ease-in-out 0.8s infinite; }

@keyframes node-pulse {
  0%, 100% { fill: rgba(255, 255, 255, 0.7); r: 2.5; }
  50% { fill: rgba(255, 255, 255, 1); r: 3; }
}

/* Data pulse particles */
.pulse-dot {
  fill: rgba(255, 255, 255, 0.9);
  filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.8));
}

.pulse-1 { animation: dot-fade 2s ease-in-out infinite; }
.pulse-2 { animation: dot-fade 2.5s ease-in-out 0.5s infinite; }
.pulse-3 { animation: dot-fade 1.8s ease-in-out 1s infinite; }

@keyframes dot-fade {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

/* Hover: speed up animations */
.group:hover .net-line {
  stroke: rgba(255, 255, 255, 0.6);
  transition: stroke 0.3s;
}
.group:hover .net-node {
  fill: rgba(255, 255, 255, 1);
  transition: fill 0.3s;
}
</style>
