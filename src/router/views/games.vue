<script setup>
import router from "@/router/router";
import {myLocalStorage} from "@/store/myLocalStorage";
import {onMounted, ref} from "vue";

// 数据表game
const games = ref([]);

let axios = require('axios');
let getGames = axios.get("https://api.chcmu.xyz/getGame");
Promise.resolve(getGames)
    .then(response => {
      if (response.data.code === 1) {
        games.value = response.data.data;

        // 测试
        setGame(games.value[0]);
      }
      else games.value = [];
    }).catch(error => {
  console.log(error);
});

function setGame(game) {
  let json = JSON.stringify(game);
  myLocalStorage.setItem("game", json);
  router.push('/blocklyGame');
}
</script>

<template>
  <el-card style="margin: 10px">
    <div v-for="(game, n) in games" :key="n">
      <el-popover
          placement="top-start"
          :title="game.name"
          :width="200"
          trigger="hover"
          :content="game.info"
      >
        <template #reference>
          <el-button @click="setGame(game)">{{ game.name }}</el-button>
        </template>
      </el-popover>
    </div>
  </el-card>
</template>

<style scoped>

</style>