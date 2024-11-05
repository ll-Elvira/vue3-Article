<script setup>
import {
  Management,
  Promotion,
  UserFilled,
  User,
  Crop,
  EditPen,
  SwitchButton,
  CaretBottom
} from '@element-plus/icons-vue'
import avatar from '@/assets/default.png'
import { useUserStore } from '@/stores'
import { onMounted } from 'vue'
import router from '@/router'

const throttle = (fn, delay) => {
  let timeOut = null
  console.log('1111', timeOut)
  return () => {
    if (!timeOut) {
      timeOut = setTimeout(() => {
        fn()
        timeOut = null
      }, delay)
    }
  }
}
const handleClik = () => {
  console.log('防抖')
}

const throttledClick = throttle(handleClik, 1000)
window.addEventListener('click', throttledClick)

console.log('进入架子')
const userStore = useUserStore()
onMounted(() => {
  userStore.getUser()
  console.log('昵称', userStore.user.nickname)
})

const handleCommand = (key) => {
  if (key === 'logout') {
    //退出登录
    //清空本地数据（user和token）
    userStore.removeToken()
    userStore.setUser({})
    router.push(`/login`)
  } else {
    router.push(`/user/${key}`)
  }
}
</script>

<template>
  <!-- :default-active="$route.path"   配置默认高亮选项
      router  选项开启   index就是跳转路径
      $route.path与下面index相等就会高亮
     -->
  <el-container class="layout-container">
    <el-aside width="200px">
      <div class="el-aside__logo"></div>
      <el-menu
        class="menu"
        active-text-color="#6F4B15"
        :default-active="$route.path"
        text-color="#6F4B15"
        router
      >
        <el-menu-item index="/article/channel">
          <el-icon><Management /></el-icon>
          <span>文章分类</span>
        </el-menu-item>
        <el-menu-item index="/article/manage">
          <el-icon><Promotion /></el-icon>
          <span>文章管理</span>
        </el-menu-item>
        <el-sub-menu index="/user">
          <!-- 具名插槽   具体写作v-slot:name   -->
          <template #title>
            <el-icon><UserFilled /></el-icon>
            <span>个人中心</span>
          </template>
          <el-menu-item class="menu1" index="/user/profile">
            <el-icon><User /></el-icon>
            <span>基本资料</span>
          </el-menu-item>
          <el-menu-item class="menu1" index="/user/avatar">
            <el-icon><Crop /></el-icon>
            <span>更换头像</span>
          </el-menu-item>
          <el-menu-item class="menu1" index="/user/password">
            <el-icon><EditPen /></el-icon>
            <span>重置密码</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div>
          当前用户：<strong>{{
            userStore.user.nickname || userStore.user.username
          }}</strong>
        </div>
        <!-- command事件会传参 -->
        <el-dropdown placement="bottom-end" @command="handleCommand">
          <span class="el-dropdown__box">
            <!-- 头像 -->
            <el-avatar :src="userStore.user.user_pic || avatar" />
            <el-icon><CaretBottom /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile" :icon="User"
                >基本资料</el-dropdown-item
              >
              <el-dropdown-item command="avatar" :icon="Crop"
                >更换头像</el-dropdown-item
              >
              <el-dropdown-item command="password" :icon="EditPen"
                >重置密码</el-dropdown-item
              >
              <el-dropdown-item command="logout" :icon="SwitchButton"
                >退出登录</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main>
        <!-- 路由出口 -->
        <router-view></router-view>
      </el-main>
      <el-footer>create-by-lyj-2024</el-footer>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
  .el-aside {
    background-image: url('@/assets/book.jpg');
    background-size: cover; /* 适应背景框 */
    background-position: 60% 50%;
    &__logo {
      height: 120px;
      background: url('@/assets/logo.png') no-repeat center / 120px auto;
    }
    .el-menu {
      border-right: none;
    }
    .menu {
      background-color: rgba(153, 153, 98, 0.3) !important;
    }
    .menu1 {
      background-color: rgba(170, 153, 74, 0.7) !important;
    }
  }

  .el-header {
    background-color: #f5e9ab;
    // background: url('@/assets/logo.png');
    display: flex;
    align-items: center;
    justify-content: space-between;
    .el-dropdown__box {
      display: flex;
      align-items: center;
      .el-icon {
        color: #999;
        margin-left: 10px;
      }

      &:active,
      &:focus {
        outline: none;
      }
    }
  }
  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
  }
}
</style>
