import Interpreter from 'js-interpreter';
import {ElMessage, ElMessageBox} from "element-plus";
import {gameWorkspace} from "@/blocks/js/gameWorkspace";
import {gameStatus} from "@/blocks/js/gameStatus";
import {onMounted} from "vue";

export const MiGong = {};

let AIR_BLOCK = 0;      // 屏障
let PLAYER_BLOCK = 1;   // 角色
let OUTSIDE_BLOCK = 2;  // 出口
let PATH_BLOCK = 3;     // 道路
let LOCK_BLOCK = 4;     // 障碍
let PLAYER_COIN = 5;    // 宝藏

MiGong.resPath = '/img/games/MiGong';
MiGong.resource = [`${MiGong.resPath}/0.png`, `${MiGong.resPath}/1.png`, `${MiGong.resPath}/2.png`, `${MiGong.resPath}/3.png`, `${MiGong.resPath}/4.png`, `${MiGong.resPath}/5.png`]

MiGong.pid = 0;
MiGong.pause = 150;
MiGong.name = "MiGong";

MiGong.map = [[]]; // 地图
MiGong.needCoin = 0;
MiGong.mapPosition = [[]]; // 地图坐标 -> 针对canvas组件
MiGong.imgComponent = null;

const info = { // 人物基础信息
    x: 0, y: 0, degree: 0, getCoin: 0
};

const diffInfo = [{
    map: [[PLAYER_BLOCK, PATH_BLOCK, PATH_BLOCK, PATH_BLOCK, OUTSIDE_BLOCK]], needCoin: 0, firstDegree: 0,
}, {
    map: [[PLAYER_BLOCK, PATH_BLOCK, PATH_BLOCK, PATH_BLOCK, LOCK_BLOCK], [LOCK_BLOCK, PATH_BLOCK, PATH_BLOCK, PATH_BLOCK, OUTSIDE_BLOCK]],
    needCoin: 0,
    firstDegree: 0,
}, {
    map: [[AIR_BLOCK, AIR_BLOCK, LOCK_BLOCK, PLAYER_COIN, PATH_BLOCK, PLAYER_COIN, AIR_BLOCK, AIR_BLOCK, AIR_BLOCK, AIR_BLOCK, AIR_BLOCK], [AIR_BLOCK, AIR_BLOCK, AIR_BLOCK, AIR_BLOCK, AIR_BLOCK, PATH_BLOCK, AIR_BLOCK, AIR_BLOCK, AIR_BLOCK, AIR_BLOCK, AIR_BLOCK], [AIR_BLOCK, AIR_BLOCK, AIR_BLOCK, AIR_BLOCK, AIR_BLOCK, PATH_BLOCK, AIR_BLOCK, AIR_BLOCK, AIR_BLOCK, AIR_BLOCK, LOCK_BLOCK], [AIR_BLOCK, AIR_BLOCK, AIR_BLOCK, PLAYER_COIN, PATH_BLOCK, PATH_BLOCK, LOCK_BLOCK, PLAYER_COIN, AIR_BLOCK, AIR_BLOCK, PLAYER_COIN], [AIR_BLOCK, AIR_BLOCK, AIR_BLOCK, LOCK_BLOCK, PATH_BLOCK, PLAYER_COIN, PATH_BLOCK, PATH_BLOCK, AIR_BLOCK, AIR_BLOCK, PATH_BLOCK], [PLAYER_COIN, PATH_BLOCK, PATH_BLOCK, PATH_BLOCK, PLAYER_COIN, PLAYER_BLOCK, PLAYER_COIN, PATH_BLOCK, PATH_BLOCK, PATH_BLOCK, PLAYER_COIN], [PATH_BLOCK, AIR_BLOCK, AIR_BLOCK, PATH_BLOCK, PATH_BLOCK, PLAYER_COIN, PATH_BLOCK, LOCK_BLOCK, AIR_BLOCK, AIR_BLOCK, AIR_BLOCK], [PLAYER_COIN, AIR_BLOCK, AIR_BLOCK, PLAYER_COIN, LOCK_BLOCK, PATH_BLOCK, PATH_BLOCK, PLAYER_COIN, AIR_BLOCK, AIR_BLOCK, AIR_BLOCK], [OUTSIDE_BLOCK, AIR_BLOCK, AIR_BLOCK, AIR_BLOCK, AIR_BLOCK, PATH_BLOCK, AIR_BLOCK, AIR_BLOCK, AIR_BLOCK, AIR_BLOCK, AIR_BLOCK], [AIR_BLOCK, AIR_BLOCK, AIR_BLOCK, AIR_BLOCK, AIR_BLOCK, PATH_BLOCK, AIR_BLOCK, AIR_BLOCK, AIR_BLOCK, AIR_BLOCK, AIR_BLOCK], [AIR_BLOCK, AIR_BLOCK, AIR_BLOCK, AIR_BLOCK, AIR_BLOCK, PLAYER_COIN, PATH_BLOCK, PLAYER_COIN, LOCK_BLOCK, AIR_BLOCK, AIR_BLOCK]],
    needCoin: 16,
    firstDegree: 0,
}];

const transformInfo = {
    x: 0, y: 0, degree: 0
}

MiGong.initImage = function () {
    MiGong.imgComponent = new Array(MiGong.resource.length);
    for (let i = 0; i < MiGong.imgComponent.length; i++) {
        MiGong.imgComponent[i] = new Image();
        MiGong.imgComponent[i].src = MiGong.resource[i];
    }
}

let canvas, ctx;
let cellSize = 0;
let lastCanvasImage = null;
MiGong.init = function (diff) {
    canvas = document.getElementById("canvas");
    if (canvas) ctx = canvas.getContext("2d");
    if (!canvas || !ctx) return;
    canvas.width = 460;
    canvas.height = 460;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    info.getCoin = 0;
    MiGong.map = JSON.parse(JSON.stringify(diffInfo[diff].map));
    console.log(MiGong.map);
    console.log(diffInfo[diff].map);
    info.degree = diffInfo[diff].firstDegree;
    MiGong.needCoin = diffInfo[diff].needCoin;
    MiGong.setMap(canvas, ctx, MiGong.map.length, MiGong.map[0].length);

    transformInfo.x = MiGong.mapPosition[info.x][info.y].x;
    transformInfo.y = MiGong.mapPosition[info.y][info.y].y;
    transformInfo.degree = info.degree * 60;

    gameStatus.isRun = false;
}

MiGong.initApi = function (interpreter, globalObject) {
    let wrapper = function () {
        return move();
    };
    interpreter.setProperty(globalObject, 'move', interpreter.createNativeFunction(wrapper));

    wrapper = function (addDegree) {
        return turn(addDegree);
    };
    interpreter.setProperty(globalObject, 'turn', interpreter.createNativeFunction(wrapper));

    wrapper = function (id) {
        return highlightBlock(id);
    };
    interpreter.setProperty(globalObject, 'highlightBlock', interpreter.createNativeFunction(wrapper));
}

MiGong.step = function (interpreter) {
    let go = interpreter.step();
    if (!go || !gameStatus.isRun) {
        setMessage('wrong', "似乎没有成功抵达终点 T.T！");
        clearInterval(MiGong.pid);
    }
};

MiGong.run = function (code) {
    let interpreter = new Interpreter(code, MiGong.initApi);
    MiGong.pid = setInterval(function () {
        MiGong.step(interpreter);
    }, MiGong.pause);
    gameStatus.isRun = true;
};

MiGong.setMap = function (canvas, ctx, gridRows, gridCols) {
    const drawAreaSize = 450;
    cellSize = drawAreaSize / Math.max(gridRows, gridCols);
    const offsetX = (canvas.width - (cellSize * gridCols)) / 2;
    const offsetY = (canvas.height - (cellSize * gridRows)) / 2;
    MiGong.mapPosition = Array.from({length: gridRows}, () => Array.from({length: gridCols}, () => ({})));

    for (let row = 0; row < gridRows; row++) {
        for (let col = 0; col < gridCols; col++) {
            let startX = offsetX + col * cellSize;
            let startY = offsetY + row * cellSize;
            MiGong.mapPosition[row][col] = {x: startX, y: startY};
            if (MiGong.map[row][col] !== PATH_BLOCK && MiGong.map[row][col] !== AIR_BLOCK) ctx.drawImage(MiGong.imgComponent[PATH_BLOCK], startX, startY, cellSize, cellSize);

            if (MiGong.map[row][col] === PLAYER_BLOCK) {
                info.x = row;
                info.y = col;
                continue;
            }

            ctx.drawImage(MiGong.imgComponent[MiGong.map[row][col]], startX, startY, cellSize, cellSize);
        }
    }


    lastCanvasImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.drawImage(MiGong.imgComponent[PLAYER_BLOCK], MiGong.mapPosition[info.x][info.y].x, MiGong.mapPosition[info.x][info.y].y, cellSize, cellSize);
}

function move() {
    let degree = info.degree;
    while (degree < 0) degree += 4;
    if (degree % 4 === 0) info.y++;
    if (degree % 4 === 1) info.x++;
    if (degree % 4 === 2) info.y--;
    if (degree % 4 === 3) info.x--;
    checkStatus();
}

function setTransform(totalFrames) {
    const imgCenterX = cellSize / 2;
    const imgCenterY = cellSize / 2;
    const startX = transformInfo.x;
    const startY = transformInfo.y;
    const endX = MiGong.mapPosition[info.x][info.y].x;
    const endY = MiGong.mapPosition[info.x][info.y].y;

    let currentFrame = 0;
    const startAngle = transformInfo.degree * 90 * Math.PI / 180;
    const endAngle = info.degree * 90 * Math.PI / 180;
    const angleIncrement = (endAngle - startAngle) / totalFrames;
    const translateXIncrement = (endX - startX) / totalFrames;
    const translateYIncrement = (endY - startY) / totalFrames;

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.putImageData(lastCanvasImage, 0, 0);
        ctx.save();
        ctx.translate(startX + translateXIncrement * currentFrame + imgCenterX, startY + translateYIncrement * currentFrame + imgCenterY);
        ctx.rotate(startAngle + angleIncrement * currentFrame);
        ctx.translate(-imgCenterX, -imgCenterY);
        ctx.drawImage(MiGong.imgComponent[PLAYER_BLOCK], 0, 0, cellSize, cellSize);
        ctx.restore();

        currentFrame++;
        if (currentFrame < totalFrames) {
            requestAnimationFrame(animate);
        } else {
            transformInfo.x = endX;
            transformInfo.y = endY;
            transformInfo.degree = info.degree;
            if (MiGong.map[info.x][info.y] === PLAYER_COIN) {
                MiGong.map[info.x][info.y] = PATH_BLOCK;
                resetMap();
            }
        }
    }

    animate();
}

function turn(addDegree) {
    info.degree += addDegree;
    setTransform(120);
}

function highlightBlock(id) {
    gameWorkspace.workspace.highlightBlock(id);
}

function checkStatus() {
    if (info.x < 0 || info.y < 0) {
        setMessage("wrong", "似乎走出了森林边界 T-T !");
        clearInterval(MiGong.pid);
        return;
    }

    if (info.x >= MiGong.map.length || info.y >= MiGong.map[0].length) {
        setMessage("wrong", "似乎走出了森林边界 T-T !");
        clearInterval(MiGong.pid);
        return;
    }

    setTransform(120);
    if (MiGong.map[info.x][info.y] === AIR_BLOCK) {
        setMessage("wrong", "似乎走出了森林边界 T-T !");
        clearInterval(MiGong.pid);
        return;
    }

    if (MiGong.map[info.x][info.y] === OUTSIDE_BLOCK) {
        if (info.getCoin === MiGong.needCoin) {
            setMessage("success", `成功带着${MiGong.needCoin}个宝藏走出森林啦 $0$ !`);
            clearInterval(MiGong.pid);
        } else setMessage("notice", `森林中还有${MiGong.needCoin - info.getCoin}个宝藏还没有找到，不要错过了！`);
        return;
    }

    if (MiGong.map[info.x][info.y] === LOCK_BLOCK) {
        setMessage("wrong", "小心！差点迷失在灌木丛里了 @.@ !");
        clearInterval(MiGong.pid);
        return;
    }

    if (MiGong.map[info.x][info.y] === PLAYER_COIN)
        setMessage("notice", `我们成功地找到了${++info.getCoin}个宝藏！`);
}

function resetMap() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(lastCanvasImage, 0, 0);
    ctx.drawImage(MiGong.imgComponent[PATH_BLOCK], MiGong.mapPosition[info.x][info.y].x, MiGong.mapPosition[info.x][info.y].y, cellSize, cellSize);
    lastCanvasImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setTransform(1);
}

function setMessage(type, msg) {
    if (type === 'notice') ElMessage({
        showClose: true, type: "warning", message: msg
    });

    if (type === 'successInfo') ElMessage({
        showClose: true, type: 'success', message: msg
    });

    if (type === 'wrong') ElMessageBox.alert(msg, '发生错误').then().catch();

    if (type === 'success') ElMessageBox.alert(msg, '通关成功').then().catch();
}