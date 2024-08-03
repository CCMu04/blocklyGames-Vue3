import { ref } from "vue";
import mediator from "./mediator";
const createMediator = () => mediator.install({});
export const useStorage = (key) => {
    const string = ref(null);
    const sub = createMediator();
    sub.subscribe(key, (value) => string.value = value);
    return string;
};
