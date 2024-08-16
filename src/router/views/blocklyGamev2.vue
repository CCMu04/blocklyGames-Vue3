<script setup>
import {onMounted, ref} from "vue";
import {toolboxs} from "@/blocks/js/toolboxs";
import * as Blockly from "blockly";

const videoShow = ref(false); // 视频界面开关
const diffSelected = ref(false); // 关卡难度选择开关
const isRun = ref(false); // 判断是否运行的状态

const workspace = ref();
const toolbox = toolboxs[0].toolbox[0];
onMounted(() => {
  workspace.value = Blockly.inject('blocklyDiv', {toolbox: toolbox});

  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext("2d");

  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  ctx.fillStyle = '#87CEEB';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
});

function runCode() {
  isRun.value = true;
}

function refreshGame() {
  isRun.value = false;
}

const gameInfo = [
  {diff: 1},
  {diff: 2},
  {diff: 3}
]
</script>

<template>
  <!-- 左弹窗显示难度选择窗口 -->
  <el-drawer v-model="diffSelected" size="80" :show-close="false" :with-header="false" direction="ltr"
             style="text-align: center;">
    <div v-for="diff in gameInfo" :key="diff.id">
      <el-button style="margin: 10px auto">{{ diff.diff }}</el-button>
    </div>
  </el-drawer>

  <div style="display: flex; height: 90vh;">
    <!-- 视频组件 -->
    <div id="videoBox" v-show="videoShow">视频</div>

    <div id="workspace">
      <div style="display: flex; flex: 1; height: 85vh;">
        <div id="showBox">
          <canvas id="canvas"/>
        </div>
        <div id="toolBox">
          <div style="margin: 20px">
            <el-button @click="diffSelected = !diffSelected">关卡选择</el-button>
            <el-button @click="videoShow = !videoShow">视频教程</el-button>
          </div>
          <div id="blocklyDiv" style="flex-grow: 1;"/>
        </div>
      </div>

      <div style="display: flex; flex: 0 1 10vh; align-items: center; padding: 0 20px;">
        <div style="flex-grow: 1;">
          <el-text>游戏简介</el-text>
        </div>
        <div id="buttonBox">
          <el-button v-if="!isRun" @click="runCode" class="runButton">运行</el-button>
          <el-button v-else type="danger" @click="refreshGame" class="runButton">重置</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#videoBox {
  flex: 1;
  border: #ccc 1px solid;
}

#workspace {
  flex: 2;
  display: flex;
  flex-direction: column;
  border: #ccc 1px solid;
}

#showBox {
  flex: 1;
  border: #ccc 1px solid;
}

#canvas {
  width: 100%;
  height: 100%;
  display: block;
  box-sizing: border-box;
}

#toolBox {
  display: flex;
  flex-direction: column;
  flex: 1;
  border: #ccc 1px solid;
}

#buttonBox {
  display: flex;
  justify-content: flex-end;
}

.runButton {
  width: 8vw;
  margin: 16px;
}
</style>