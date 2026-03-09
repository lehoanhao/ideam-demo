export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path.startsWith('/auth')) return

  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    const user = await authStore.fetchMe()
    if (!user) {
      return navigateTo('/auth/login')
    }
  }
})
