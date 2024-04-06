import { CanvasCustom } from '../../../elements/canvas/canvasCustom';
import { CanvasElement } from '../../../elements/canvas/canvasElement';
import { CanvasWrapper } from '../../../elements/canvas/canvasWrapper';
import { Vector2 } from '../../../utils/vector2';
import { Vector3 } from '../../../utils/vector3';
import { CanvasDrawer } from './perspectiveDrawer';
import { World } from './world';

export type cubeVertices = [Vector3, Vector3, Vector3, Vector3, Vector3, Vector3, Vector3, Vector3];
export class Grid extends CanvasWrapper {
    public level: World;
    public start = Vector2.zero;
    public canvasDrawer: CanvasDrawer;

    constructor() {
        super({
            size: new Vector2((256 * 6) * 2, 1200),
        });
    }

    perpective(z: number, target: CanvasElement, c: CanvasRenderingContext2D = this.game.ctx) {
        c.scale(
            1 - (this.canvasDrawer.factor * z),
            1 - (this.canvasDrawer.factor * z));
        c.translate(
            (target.width * (this.canvasDrawer.factor / 2)) * z,
            (target.height * (this.canvasDrawer.factor / 2)) * z
        );
        c.translate(
            (((target.width / 2 + target.x + this.x) - this.level.center.x) * this.canvasDrawer.factor) * z,
            (((target.height / 2 + target.y + this.y) - this.level.center.y) * this.canvasDrawer.factor) * z,
        );
    }

    cube(vertices: cubeVertices){
        this.canvasDrawer.line(this, '#ffffff', vertices[0], vertices[1]);
        this.canvasDrawer.line(this, '#ffffff', vertices[1], vertices[2]);
        this.canvasDrawer.line(this, '#ffffff', vertices[2], vertices[3]);
        this.canvasDrawer.line(this, '#ffffff', vertices[3], vertices[0]);

        this.canvasDrawer.line(this, '#ffffff', vertices[4], vertices[5]);
        this.canvasDrawer.line(this, '#ffffff', vertices[5], vertices[6]);
        this.canvasDrawer.line(this, '#ffffff', vertices[6], vertices[7]);
        this.canvasDrawer.line(this, '#ffffff', vertices[7], vertices[4]);

        this.canvasDrawer.line(this, '#ffffff', vertices[0], vertices[4]);
        this.canvasDrawer.line(this, '#ffffff', vertices[1], vertices[5]);
        this.canvasDrawer.line(this, '#ffffff', vertices[2], vertices[6]);
        this.canvasDrawer.line(this, '#ffffff', vertices[3], vertices[7]);
    }

    build() {

        this.canvasDrawer = new CanvasDrawer(this.game.ctx, this.perpective.bind(this));

        this.addChild(new CanvasCustom({
            render: (c) => {
                const ce = ((this.width / 2 + this.x) - (this.mode.width / 2 - this.level.x));

                this.cube([
                    new Vector3(100, 0, 0),
                    new Vector3(500, 0, 0),
                    new Vector3(500, 400, 0),
                    new Vector3(100, 400, 0),
                    new Vector3(100, 0, 400),
                    new Vector3(500, 0, 400),
                    new Vector3(500, 400, 400),
                    new Vector3(100, 400, 400),
                ]);

                this.cube([
                    new Vector3(100, 0, 500),
                    new Vector3(500, 0, 500),
                    new Vector3(500, 400, 500),
                    new Vector3(100, 400, 500),
                    new Vector3(100, 0, 900),
                    new Vector3(500, 0, 900),
                    new Vector3(500, 400, 900),
                    new Vector3(100, 400, 900),
                ]);


                this.cube([
                    new Vector3(100, 500, 0),
                    new Vector3(500, 500, 0),
                    new Vector3(500, 900, 0),
                    new Vector3(100, 900, 0),
                    new Vector3(100, 500, 400),
                    new Vector3(500, 500, 400),
                    new Vector3(500, 900, 400),
                    new Vector3(100, 900, 400),
                ]);

                this.cube([
                    new Vector3(600, 0, 0),
                    new Vector3(1000, 0, 0),
                    new Vector3(1000, 400, 0),
                    new Vector3(600, 400, 0),
                    new Vector3(600, 0, 400),
                    new Vector3(1000, 0, 400),
                    new Vector3(1000, 400, 400),
                    new Vector3(600, 400, 400),
                ]);

            }
        }), true);
    }
}