<script setup>
import {onMounted, ref} from "vue";
import {toolboxs} from "@/blocks/js/toolboxs";
import * as Blockly from "blockly";
import {defineMiGongBlocks} from "@/blocks/MiGong";

const videoShow = ref(false); // 视频界面开关
const diffSelected = ref(false); // 关卡难度选择开关
const isRun = ref(false); // 判断是否运行的状态

let workspace = null;
let toolbox = toolboxs[0].toolbox[0];

onMounted(() => {
  let screenWidth = window.innerWidth;
  let screenHeight = window.innerHeight;

  let allBox = document.getElementById("allBox");
  allBox.style.minWidth = `${screenWidth - 100}px`;
  allBox.style.height = `${screenHeight - 50}px`;

  defineMiGongBlocks();
  workspace = Blockly.inject('blocklyDiv', {toolbox: toolbox});

  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext("2d");

  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#87CEEB');
  gradient.addColorStop(1, '#3CB371');

  ctx.fillStyle = gradient;
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

  <div style="display: flex;" id="allBox">
    <!-- 视频组件 -->
    <div id="videoBox" v-show="videoShow">视频</div>

    <div id="workspace">
      <div style="display: flex; flex: 1;">
        <div id="showBox">
          <canvas id="canvas"/>
        </div>
        <div id="toolBox">
          <div id="controlPanel" style="margin: 20px; display: flex; gap: 20px; justify-content: flex-end;">
            <el-button id="levelSelectButton" class="control-button" @click="diffSelected = !diffSelected"
                       :class="{ active: diffSelected }">关卡选择
            </el-button>
            <el-button id="videoTutorialButton" class="control-button" @click="videoShow = !videoShow"
                       :class="{ active: videoShow }">视频教程
            </el-button>
          </div>
          <div id="blocklyDiv" style="flex-grow: 1;"/>
        </div>
      </div>

      <div style="display: flex; flex: 0 1 10vh; align-items: center; padding: 0 20px;" id="runBox">
        <div style="flex-grow: 1;">
          <el-text style="color: #98FB98; font-weight: bold;">游戏简介</el-text>
        </div>
        <div id="buttonBox">
          <el-button v-if="!isRun" @click="runCode" class="runButton">运行</el-button>
          <el-button v-else type="danger" @click="refreshGame" class="runButton resetButton">重置</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#allBox {
  margin: 10px;
}

#videoBox {
  flex: 1;
  margin-right: 5px;
  border: 1px solid #bbb;
}

#workspace {
  flex: 2;
  display: flex;
  height: 100%;
  flex-direction: column;
}

#showBox {
  flex: 1;
}

#canvas {
  width: 100%;
  height: 100%;
  display: block;
  box-sizing: border-box;
  border-top-left-radius: 8px;
}

#toolBox {
  display: flex;
  flex-direction: column;
  flex: 1;
  background: linear-gradient(to bottom, #87CEEB, #3CB371);
  border-top-right-radius: 8px;
}

.control-button {
  padding: 24px 24px;
  background: linear-gradient(135deg, #E0F7FA, #B2EBF2);
  color: #006064;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: bold;
  transition: background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 150, 136, 0.4);
}

.control-button:hover {
  background: linear-gradient(135deg, #B3E5FC, #81D4FA);
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 150, 136, 0.6);
}

.control-button.active {
  background: linear-gradient(135deg, #4FC3F7, #039BE5);
  transition: background 0.5s ease, border-color 0.3s ease;
}

.control-button.active:hover {
  background: linear-gradient(135deg, #0288D1, #0277BD);
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(0, 100, 100, 0.8);
}

#runBox {
  display: flex;
  flex: 0 1 10vh;
  align-items: center;
  padding: 0 20px;
  background-color: #8B4513;
  background-image: linear-gradient(45deg, #8B4513 25%, #A0522D 25%, #A0522D 50%, #8B4513 50%, #8B4513 75%, #A0522D 75%, #A0522D);
  background-size: 50px 50px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

#buttonBox {
  background-color: rgba(178, 232, 178, 0.44);
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 128, 0, 0.3);
}

.runButton {
  background: linear-gradient(135deg, #98FB98, #8FBC8F);
  color: white;
  border: none;
  border-radius: 8px;
  margin: 5px 10px;
  box-shadow: 0 4px 6px rgba(0, 128, 0, 0.2);
  font-size: 1.2rem;
  font-weight: bold;
  transition: background 0.3s ease, transform 0.2s ease;
}

.runButton:hover {
  background: linear-gradient(135deg, #36a270, #2f8a5c);
  transform: translateY(-2px);
}

.runButton:active {
  transform: translateY(2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.runButton:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.resetButton {
  background: linear-gradient(135deg, #FFD700, #FF8C00);
}

.resetButton:hover {
  background: linear-gradient(135deg, #FFA500, #FF4500);
  transform: translateY(-2px);
}
</style>
