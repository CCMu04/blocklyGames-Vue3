<script setup>
import {ref} from "vue";
import {ElMessage} from "element-plus";
import router from "@/router/router";

// 测试
router.push('games');

const images = [
  "/img/index/image1.png",
  "/img/index/image2.png"
];

const gameRank = ref([]);
refreshRank();

function refreshRank() {
  let axios = require('axios');
  let getRank = axios.get('https://api.chcmu.xyz/getRank');
  Promise.resolve(getRank)
      .then((response) => {
        if (response.data.code === 1) gameRank.value = response.data.data;
        else {
          ElMessage({
            showClose: true,
            type: "warning",
            message: "加载榜单信息发生错误！"
          });
        }
      })
}
</script>

<template>
  <el-carousel height="550px" motion-blur>
    <el-carousel-item v-for="image in images" :key="image">
      <el-image :src="image" fit="cover" style="width: 100%"/>
    </el-carousel-item>
  </el-carousel>

  <div style="margin: 25px">
    <el-card style="width: 800px; margin: 20px auto;" body-style="padding: 0; display: flex">
      <el-image src="/img/index/image3.png" style="width: 60%; height: 350px;" fit="cover"/>
      <div style="text-align: center; width: 25%; margin: auto auto">
        <div style="font-size: xx-large; font-weight: bold; color: #888">开发基于</div>
        <div style="margin: 20px">
          <el-image src="/img/blockly.png"/>
        </div>
        <el-text size="large">可视化语言的编程标准源于谷歌开发的blockly</el-text>
      </div>
    </el-card>

    <el-card style="width: 600px; margin: 20px auto; text-align: center">
      <div style="margin: 20px;">
        <el-text style="font-size: xx-large; font-weight: bold;">用户榜单</el-text>
      </div>
      <el-table :data="gameRank" stripe empty-text="暂时没有用户上榜..." max-height="400px">
        <el-table-column label="用户编号" prop="uid" width="200"/>
        <el-table-column label="昵称" prop="name" width="250"/>
        <el-table-column label="分数" prop="score"/>
      </el-table>
      <div style="margin-top: 20px; display: flex; justify-content: flex-end; width: 550px">
        <el-button @click="refreshRank">刷新榜单</el-button>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
</style>