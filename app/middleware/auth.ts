export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/login') return

  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    const user = await authStore.fetchMe()
    if (!user) {
      return navigateTo('/login')
    }
  }
})
