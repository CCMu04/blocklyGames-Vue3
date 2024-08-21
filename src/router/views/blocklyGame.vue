<script setup>
import {onMounted, ref, watch} from "vue";
import {toolboxs} from '@/blocks/js/toolboxs';
import * as Blockly from "blockly";
import {myLocalStorage} from "@/store/myLocalStorage";
import {useStorage} from "@/store/useStorage";
import {initElement} from "@/blocks/js/initElement";
import {ElMessage} from "element-plus";
import {MiGong} from "@/blocks/action/MiGong";
import {workspace} from "@/blocks/js/workspace";
import {javascriptGenerator} from "blockly/javascript";
import router from "@/router/router";

const game = ref({});
const gameInfo = ref([{}]);
const toolbox = ref('');
const selectedNumber = ref(0);
const toolboxDiff = ref([]);

initData();
onMounted(() => {
  workspace.workspace = Blockly.inject('blocklyDiv', {toolbox: toolbox.value});
  selectDiff(0);
});

function selectDiff(diff) {
  initElement(game.value.id, diff);
  selectedNumber.value = diff;
  toolbox.value = toolboxDiff.value[selectedNumber.value];
  workspace.workspace.updateToolbox(toolbox.value);
}

function initData() {
  if (myLocalStorage.getItem("game"))
    game.value = JSON.parse(myLocalStorage.getItem("game"));

  let axios = require('axios');
  let data = new FormData();
  data.append("gameId", game.value.id);
  let getGameInfo = axios.get(`https://api.chcmu.xyz/getGameInfo?gameId=${game.value.id}`);
  Promise.resolve(getGameInfo)
      .then(response => {
        if (response.data.code === 1) {
          gameInfo.value = response.data.data;
        } else ElMessage({type: "warning", message: response.data.msg, showClose: true});
      }).catch(error => {
    console.log(error);
  });

  // 获取关卡工具栏信息
  for (let i = 0; i < toolboxs.length; i++)
    if (toolboxs[i].id === game.value.id) toolboxDiff.value = toolboxs[i].toolbox;
  selectedNumber.value = 0; // 初始设定为第一关
  toolbox.value = toolboxDiff.value[selectedNumber.value];
  document.title = game.value.name;
}

function runCode() {
  javascriptGenerator.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
  javascriptGenerator.addReservedWords('highlightBlock');
  javascriptGenerator.addReservedWords('code');
  let code = javascriptGenerator.workspaceToCode(workspace.workspace);
  if (game.value.id === 1) MiGong.run(code);
}

watch((useStorage("game")), () => {
  initData();
  selectDiff(0);
});
</script>

<template>
  <div style="width: 100%; margin: 80px 0">
    <el-card style="width: 1000px; margin: 10px auto;" body-style="display: flex">
      <div v-for="(game, n) in gameInfo" :key="n">
        <el-button class="selectDiff" @click="selectDiff(n)">{{ game.diff }}</el-button>
      </div>
      <div style="flex-grow: 1"/>
      <el-text size="large">{{ `${game.name} 第${gameInfo[selectedNumber].diff}关` }}</el-text>
    </el-card>
    <el-card style="width: 1000px; height: 500px; margin: 10px auto;" body-style="display: flex;">
      <div style="width: 40%">
        <div style="width: 350px; height: 350px; margin: 0 auto; background-size: cover" id="backgroundDiv">

          <div style="width: 350px; height: 350px; position: absolute" id="MiGong">
            <div id="MiGongPlane"/>
            <div id="MiGongEnd"/>
            <div id="MiGongCookie1"/>
            <div id="MiGongCookie2"/>
            <div id="MiGongBlock1"/>
            <div id="MiGongBlock2"/>
          </div>

        </div>
        <div style="margin: 20px">
          <el-text>{{ gameInfo[selectedNumber].info }}</el-text>
        </div>
      </div>
      <div style="width: 60%; height: 460px;">
        <div style="width: 100%; height: 90%;" id="blocklyDiv"/>
        <div style="width: 100%; height: 10%; display: flex; margin-top: 10px">
          <div style="flex-grow: 1"/>
          <el-button style="width: 80px;" @click="runCode">运行</el-button>
        </div>
      </div>
    </el-card>
  </div>

  <el-button @click="router.push('/blocklyGameV2')">测试页面</el-button>
</template>

<style scoped>
.selectDiff {
  border-radius: 10px;
  width: 30px;
  height: 30px;
  margin-left: 15px;
}

#backgroundDiv {
  border-radius: 10px;
  border: 5px solid #bbb;
}

#MiGongPlane {
  position: absolute;
  border-style: dotted;
  width: 70px;
  height: 70px;
  background-size: contain;
  background-image: url("/public/img/games/MiGong/gogo.png");
  transition: transform 1s ease-in-out;
  transform-origin: center;
}

#MiGongEnd {
  position: absolute;
  width: 70px;
  height: 70px;
  background-size: contain;
  background-image: url("/public/img/games/MiGong/end.png");
  transition: transform 1s ease-in-out;
}

#MiGongCookie1 {
  position: absolute;
  width: 70px;
  height: 70px;
  background-size: contain;
  background-image: url("/public/img/games/MiGong/cookie.png");
  transition: transform 1s ease-in-out;
}

#MiGongCookie2 {
  position: absolute;
  width: 70px;
  height: 70px;
  background-size: contain;
  background-image: url("/public/img/games/MiGong/cookie.png");
  transition: transform 1s ease-in-out;
}

#MiGongBlock1 {
  position: absolute;
  width: 70px;
  height: 70px;
  background-size: contain;
  background-image: url("/public/img/games/MiGong/block.png");
  transition: transform 1s ease-in-out;
}

#MiGongBlock2 {
  position: absolute;
  width: 70px;
  height: 70px;
  background-size: contain;
  background-image: url("/public/img/games/MiGong/block.png");
  transition: transform 1s ease-in-out;
}
</style>