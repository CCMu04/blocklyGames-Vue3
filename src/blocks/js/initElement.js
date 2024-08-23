import {MiGong} from "@/blocks/action/MiGong";

export function initElement(gameId, diff) {
    if (gameId === 1) {
        if (MiGong.imgComponent == null) {
            MiGong.initImage();

            const checkInterval = setInterval(() => {
                if (MiGong.imgComponent != null) {
                    clearInterval(checkInterval);
                    MiGong.init(diff);
                }
            }, 100);
        } else MiGong.init(diff);
    }
}