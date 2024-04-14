import { Game } from "./game";

document.addEventListener("DOMContentLoaded", ()=>{
    const g = new Game();
    document.body.appendChild(g.renderer.dom);
});