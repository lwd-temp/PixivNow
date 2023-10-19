import { defineStore } from 'pinia'
import type { PixivUser } from '@/types'

export const useUserStore = defineStore('user', () => {
  const user = ref<PixivUser | null>(null)
  const isLoggedIn = computed(() => !!user.value)
  const id = computed(() => user.value?.id)
  const name = computed(() => user.value?.name)
  const pixivId = computed(() => user.value?.pixivId)
  const profileImg = computed(() => user.value?.profileImg)
  const profileImgBig = computed(() => user.value?.profileImgBig)
  async function login(sessionId: string) {
    if (!isValidSessionId(sessionId)) {
      console.error('session id格式错误')
      return
    }
    try {
      const data = await $fetch<{ status: string; userData: PixivUser }>(
        '/api/auth',
        {
          method: 'POST',
          headers: {
            'Cache-Control': 'no-store',
          },
          body: {
            method: 'login',
            params: {
              sessionId,
            },
          },
        }
      )
      if (data.status === 'success') {
        console.log('session id success')
        user.value = data.userData
      } else {
        console.error('invalid session id')
        return
      }
    } catch (err) {
      console.log(err)
      return
    }
  }
  async function logout() {
    try {
      const data = await $fetch<{ status: string }>('/api/auth', {
        method: 'POST',
        headers: {
          'Cache-Control': 'no-store',
        },
        body: {
          method: 'logout',
          params: {},
        },
      })
      if (data.status === 'success') {
        user.value = null
      } else {
        console.error('an error occurred')
      }
    } catch (e) {
      console.error(e)
    }
  }
  return {
    isLoggedIn,
    id,
    name,
    pixivId,
    profileImg,
    profileImgBig,
    login,
    logout,
  }
})
