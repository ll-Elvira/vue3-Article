import { useUserStore } from '@/stores'
import { createRouter, createWebHistory } from 'vue-router'

//创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // 异步加载
  routes: [
    {
      path: '/login',
      component: () => import('@/views/login/LoginPage.vue')
    }, //登录页
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/article/channel', //重定向到二级路由首页
      children: [
        {
          path: '/article/manage',
          component: () => import('@/views/article/ArticleManage.vue')
        },
        {
          path: '/article/channel',
          component: () => import('@/views/article/ArticleChannel.vue')
        },
        {
          path: '/user/profile',
          component: () => import('@/views/user/UserProfile.vue')
        },
        {
          path: '/user/avatar',
          component: () => import('@/views/user/UserAvatar.vue')
        },
        {
          path: '/user/password',
          component: () => import('@/views/user/UserPassword.vue')
        }
      ]
    }
  ]
})

//登录访问拦截
// 根据返回值决定是放行或拦截
//undefined true 是直接放行，所以不配置默认放行
//false拦回from的地址页面，to是目的地，from是出发点
//给出具体的路径或对象，就会哦拦到对应位置
router.beforeEach((to) => {
  const userStore = useUserStore()
  if (!userStore.token && to.path !== '/login') {
    return '/login'
  }
})

export default router
