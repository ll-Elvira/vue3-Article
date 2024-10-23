import axios from 'axios'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import router from '@/router'
const baseURL = 'http://big-event-vue-api-t.itheima.net'

// 创建 CancelToken 的源
const CancelToken = axios.CancelToken
const source = CancelToken.source()

const instance = axios.create({
  // TODO 1. 基础地址，超时时间
  baseURL,
  timeout: 10000
})
//请求拦截器
instance.interceptors.request.use(
  (config) => {
    // TODO 2. 携带token
    const useStore = useUserStore()
    if (useStore.token) {
      config.headers.Authorization = useStore.token
    }
    config.cancelToken = source.token
    console.log('请求拦截器', config)
    return config
  },
  (err) => Promise.reject(err)
)
// 触发取消请求
// function triggerCancel() {
//   if (cancelRequest) {
//     cancelRequest('Request canceled by user.');
//   }
// }

// // 将取消函数赋值给 cancelRequest
// cancelRequest = source.cancel;

//响应拦截器
instance.interceptors.response.use(
  (res) => {
    // TODO 3. 处理业务失败
    // TODO 4. 摘取核心响应数据
    if (res.data.code === 0) {
      return res
    }
    // 业务失败，给错误提示
    ElMessage.error(res.data.message || '服务异常')
    return Promise.reject(res.data)
  },
  (err) => {
    // TODO 5. 处理401错误，权限不足或是Token过期=》拦截到登录界面
    if (err.response?.status === 401) {
      router.push('/login')
    } else if (axios.isCancel(err)) {
      console.log('Request canceled:', err.message)
    } else {
      //错误默认情况
      ElMessage.error(err.response.data.message || '服务异常')
    }
    return Promise.reject(err)
  }
)

export default instance
export { baseURL, source, CancelToken } //按需导出
