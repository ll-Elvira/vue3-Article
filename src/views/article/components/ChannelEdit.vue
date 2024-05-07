<script setup>
import { ref } from 'vue'
import { artEditChannelService, artAddChannelService } from '@/api/article'
const dialogVisible = ref(false)
const formModel = ref({
  cate_name: '',
  cate_alias: ''
})
//校验规则
const rules = {
  cate_name: [
    //非空
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    {
      pattern: /^\S{1,10}$/,
      message: '分类名必须是1-10位的非空字符',
      trigger: 'blur'
    }
  ],
  cate_alias: [
    { required: true, message: '请输入分类别名', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{1,15}$/,
      message: '分类别名必须是1-15位的字母数字',
      trigger: 'blur'
    }
  ]
}

const open = async (row) => {
  //判断是编辑还是添加
  dialogVisible.value = true
  console.log(row)
  //编辑则回显，添加则重置
  formModel.value = { ...row }
}
//表单校验
const formRef = ref()
const emit = defineEmits(['success'])
const onSubmit = async () => {
  await formRef.value.validate()
  if (formModel.value.id) await artEditChannelService(formModel.value)
  else await artAddChannelService(formModel.value)
  ElMessage({
    type: 'success',
    message: formModel.value.id ? '编辑成功' : '添加成功'
  })
  //对话框关闭
  dialogVisible.value = false
  //子传父
  emit('success')
}

defineExpose({
  open
})
</script>
<template>
  <!-- v-mode对应值期望为一个变量,而不是写死,所以写为true会报错 -->
  <el-dialog
    v-model="dialogVisible"
    :title="formModel.id ? '编辑分类' : '添加分类'"
    width="30%"
  >
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="rules"
      label-width="100px"
      style="padding-right: 30px"
    >
      <el-form-item label="分类名称" prop="cate_name">
        <el-input
          v-model="formModel.cate_name"
          minlength="1"
          maxlength="10"
          placeholder="请输入1-10位的非空字符"
        ></el-input>
      </el-form-item>
      <el-form-item label="分类别名" prop="cate_alias">
        <el-input
          v-model="formModel.cate_alias"
          minlength="1"
          maxlength="15"
          placeholder="请输入1-15位的字母数字"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped></style>
