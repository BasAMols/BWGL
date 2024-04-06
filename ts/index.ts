import { Game } from "./game";

document.addEventListener("DOMContentLoaded", ()=>{
    const g = new Game();
    document.body.appendChild(g.dom.dom);
    g.dom.dom.appendChild(g.renderer.domGl);
});