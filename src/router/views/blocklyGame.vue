<script setup>
import * as Blockly from "blockly";
import {themes} from "@/blocks/js/themes";
import {computed, onMounted, ref, watch} from "vue";
import {toolboxs} from "@/blocks/js/toolboxs";
import {gameWorkspace} from "@/blocks/js/gameWorkspace";
import {gameStatus} from "@/blocks/js/gameStatus";
import {myLocalStorage} from "@/store/myLocalStorage";
import router from "@/router/router";
import {ElLoading, ElMessage} from "element-plus";
import {javascriptGenerator} from "blockly/javascript";
import {MiGong} from "@/blocks/action/MiGong";
import {useStorage} from "@/store/useStorage";
import {initElement} from "@/blocks/js/initElement";

const gameInfo = ref([{}]);
const videoShow = ref(false);
const selectedNumber = ref(0);
const diffSelected = ref(false);
const isRun = computed(() => gameStatus.isRun);
const drawerStyle = {
  'background': 'linear-gradient(135deg, #81c784, #4caf50)',
  'padding': '20px',
  'box-shadow': '0 4px 8px rgba(0, 0, 0, 0.1)',
  'border-radius': '10px',
  'display': 'flex',
  'justify-content': 'center',
  'align-items': 'center'
}

let game = {}; // 游戏信息
let toolbox = null;
let toolboxDiff = []; // 关卡难度

initData();
onMounted(() => {
  let screenWidth = window.innerWidth;
  let screenHeight = window.innerHeight;
  let allBox = document.getElementById("allBox");
  allBox.style.minWidth = `1280px`;
  allBox.style.minHeight = `720px`;
  allBox.style.width = `${screenWidth}px`;
  allBox.style.height = `${screenHeight}px`;

  gameWorkspace.workspace = Blockly.inject('blocklyDiv', {
    toolbox: toolbox,
    theme: themes.sftTheme,
    move: {
      scrollbars: {
        horizontal: true,
        vertical: true
      },
      drag: true,
      wheel: true
    }
  });

  selectDiff(0);

  let isResizing = false;
  const resizer = document.getElementById('resizer');
  const videoBox = document.getElementById('videoBox');
  const boxStyle = window.getComputedStyle(videoBox);
  resizer.addEventListener('mousedown', () => {
    isResizing = true;
    document.body.style.cursor = 'col-resize';
    document.addEventListener('mousemove', resizeDivs);
    document.addEventListener('mouseup', stopResizing);
  });

  function resizeDivs(e) {
    if (!isResizing) return;
    const newLeftWidth = e.clientX;
    let oldWidth = videoBox.clientWidth / boxStyle.flexGrow;
    let flexValue = newLeftWidth / oldWidth;
    if (flexValue < 0.3 || flexValue > 1) return;
    videoBox.style.flex = flexValue;
  }

  function stopResizing() {
    isResizing = false;
    document.body.style.cursor = 'default';
    document.removeEventListener('mousemove', resizeDivs);
    document.removeEventListener('mouseup', stopResizing);
  }
});

function initData() {
  if (myLocalStorage.getItem("game")) {
    game = JSON.parse(myLocalStorage.getItem("game"));
    let axios = require('axios');
    let data = new FormData();
    data.append("gameId", game.id);
    let getGameInfo = axios.get(`https://api.chcmu.xyz/getGameInfo?gameId=${game.id}`);
    let loading = ElLoading.service({
      lock: true,
      text: '加载中...',
      customClass: 'gameLoading',
      spinner: `<i></i>`,
      background: 'rgba(0, 0, 0, 0.7)',
    });
    Promise.resolve(getGameInfo)
        .then(response => {
          if (response.data.code === 1) {
            gameInfo.value = response.data.data;
            loading.close();
          } else ElMessage({type: "warning", message: response.data.msg, showClose: true});
        }).catch(error => {
      console.log(error);
    });

    // 获取关卡工具栏信息
    for (let i = 0; i < toolboxs.length; i++)
      if (toolboxs[i].id === game.id) toolboxDiff = toolboxs[i].toolbox;
    selectedNumber.value = 0; // 初始设定为第一关
    toolbox = toolboxDiff[selectedNumber.value];
    document.title = game.name;
  } else {
    router.back();
  }
}

function selectDiff(diff) {
  initElement(game.id, diff);
  selectedNumber.value = diff;
  toolbox = toolboxDiff[selectedNumber.value];
  gameWorkspace.workspace.clear();
  gameWorkspace.workspace.updateToolbox(toolbox);
}

function runCode() {
  javascriptGenerator.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
  javascriptGenerator.addReservedWords('highlightBlock');
  javascriptGenerator.addReservedWords('code');
  let code = javascriptGenerator.workspaceToCode(gameWorkspace.workspace);
  if (game.id === 1) MiGong.run(code);
}

watch((useStorage("game")), () => {
  initData();
  selectDiff(0);
});
</script>

<template>
  <!-- 左弹窗显示难度选择窗口 -->
  <el-drawer v-model="diffSelected" size="80" :show-close="false" :with-header="false" direction="ltr"
             :style="drawerStyle">
    <div v-for="(diff, n) in gameInfo" :key="n" class="button-container">
      <el-button class="diff-button" @click="selectDiff(n)">{{ diff.diff }}</el-button>
    </div>
  </el-drawer>

  <div style="display: flex;" id="allBox">
    <!-- 视频组件 -->
    <div id="videoBox" v-show="videoShow">video 暂未开发</div>

    <div id="resizer" v-show="videoShow">
      <div id="resizer-button">
        <span></span>
      </div>
    </div>

    <div id="workspace">
      <div style="display: flex; flex: 1;">
        <div id="showBox">
          <canvas id="canvas"/>
        </div>
        <div id="toolBox">
          <div id="controlPanel">
            <el-button class="control-button" @click="router.push('/')">返回首页</el-button>
            <el-button class="control-button" @click="diffSelected = !diffSelected"
                       :class="{ active: diffSelected }">关卡选择
            </el-button>
            <el-button class="control-button" @click="videoShow = !videoShow"
                       :class="{ active: videoShow }">视频教程
            </el-button>
          </div>
          <div id="blocklyDiv" style="flex-grow: 1;"/>
        </div>
      </div>

      <div id="runBox">
        <div
            style="flex-grow: 1; background: linear-gradient(to bottom, #87CEEB44, #3CB37144); border-radius: 8px; padding: 10px;">
          <el-text id="gameInfoText">
            {{ gameInfo[selectedNumber].info }}
          </el-text>
        </div>
        <div id="buttonBox">
          <el-button v-show="!isRun" @click="runCode" class="runButton">运行</el-button>
          <el-button v-show="isRun" @click="initElement(game.id, selectedNumber);" class="runButton resetButton">重置
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  font-family: 'ZCOOL KuaiLe', sans-serif;
  font-weight: 400;
}

#blocklyDiv {
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  box-shadow: 0 4px 10px rgba(52, 76, 73, 0.55);
  overflow: hidden;
}

#videoBox {
  flex-grow: 0.8;
}

#resizer {
  width: 5px;
  position: relative;
  background: linear-gradient(135deg, #E0F7FA, #B2EBF2);
  cursor: col-resize;
  border-left: #4FC3F7 solid 1px;
  border-right: #4FC3F7 solid 1px;
}

#resizer-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 20px;
  background-color: #B2EBF2;
  border: 2px solid #4FC3F7;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 2px;
}

#resizer-button::before,
#resizer-button::after {
  content: '';
  position: absolute;
  background-color: #4FC3F7;
}

#resizer-button::before {
  width: 100%;
  height: 2px;
  top: 0;
}

#resizer-button::after {
  width: 100%;
  height: 2px;
  bottom: 0;
}

#resizer-button span {
  position: absolute;
  width: 2px;
  height: 100%;
  background-color: #4FC3F7;
}

#workspace {
  flex: 2;
  display: flex;
  height: 100%;
  flex-direction: column;
}

#showBox {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to bottom, #87CEEB, #3CB371);
}

#canvas {
  width: 460px;
  height: 460px;
}

#toolBox {
  display: flex;
  flex-direction: column;
  flex: 1;
  background: linear-gradient(to bottom, #87CEEB, #3CB371);
}

#controlPanel {
  margin: 20px;
  display: flex;
  gap: 20px;
  justify-content: flex-end;
}

.control-button {
  padding: 24px 24px;
  background: linear-gradient(135deg, #E0F7FA, #B2EBF2);
  color: #006064;
  border: none;
  border-radius: 10px;
  font-size: 1.2rem;
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

#gameInfoText {
  background: linear-gradient(135deg, #E0F7FA, #B2EBF2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 1.2rem;
  line-height: 1.6rem;
}

#runBox {
  display: flex;
  align-items: center;
  padding: 5px 20px;
  background-image: linear-gradient(45deg, #8B4513 25%, #A0522D 25%, #A0522D 50%, #8B4513 50%, #8B4513 75%, #A0522D 75%, #A0522D);
  background-size: 50px 50px;
}

#buttonBox {
  margin: 6px auto 6px 40px;
  background-color: rgba(178, 232, 178, 0.44);
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
  font-size: 2.5rem;
  transition: background 0.3s ease, transform 0.2s ease;
  height: 5.4rem;
  width: 7.2rem;
  font-family: "微软雅黑", sans-serif;
  font-weight: bolder;
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

.button-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.diff-button {
  background: linear-gradient(145deg, #6a994e, #386641);
  color: #fff;
  font-weight: bolder;
  font-size: 18px;
  margin: 10px 0;
  padding: 12px 20px;
  border-radius: 30px;
  transition: all 0.3s ease;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
  border: none;
}

.diff-button:hover {
  background: linear-gradient(145deg, #7ebc59, #4b9c42);
  transform: translateY(-3px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.3);
}

.diff-button:active {
  transform: translateY(0);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2);
}
</style>