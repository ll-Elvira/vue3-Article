<script setup>
import { provide, ref, watch, onMounted } from 'vue'
import { artGetChannelsService, artDelChannelService } from '@/api/article'
import pageContainer from '@/components/pageContainer.vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelEdit from './components/ChannelEdit.vue'
//可视范围数据
const visibleItems = ref([])
//更新获取数据
const getItems = ref([])
const tableRef = ref()
//表格当前数据
const allItems = ref([])
const scrollRef = ref()
console.log('文章分类')
const loading = ref(false)
//获取文章分类
// 数据
const channelList = ref([])

//获取全部分类列表，模拟服务器端总体数据
const getChannelList = async () => {
  loading.value = true
  const res = await artGetChannelsService()
  channelList.value = res.data.data
  //数据初始化
  let data = processData(1)
  allItems.value = allItems.value.concat(data)

  console.log('全部表格')
  loading.value = false
}
//获取分类列表
getChannelList()

//虚拟表格练习______________________________________________________

const processData = (n) => {
  console.log(n)
  const data = channelList.value.slice((n - 1) * 50, n * 50)
  getItems.value = data
  //合并数据
  console.log('切片数据')
  return getItems.value
}
onMounted(() => {
  //获取表格高度

  console.log('挂载后111')
})

const scrollHandle = (e) => {
  //获取滚动条高度
  const scrollTop = e.target.scrollTop
  //获取可视区域高度
  const clientHeight = e.target.clientHeight
  //获取内容高度
  const scrollHeight = e.target.scrollHeight
  //判断是否到底部
  if (scrollTop + clientHeight + 100 >= scrollHeight) {
    console.log('到底了')
    //获取新数据
    let n = allItems.value.length / 50 + 1
    console.log(n)
    let data = processData(n)
    allItems.value = allItems.value.concat(data)
  }
}
//_____________________________________________________________
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
    <div
      ref="scrollRef"
      @scroll="scrollHandle"
      style="height: 400px; overflow: auto"
    >
      <!-- 占位区 动态绑定高度 -->
      <div :style="{ height: totalHeight + 'px' }">
        <el-table
          ref="tableRef"
          v-loading="loading"
          :data="nowItems"
          style="width: 100%"
          :row-style="{ height: '50px' }"
        >
          <!-- 原本是:data="allItems" -->
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
      </div>
    </div>
    <!-- 通过ref绑定，可以利用dialog获取组件实例，因此可以调用组件方法open -->
    <ChannelEdit ref="dialog" @success="onSuccess"></ChannelEdit>
  </pageContainer>
</template>

<style lang="scss" scoped></style>
