import { useThrottle } from '@vueuse/core'
//节流
export default function useThrottleFn(fn, ms = 300) {
  return useThrottle(fn, ms, { trailing: true, leading: true })
}
