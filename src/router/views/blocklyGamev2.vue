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
  // 动态设置大小
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const allBox = document.getElementById("allBox");
  allBox.style.minWidth = `${screenWidth - 100}px`;
  allBox.style.height = `${screenHeight - 50}px`;

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

  <div style="display: flex;" id="allBox">
    <!-- 视频组件 -->
    <div id="videoBox" v-show="videoShow">视频</div>

    <div id="workspace">
      <div style="display: flex; flex: 1;">
        <div id="showBox">
          <canvas id="canvas"/>
        </div>
        <div id="toolBox">
          <div id="controlPanel" style="margin: 20px; display: flex; gap: 20px; justify-content: center;">
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
}

#toolBox {
  display: flex;
  flex-direction: column;
  flex: 1;
}

#controlPanel {
  display: flex;
  justify-content: flex-end;
  gap: 20px;
}

.control-button {
  padding: 10px 20px;
  background: linear-gradient(135deg, #98FB98, #8FBC8F);
  color: #2F4F4F;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  transition: background 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 100, 0, 0.2);
}

.control-button:hover {
  background: linear-gradient(135deg, #90EE90, #76C276);
  transform: translateY(-2px);
  transition: background 0.5s ease;
}

.control-button.active {
  background: linear-gradient(135deg, #32CD32, #228B22);
  transition: background 0.5s ease;
}

.control-button.active:hover {
  background: linear-gradient(135deg, #228B22, #006400);
  transform: translateY(-2px);
  transition: background 0.5s ease;
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
  box-shadow: 0 4px 8px rgba(0, 128, 0, 0.3); /* 与#runBox相同的阴影 */
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
