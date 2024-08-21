import Interpreter from 'js-interpreter';
import {ElMessage, ElMessageBox} from "element-plus";
import {gameWorkspace} from "@/blocks/js/gameWorkspace";

export const MiGong = {};

MiGong.pid = 0;
MiGong.diff = 0;
MiGong.add = 87;
MiGong.pause = 200;
MiGong.play = false;
MiGong.name = "MiGong";
MiGong.elements = [
    "MiGongPlane", "MiGongEnd",
    "MiGongCookie1", "MiGongCookie2",
    "MiGongBlock1", "MiGongBlock2"
]

MiGong.need = 0;
MiGong.map = [[]];
MiGong.degree = 0;
MiGong.xChange = 0;
MiGong.yChange = 0;
MiGong.xLocation = 0;
MiGong.yLocation = 0;
MiGong.mapElement = [[]];

MiGong.init = function (diff) {
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    if (!canvas || !ctx) return;
    canvas.width = 460;
    canvas.height = 460;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (diff === 0) {
        // 定义网格参数
        const gridRows = 1;
        const gridCols = 5;
        const gridSize = 450; // 网格的总宽度
        const cellSize = gridSize / gridCols; // 每个单元格的宽度

        // 计算偏移量以将网格居中
        const offsetX = (canvas.width - gridSize) / 2;
        const offsetY = (canvas.height - cellSize) / 2;

        // 绘制网格
        for (let col = 0; col < gridCols; col++) {
            let startX = offsetX + col * cellSize;
            let startY = offsetY;

            // 绘制方格
            ctx.strokeRect(startX, startY, cellSize, cellSize);

            // 计算并标注中心坐标（可选）
            let centerX = startX + (cellSize / 2);
            let centerY = startY + (cellSize / 2);
            ctx.fillStyle = 'black';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`(${centerX.toFixed(2)}, ${centerY.toFixed(2)})`, centerX, centerY);
        }
    }

    if (diff === 1) {
        // 定义网格参数
        const gridRows = 2;
        const gridCols = 5;

        // 计算每个单元格的边长，以保证正方形形状
        const cellSize = Math.min(canvas.width / gridCols, canvas.height / gridRows);

        // 计算偏移量以将网格居中
        const offsetX = (canvas.width - cellSize * gridCols) / 2;
        const offsetY = (canvas.height - cellSize * gridRows) / 2;

        // 绘制网格
        for (let row = 0; row < gridRows; row++) {
            for (let col = 0; col < gridCols; col++) {
                let startX = offsetX + col * cellSize;
                let startY = offsetY + row * cellSize;

                // 绘制方格
                ctx.strokeRect(startX, startY, cellSize, cellSize);

                // 计算并标注中心坐标（可选）
                let centerX = startX + (cellSize / 2);
                let centerY = startY + (cellSize / 2);
                ctx.fillStyle = 'black';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(`(${centerX.toFixed(2)}, ${centerY.toFixed(2)})`, centerX, centerY);
            }
        }
    }

    if (diff === 2) {
        // 定义网格参数
        const gridRows = 12;
        const gridCols = 12;

        // 计算每个单元格的边长，以保证正方形形状
        const cellSize = Math.min(canvas.width / gridCols, canvas.height / gridRows);

        // 计算偏移量以将网格居中
        const offsetX = (canvas.width - cellSize * gridCols) / 2;
        const offsetY = (canvas.height - cellSize * gridRows) / 2;

        // 绘制网格
        for (let row = 0; row < gridRows; row++) {
            for (let col = 0; col < gridCols; col++) {
                let startX = offsetX + col * cellSize;
                let startY = offsetY + row * cellSize;

                // 绘制方格
                ctx.strokeRect(startX, startY, cellSize, cellSize);

                // 计算并标注中心坐标（可选）
                let centerX = startX + (cellSize / 2);
                let centerY = startY + (cellSize / 2);

                // 设置字体大小
                const fontSize = 5; // 你可以根据需要调整字体大小
                ctx.font = `${fontSize}px Arial`;
                ctx.fillStyle = 'black';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                ctx.fillText(`(${centerX.toFixed(2)}, ${centerY.toFixed(2)})`, centerX, centerY);
            }
        }
    }
}

MiGong.initApi = function (interpreter, globalObject) {
    let wrapper = function () {
        return move();
    };
    interpreter.setProperty(globalObject, 'move',
        interpreter.createNativeFunction(wrapper));

    wrapper = function (addDegree) {
        return turn(addDegree);
    };
    interpreter.setProperty(globalObject, 'turn',
        interpreter.createNativeFunction(wrapper));

    wrapper = function (id) {
        return highlightBlock(id);
    };
    interpreter.setProperty(globalObject, 'highlightBlock',
        interpreter.createNativeFunction(wrapper));
}

MiGong.step = function (interpreter) {
    let go = interpreter.step();
    if (!go || !MiGong.play) {
        if (MiGong.play)
            setMessage('wrong', "似乎没有成功抵达终点，请再次尝试！");

        clearInterval(MiGong.pid);
        MiGong.init(MiGong.diff);
    }
};

MiGong.run = function (code) {
    let interpreter = new Interpreter(code, MiGong.initApi);
    MiGong.play = true;
    MiGong.pid = setInterval(function () {
        MiGong.step(interpreter);
    }, MiGong.pause);
};

function move() {
    let nowDegree = MiGong.degree;
    while (nowDegree < 0) nowDegree += 4;
    if (nowDegree % 4 === 0) {
        MiGong.xLocation++;
        MiGong.xChange++;
    }

    if (nowDegree % 4 === 1) {
        MiGong.yLocation++;
        MiGong.yChange++;
    }

    if (nowDegree % 4 === 2) {
        MiGong.xLocation--;
        MiGong.xChange--;
    }

    if (nowDegree % 4 === 3) {
        MiGong.yLocation--;
        MiGong.yChange--;
    }

    checkStatus();
    if (MiGong.play) setTransform();
}

function setTransform() {
    let planeElement = document.getElementById(MiGong.elements[0]);
    if (planeElement)
        planeElement.style.transform =
            `translate(
                ${MiGong.xChange * MiGong.add}px,
                ${MiGong.yChange * MiGong.add}px
            )
            rotate(
                ${90 * MiGong.degree}deg
            )`;
}

function turn(addDegree) {
    MiGong.degree += addDegree;
    setTransform();
}

function highlightBlock(id) {
    gameWorkspace.workspace.highlightBlock(id);
}

function checkStatus() {
    if (MiGong.xLocation < 0 || MiGong.xLocation >= MiGong.map.length) {
        setMessage('wrong', "似乎移动到了地图边界！");
        MiGong.play = false;
        return;
    }

    if (MiGong.yLocation < 0 || MiGong.yLocation >= MiGong.map[0].length) {
        setMessage('wrong', "似乎移动到了地图边界！");
        MiGong.play = false;
        return;
    }

    if (MiGong.map[MiGong.yLocation][MiGong.xLocation] === 7) {
        setMessage('wrong', "飞机被障碍物阻挡！");
        MiGong.play = false;
        return;
    }

    if (MiGong.map[MiGong.yLocation][MiGong.xLocation] === 8) {
        MiGong.need--;
        MiGong.map[MiGong.yLocation][MiGong.xLocation] = 0;
        if (MiGong.mapElement[MiGong.yLocation][MiGong.xLocation])
            MiGong.mapElement[MiGong.yLocation][MiGong.xLocation].hidden = true;

        setMessage('successInfo', `还需要吃${MiGong.need}个饼干即可前往终点！`);
        return;
    }

    if (MiGong.map[MiGong.yLocation][MiGong.xLocation] === 9) {
        if (MiGong.need === 0) {
            setMessage('success', `你已通过 迷宫 的第 ${MiGong.diff + 1} 关！`);
            if (MiGong.mapElement[MiGong.yLocation][MiGong.xLocation])
                MiGong.mapElement[MiGong.yLocation][MiGong.xLocation].hidden = true;
            MiGong.play = false;
        } else setMessage('notice', `你还需要吃${MiGong.need}块饼干才能进入终点！`);
    }
}

function setMessage(type, msg) {
    if (type === 'notice')
        ElMessage({
            showClose: true,
            type: "warning",
            message: msg
        });

    if (type === 'successInfo')
        ElMessage({
            showClose: true,
            type: 'success',
            message: msg
        });

    if (type === 'wrong')
        ElMessageBox.alert(msg, '发生错误').then().catch();

    if (type === 'success')
        ElMessageBox.alert(msg, '通关成功').then().catch();
}