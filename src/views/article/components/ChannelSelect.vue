<script setup>
import { artGetChannelsService } from '@/api/article'
import { ref } from 'vue'
const channelList = ref([])
const getChannelList = async () => {
  const res = await artGetChannelsService()
  channelList.value = res.data.data
  console.log('列表信息', channelList.value)
}
getChannelList()

//通过emit子组件传递参数给父组件
const emit = defineEmits(['update:modelValue'])
//接受父组件传值
defineProps({
  modelValue: {
    type: [Number, String]
  }
  // width: {
  //   type: String
  // }
})
</script>

<template>
  <!-- 父子通信不能直接用v-moudel 进行双向数据绑定 要拆解使用-->
  <!-- 先是父传子，子组件通过props接收modelValue
        下面:modelValue="modelValue"进行数据绑定
        然后@update:modelValue监听，出现变化就触动emit('update:modelValue', $event)
        开始子传父 -->
  <!-- el-select 中 :modelValue是指下拉表单的选中值-->
  <el-select
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    placeholder="请选择"
    :style="{ width: '100px' }"
  >
    <el-option
      v-for="channel in channelList"
      :key="channel.id"
      :label="channel.cate_name"
      :value="channel.id"
    ></el-option>
  </el-select>
</template>
