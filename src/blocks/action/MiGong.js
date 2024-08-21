import Interpreter from 'js-interpreter';
import {ElMessage, ElMessageBox} from "element-plus";
import {workspace} from "@/blocks/js/workspace";

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
    MiGong.degree = 0;
    MiGong.diff = diff;
    MiGong.play = false;
    MiGong.xChange = 0;
    MiGong.yChange = 0;

    setTransform()
    let itemElements = new Array(MiGong.elements.length);
    for (let i = 0; i < MiGong.elements.length; i++) {
        itemElements[i] = document.getElementById(MiGong.elements[i]);
        if (itemElements[i]) itemElements[i].hidden = true;
    }

    let allElement = document.getElementById(MiGong.name);
    if (allElement) allElement.hidden = false;

    if (diff === 0) {
        MiGong.need = 0;
        MiGong.degree = 0;
        MiGong.xLocation = 0;
        MiGong.yLocation = 0;
        for (let i = 0; i < 2; i++)
            if (itemElements[i]) itemElements[i].hidden = false;
        MiGong.map = [
            [1, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 9] // 1起点, 9终点
        ];

        MiGong.mapElement = [
            [itemElements[0], null, null, null],
            [null, null, null, null],
            [null, null, null, null],
            [null, null, null, itemElements[1]]
        ]

        if (itemElements[0]) {
            itemElements[0].style.top = `${11}px`;
            itemElements[0].style.left = `${11}px`;
        }

        if (itemElements[1]) {
            itemElements[1].style.top = `${11 + MiGong.add * 3}px`;
            itemElements[1].style.left = `${11 + MiGong.add * 3}px`;
        }
    }

    if (diff === 1) {
        MiGong.need = 2;
        MiGong.degree = 0;
        MiGong.xLocation = 1;
        MiGong.yLocation = 1;
        for (let i = 0; i < 4; i++)
            if (itemElements[i]) itemElements[i].hidden = false;
        MiGong.map = [
            [0, 0, 0, 8],
            [0, 1, 0, 0],
            [0, 0, 9, 0],
            [8, 0, 0, 0] // 8饼干
        ];

        MiGong.mapElement = [
            [null, null, null, itemElements[2]],
            [null, itemElements[0], null, null],
            [null, null, itemElements[1], null],
            [itemElements[3], null, null, null]
        ]

        if (itemElements[0]) {
            itemElements[0].style.top = `${11 + MiGong.add}px`;
            itemElements[0].style.left = `${11 + MiGong.add}px`;
        }

        if (itemElements[1]) {
            itemElements[1].style.top = `${11 + MiGong.add * 2}px`;
            itemElements[1].style.left = `${11 + MiGong.add * 2}px`;
        }

        if (itemElements[2]) {
            itemElements[2].style.top = `${11}px`;
            itemElements[2].style.left = `${11 + MiGong.add * 3}px`;
        }

        if (itemElements[3]) {
            itemElements[3].style.top = `${11 + MiGong.add * 3}px`;
            itemElements[3].style.left = `${11}px`;
        }
    }

    if (diff === 2) {
        MiGong.need = 2;
        MiGong.degree = 0;
        MiGong.xLocation = 0;
        MiGong.yLocation = 3;
        for (let i = 0; i < 6; i++)
            if (itemElements[i]) itemElements[i].hidden = false;
        MiGong.map = [
            [0, 0, 8, 0],
            [0, 0, 0, 7],
            [0, 8, 7, 9],
            [1, 0, 0, 0] // 7障碍物
        ];

        MiGong.mapElement = [
            [null, null, itemElements[2], null],
            [null, null, null, itemElements[4]],
            [null, itemElements[3], itemElements[5], itemElements[1]],
            [itemElements[0], null, null, null]
        ];

        if (itemElements[0]) {
            itemElements[0].style.top = `${11 + MiGong.add * 3}px`;
            itemElements[0].style.left = `${11}px`;
        }

        if (itemElements[1]) {
            itemElements[1].style.top = `${11 + MiGong.add * 2}px`;
            itemElements[1].style.left = `${11 + MiGong.add * 3}px`;
        }

        if (itemElements[2]) {
            itemElements[2].style.top = `${11}px`;
            itemElements[2].style.left = `${11 + MiGong.add * 2}px`;
        }

        if (itemElements[3]) {
            itemElements[3].style.top = `${11 + MiGong.add * 2}px`;
            itemElements[3].style.left = `${11 + MiGong.add}px`;
        }

        if (itemElements[4]) {
            itemElements[4].style.top = `${11 + MiGong.add}px`;
            itemElements[4].style.left = `${11 + MiGong.add * 3}px`;
        }

        if (itemElements[5]) {
            itemElements[5].style.top = `${11 + MiGong.add * 2}px`;
            itemElements[5].style.left = `${11 + MiGong.add * 2}px`;
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
    workspace.workspace.highlightBlock(id);
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