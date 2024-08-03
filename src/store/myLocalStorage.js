import mediator from "./mediator";
const keys = [];
const createMediator = () => mediator.install({});
const sub = createMediator();
export const myLocalStorage = {
    getItem: (key) => {
        return window.localStorage.getItem(key);
    },
    setItem: (key, value) => {
        // 防止重复发布
        if (!keys.includes(key))
            keys.push(key);
        // 被修改就发布事件
        sub.publish(key, value);
        window.localStorage.setItem(key, value);
    },
    clear: () => {
        // 被删除就每个key发布事件
        keys.map((key) => sub.publish(key, undefined));
        // 发布后清空记录key的数组
        keys.length = 0;
        window.localStorage.clear();
    },
    removeItem: (key) => {
        keys.splice(keys.indexOf(key), 1);
        // 被移除就发布 undefined
        sub.publish(key, undefined);
        window.localStorage.removeItem(key);
    },
    key: window.localStorage.key,
    length: window.localStorage.length,
};
