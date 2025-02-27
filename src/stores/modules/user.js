import { userGetInfoService } from '@/api/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useUserStore = defineStore(
  'big-user',
  () => {
    const token = ref()
    const setToken = (newToken) => {
      token.value = newToken
    }
    const removeToken = () => {
      token.value = ''
    }

    const user = ref()
    //从后台拿到user信息
    const getUser = async () => {
      console.log('仓库开始获取用户信息')
      const res = await userGetInfoService()
      user.value = res.data.data
      console.log('基本信息', user.value)
    }
    //用于清除user信息
    const setUser = (obj) => {
      user.value = obj
    }
    const isGetData = ref(false)
    return {
      isGetData,
      user,
      token,
      setToken,
      removeToken,
      getUser,
      setUser
    }
  },
  {
    persist: true
  }
)
