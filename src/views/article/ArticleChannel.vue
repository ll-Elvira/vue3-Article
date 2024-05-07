<script setup>
import { provide, ref } from 'vue'
import { artGetChannelsService, artDelChannelService } from '@/api/article'
import pageContainer from '@/components/pageContainer.vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelEdit from './components/ChannelEdit.vue'

const loading = ref(false)
//获取文章分类
const channelList = ref([])
const getChannelList = async () => {
  loading.value = true
  const res = await artGetChannelsService()
  channelList.value = res.data.data
  loading.value = false
  console.log(channelList.value)
}
//获取分类列表
getChannelList()

//提供跨层级数据
provide('title', '文章分类')

//删除表格
const onDelChannel = async (row) => {
  console.log(row)
  //确认框
  await ElMessageBox.confirm('你确认删除该分类信息吗？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })

  await artDelChannelService(row.id)
  ElMessage({ type: 'success', message: '删除成功' })
  getChannelList()
}
//添加分类
const dialog = ref()
const onAddChannel = () => {
  dialog.value.open({})
}
//编辑分类
const onEditChannel = (row) => {
  dialog.value.open(row)
  console.log(row)
}
//弹窗确认，重新获取分类列表
const onSuccess = () => {
  getChannelList()
}
</script>
<template>
  <pageContainer>
    <template #extra>
      <el-button type="primary" @click="onAddChannel">添加分类</el-button>
    </template>

    <el-table v-loading="loading" :data="channelList" style="width: 100%">
      <el-table-column label="序号" width="100" type="index" />
      <!-- 使用prop属性绑定 -->
      <el-table-column label="分类名称" prop="cate_name" />
      <el-table-column label="分类别名" prop="cate_alias" />
      <el-table-column label="操作" width="100">
        <!-- row 就是 channelList 的一项-->
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="onEditChannel(row)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="onDelChannel(row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 通过ref绑定，可以利用dialog获取组件实例，因此可以调用组件方法open -->
    <ChannelEdit ref="dialog" @success="onSuccess"></ChannelEdit>
  </pageContainer>
</template>

<style lang="scss" scoped></style>
