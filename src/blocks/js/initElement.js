import {MiGong} from "@/blocks/action/MiGong";

let allGames = [
    "MiGong"
]

export function initElement(gameId, diff) {
    for (let i = 0; i < allGames.length; i ++) {
        let displayElement = document.getElementById(allGames[i]);
        if (displayElement) displayElement.hidden = true;
    }

    let backgroundElement = document.getElementById("backgroundDiv");
    if (gameId === 1) {
        if (backgroundElement) backgroundElement.style.backgroundImage = 'url(/img/games/MiGong/background.png)';
        MiGong.init(diff);
    }
}