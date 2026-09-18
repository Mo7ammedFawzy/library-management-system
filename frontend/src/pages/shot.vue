<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MOCK_TOKEN, setToken } from '../services/api'

// TEMPORARY local-only screenshot helper. Sets the mock auth token and
// redirects to the route in `?to=`. Deleted after the UI screenshot pass.
const route = useRoute()
const router = useRouter()

onMounted(() => {
  setToken(MOCK_TOKEN)
  const to = route.query.to
  const target = typeof to === 'string' && to.startsWith('/') && !to.startsWith('/shot') ? to : '/dashboard'
  router.replace(target)
})
</script>

<template>
  <p class="p-6 text-sm text-[#667896]">
    Preparing preview…
  </p>
</template>
