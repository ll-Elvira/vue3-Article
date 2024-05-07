<script setup>
import { userRegisterService, userLoginService } from '@/api/user'
import { User, Lock } from '@element-plus/icons-vue'
// import { ElMessage } from 'element-plus';
import { ref, watch } from 'vue'
import { useUserStore } from '@/stores/index'
import router from '@/router'
const isRegister = ref(false)

//注册提交的数据对象
const formModel = ref({
  username: '',
  password: '',
  repassword: ''
})
//注册校验规则
const rules = {
  //非空校验
  //长度校验
  //正则校验，\S为非空，不能是空格
  //自定义校验
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 1, max: 10, message: '字符长度为1到10', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { pattern: /^\S{6,15}$/, message: '密码为6-15的非空字符', trigger: 'blur' }
  ],
  repassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { pattern: /^\S{6,15}$/, message: '密码为6-15的非空字符', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== formModel.value.password) {
          callback(new Error('密码输入不一致'))
        } else {
          callback() //校验成功也要callback
        }
      }
    }
  ]
}
//声明一个函数是异步
const form = ref()
const register = async () => {
  await form.value.validate()
  try {
    await userRegisterService(formModel.value)
    ElMessage.success('注册成功')
    // 注册成功后的其他逻辑处理
    isRegister.value = false
    return
  } catch (error) {
    // 错误处理逻辑
    // alert(error.message)
    console.log(error)
    ElMessage.error(error.message)
  }
}
// 登录
const userStore = useUserStore()
const login = async () => {
  await form.value.validate()
  try {
    const res = await userLoginService(formModel.value)
    userStore.setToken(res.data.token)
    console.log('开始登陆', res)
    ElMessage.success('登录成功')
    router.push('/')
    return
  } catch (error) {
    // 错误处理逻辑
    // alert(error.message)
    console.log(error)
    ElMessage.error(error.message)
  }
}

//切换表单重置
watch(isRegister, () => {
  formModel.value = {
    username: '',
    password: '',
    repassword: ''
  }
})
</script>

<template>
  <!-- 校验 
  :model="ruleForm" 绑定整个form的数据对象
  :rules="rules"绑定整个rule规则对象
  v-model="ruleForm.name" 给表单元素绑定form的子属性
  <el-form-item prop="date1">   prop="name" 配置生效的的校验规则，与:rules="rules"相关
-->
  <!-- //row表示一行 ,一行分成24份
  //col表示列 -->
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <!-- //span表示份数   :offset="3"左侧margin为3份 -->
    <el-col :span="6" :offset="3" class="form">
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-if="isRegister"
      >
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            v-model="formModel.repassword"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入再次密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="register"
            class="button"
            type="primary"
            auto-insert-space
          >
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false">
            ← 登录
          </el-link>
        </el-form-item>
      </el-form>
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-else
      >
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="login"
            class="button"
            type="primary"
            auto-insert-space
            >登录</el-button
          >
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true">
            注册 →
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;
  .bg {
    background:
      url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
      url('@/assets/login_bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    .title {
      margin: 0 auto;
    }
    .button {
      width: 100%;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
