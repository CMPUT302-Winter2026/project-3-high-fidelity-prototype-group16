import { simulate, updateObjs, type SimObj } from "$lib/components/graph/simulations.svelte";
import { toGlobalSpace, Vector2 } from "$lib/components/graph/vector2";

type Items = Record<string, { x: number, y: number }>;
type Lines = Record<string, { x: number, y: number, angle: number, length: number }>
export class GraphController {

    container?: HTMLElement;

    objs: Map<string, SimObj> = new Map();
    connections: Map<string, string[]> = new Map();

    focusedItem?: SimObj;
    hoveredItem?: SimObj;
    hoveredElement?: HTMLElement;

    items = $state.raw<Items>({});
    lines = $state.raw<Lines>({});

    lastFrame = 0;
    deltaTime = 0;
    animationId = -1;

    physicsFps = 60;
    physicsDT = 1 / this.physicsFps;

    camera = $state({ x: 0, y: 0 });

    get cameraCenter() {
        return Vector2.of(this.camera.x + this.width / 2, this.camera.y + this.height / 2);
    }


    width = 0;
    height = 0;
    resizeObserver?: ResizeObserver;

    mutationObserver?: MutationObserver;

    pauseSim = $state(false);
    startingFrame = -1;

    alpha = $state(0);
    zoom = $state(1);

    constructor() {

    }

    start() {
        if (this.animationId != -1) {
            this.stop();
            this.start();
        }

        this.animationId = requestAnimationFrame(this.update.bind(this));
        this.startingFrame = -1;

    }

    init(container: HTMLElement) {
        this.container = container;
        const rect = container.getBoundingClientRect();

        this.width = rect.width;
        this.height = rect.height;

        this.camera.x = -rect.width / 2;
        this.camera.y = -rect.height / 2;

        this.resizeObserver = new ResizeObserver((e) => {
            const element = e[0];
            this.width = element.contentBoxSize[0].inlineSize;
            this.height = element.contentBoxSize[0].blockSize;
        });
        this.resizeObserver.observe(this.container);

        this.initEvents();
    }

    stop() {
        if (this.animationId != -1) {
            cancelAnimationFrame(this.animationId);
            this.animationId = -1;
        }

        this.resizeObserver?.disconnect();
        this.mutationObserver?.disconnect();
        this.container = undefined;
    }


    lastPoint = Vector2.ZERO;
    initialTouchDist = 0;
    initialZoom = 1;



    setHover(element: HTMLElement) {
        if (this.hoveredElement) {
            this.clearHover();
        }

        const obj = this.objs.get(element.id);
        if (obj) {
            this.hoveredItem = obj;
            this.hoveredElement = element;

            const rect = element.getBoundingClientRect();
            obj.radius = (rect.width + rect.height) / 3;
            this.pauseSim = false;
        }
    }

    clearHover() {
        if (!this.hoveredElement || !this.hoveredItem) {
            return;
        }
        this.hoveredElement = undefined;
        this.hoveredItem.radius = this.hoveredItem.originalRad;
        this.hoveredItem = undefined;
        this.pauseSim = false;
    }



    initEvents() {
        this.container?.addEventListener("wheel", (e) => {
            e.preventDefault();
            if (e.ctrlKey) {
                const rect = this.container?.getBoundingClientRect();
                if (!rect) {
                    return;
                }

                this.zoomAtPoint(
                    Vector2.of(e.clientX - rect.left, e.clientY - rect.top),
                    this.zoom - (this.zoom * Math.sign(e.deltaY) * 0.05)
                );
                return;
            }

            this.pan(Vector2.of(-e.deltaX, -e.deltaY));
        }, {
            passive: false
        });

        this.container?.addEventListener("mousedown", (e) => {
            if (!this.lastPoint.eq(Vector2.ZERO)) {
                return;
            }

            this.lastPoint = Vector2.of(e.screenX, e.screenY);
            if (e.target == this.container) {
                this.clearHover();
                return;
            }

            const element = e.target as HTMLElement;
            const obj = this.objs.get(element.id);

            if (obj) {
                this.setHover(element);
                this.focusedItem = obj;
                obj.static = true;
            }
        })


        this.container?.addEventListener("mousemove", (e) => {

            const current = Vector2.of(e.screenX, e.screenY);
            const dx = current.x - this.lastPoint.x;
            const dy = current.y - this.lastPoint.y;

            if (e.buttons != 1) {
                return;
            }

            if (!this.focusedItem) {
                this.pan(Vector2.of(dx, dy));
            } else {
                this.focusedItem.pos.addip(dx / this.zoom, dy / this.zoom);
                this.pauseSim = false; // important!
            }

            this.lastPoint = current;
        });

        this.container?.addEventListener("mouseup", (e) => {
            if (this.focusedItem) {
                this.focusedItem.static = false;
                this.focusedItem = undefined;
            }
            this.lastPoint = Vector2.ZERO;
        });


        this.container?.addEventListener("touchstart", (e) => {
            const rect = this.container?.getBoundingClientRect()!;

            if (e.touches.length == 1) {
                const touch = e.touches[0];
                this.lastPoint = Vector2.of(touch.clientX - rect.left, touch.clientY - rect.top);

                const element = e.target as HTMLElement;
                const obj = this.objs.get(element.id);

                if (obj) {
                    this.setHover(element);
                    this.focusedItem = obj;
                    obj.static = true;
                }

            } else
                if (e.touches.length == 2) {
                    const touch1 = Vector2.of(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
                    const touch2 = Vector2.of(e.touches[1].clientX - rect.left, e.touches[1].clientY - rect.top);

                    this.initialTouchDist = touch1.distTo(touch2);
                    this.initialZoom = this.zoom;
                    this.lastPoint = Vector2.midPoint(touch1, touch2); // use the midpoint as the last point for panning
                }
        });

        this.container?.addEventListener("touchmove", (e) => {
            e.preventDefault();
            const rect = this.container?.getBoundingClientRect()!;

            if (e.touches.length == 1) {
                const touch = e.touches[0];
                const current = Vector2.of(touch.clientX - rect.left, touch.clientY - rect.top);
                const delta = current.sub(this.lastPoint);

                if (this.focusedItem) {
                    this.focusedItem.pos.addip(delta.x / this.zoom, delta.y / this.zoom);
                    this.pauseSim = false; // important!
                } else {
                    this.pan(delta);
                }

                this.lastPoint = current;
            } else if (e.touches.length == 2) {
                const touch1 = Vector2.of(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
                const touch2 = Vector2.of(e.touches[1].clientX - rect.left, e.touches[1].clientY - rect.top);

                const newDist = touch1.distTo(touch2);
                const currentPoint = Vector2.midPoint(touch1, touch2); // update the last point to the new midpoint for smoother panning

                this.zoomAtPoint(currentPoint, this.initialZoom * (newDist / this.initialTouchDist));

                this.pan(currentPoint.sub(this.lastPoint));
                this.lastPoint = currentPoint;
            }
        }, {
            passive: false
        });


        this.container?.addEventListener("touchend", (e) => {
            if (e.touches.length == 0) {
                this.lastPoint = Vector2.ZERO;
                this.initialTouchDist = 0;

                if (this.focusedItem) {
                    this.focusedItem.static = false;
                    this.focusedItem = undefined;
                }
            } else if (e.touches.length == 1) {
                const rect = this.container?.getBoundingClientRect()!;
                const touch = e.touches[0];
                this.lastPoint = Vector2.of(touch.clientX - rect.left, touch.clientY - rect.top);
                this.initialZoom = this.zoom; // reset initial zoom in case user lifts one finger during a pinch
            }
        });
    }

    zoomAtPoint(p: Vector2, newZoom: number) {
        if (newZoom > 3 ||
            newZoom < 0.25) {
            return;
        }

        const point = toGlobalSpace(p, Vector2.of(this.camera.x, this.camera.y), this.zoom);


        this.camera.x = point.x - (p.x / newZoom);
        this.camera.y = point.y - (p.y / newZoom);
        this.zoom = newZoom;
    }

    pan(delta: Vector2) {
        this.camera.x -= delta.x / this.zoom;
        this.camera.y -= delta.y / this.zoom;
    }

    update(t: number) {
        if (this.startingFrame === -1) {
            this.startingFrame = t;

        }

        this.deltaTime = (t - this.lastFrame) / 1000;

        if (this.deltaTime > this.physicsDT * 3 || this.pauseSim) {
            // we are cooked, skip this frame.
            this.lastFrame = t;
            return this.animationId = requestAnimationFrame(this.update.bind(this));

        }

        // simulate physics at a lower fps, and skip the update if we are dropping frames.
        if (this.deltaTime > this.physicsDT) {
            simulate(this.objs, this.connections, this.deltaTime);
            this.lastFrame = t;
        }

        // always update positions each frame
        this.alpha = updateObjs(this.objs) / this.objs.size;

        // pause the sim when it reach equilibrium
        if (this.alpha < 0.002 && (t - this.startingFrame) > 2000) {
            this.pauseSim = true;
        }

        this.render();

        this.animationId = requestAnimationFrame(this.update.bind(this));
    }

    render() {
        const items: Items = {};
        const lines: Lines = {};

        for (const [id, obj] of this.objs) {
            items[id] = obj.pos.toObj();
        }

        for (const [idA, cons] of this.connections) {
            const A = this.objs.get(idA);

            if (!A) {
                continue;
            }

            for (const idB of cons) {
                const B = this.objs.get(idB);
                if (!B) {
                    continue;
                }

                const diff = B.pos.sub(A.pos);
                const dist = diff.mag();
                const angle = diff.angle();

                lines[`${idA}-${idB}`] = {
                    ...A.pos.toObj(),
                    angle,
                    length: dist
                };
            }
        }

        this.items = items;
        this.lines = lines;

    }

    insertItem(obj: SimObj, parent?: SimObj) {
        if (this.objs.has(obj.id)) {
            return; // node already has a parent, keep it as-is
        } else {


            this.objs.set(obj.id, obj);

            let origin = parent ? parent.pos : this.cameraCenter;
            origin = origin.addp(
                (this.width / 3) * (Math.random() - 0.5),
                (this.height / 3) * (Math.random() - 0.5),
            );

            obj.pos = origin;
        }


        if (parent) {
            if (this.connections.get(obj.id)?.includes(parent.id)) {
                console.log(`Connection already exists between ${obj.id} and ${parent.id}. Ignoring the entry.`);
                return;
            }

            if (!this.objs.has(parent.id)) {
                console.log(`Parent id not in collection: ${parent.id}. Ignoring the entry.`);
                return;
            }

            const cons = this.connections.get(parent.id);
            if (!cons) {
                this.connections.set(parent.id, [obj.id]);
            } else {
                cons.push(obj.id);
            }
        }
    }
}