declare module 'three/examples/jsm/controls/OrbitControls' {
  import { Camera, EventDispatcher, MOUSE, TOUCH, Vector3, Object3D, Raycaster, Renderer } from 'three';

  export class OrbitControls extends EventDispatcher {
    constructor(object: Camera, domElement?: HTMLElement);
    enabled: boolean;
    target: Vector3;
    minDistance: number;
    maxDistance: number;
    minPolarAngle: number;
    maxPolarAngle: number;
    minAzimuthAngle: number;
    maxAzimuthAngle: number;
    enableDamping: boolean;
    dampingFactor: number;
    enableZoom: boolean;
    zoomSpeed: number;
    enableRotate: boolean;
    rotateSpeed: number;
    enablePan: boolean;
    panSpeed: number;
    screenSpacePanning: boolean;
    keyPanSpeed: number;
    mouseButtons: { LEFT: MOUSE; MIDDLE: MOUSE; RIGHT: MOUSE; };
    touches: { ONE: TOUCH; TWO: TOUCH; };
    update(): void;
    dispose(): void;
    saveState(): void;
    reset(): void;
    getPolarAngle(): number;
    getAzimuthalAngle(): number;
    listenToKeyEvents(domElement: HTMLElement): void;
  }
}
