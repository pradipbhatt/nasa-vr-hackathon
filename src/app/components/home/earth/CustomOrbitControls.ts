import * as THREE from "three";

export class CustomOrbitControls {
  camera: THREE.Camera;
  domElement: HTMLElement;
  enabled = true;
  enableDamping = true;
  dampingFactor = 0.05;
  minDistance = 5;
  maxDistance = 100;
  
  private spherical = { radius: 25, theta: 0, phi: Math.PI / 2 };
  private sphericalDelta = { radius: 0, theta: 0, phi: 0 };
  private target = new THREE.Vector3();
  private isDragging = false;
  private rotateStart = new THREE.Vector2();
  private rotateDelta = new THREE.Vector2();
  
  constructor(camera: THREE.Camera, domElement: HTMLElement) {
    this.camera = camera;
    this.domElement = domElement;
    
    const offset = new THREE.Vector3().subVectors(camera.position, this.target);
    this.spherical.radius = offset.length();
    this.spherical.theta = Math.atan2(offset.x, offset.z);
    this.spherical.phi = Math.acos(Math.max(-1, Math.min(1, offset.y / this.spherical.radius)));
    
    this.domElement.addEventListener('mousedown', this.onMouseDown, { passive: false });
    this.domElement.addEventListener('wheel', this.onMouseWheel, { passive: false });
    this.domElement.addEventListener('touchstart', this.onTouchStart, { passive: false });
    this.domElement.addEventListener('contextmenu', (e) => e.preventDefault());
  }
  
  private onMouseDown = (e: MouseEvent) => {
    if (!this.enabled) return;
    e.preventDefault();
    this.isDragging = true;
    this.rotateStart.set(e.clientX, e.clientY);
    document.addEventListener('mousemove', this.onMouseMove, { passive: false });
    document.addEventListener('mouseup', this.onMouseUp);
  };
  
  private onMouseMove = (e: MouseEvent) => {
    if (!this.enabled || !this.isDragging) return;
    e.preventDefault();
    this.rotateDelta.set(e.clientX - this.rotateStart.x, e.clientY - this.rotateStart.y).multiplyScalar(0.5);
    this.sphericalDelta.theta -= (2 * Math.PI * this.rotateDelta.x) / this.domElement.clientHeight;
    this.sphericalDelta.phi -= (2 * Math.PI * this.rotateDelta.y) / this.domElement.clientHeight;
    this.rotateStart.set(e.clientX, e.clientY);
  };
  
  private onMouseUp = () => {
    this.isDragging = false;
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  };
  
  private onMouseWheel = (e: WheelEvent) => {
    if (!this.enabled) return;
    e.preventDefault();
    this.sphericalDelta.radius += e.deltaY * 0.002;
  };
  
  private touchStartDistance = 0;
  
  private onTouchStart = (e: TouchEvent) => {
    if (!this.enabled) return;
    e.preventDefault();
    
    if (e.touches.length === 1) {
      this.isDragging = true;
      this.rotateStart.set(e.touches[0].clientX, e.touches[0].clientY);
      document.addEventListener('touchmove', this.onTouchMove, { passive: false });
      document.addEventListener('touchend', this.onTouchEnd);
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      this.touchStartDistance = Math.sqrt(dx * dx + dy * dy);
      document.addEventListener('touchmove', this.onTouchMove, { passive: false });
      document.addEventListener('touchend', this.onTouchEnd);
    }
  };
  
  private onTouchMove = (e: TouchEvent) => {
    if (!this.enabled) return;
    e.preventDefault();
    
    if (e.touches.length === 1 && this.isDragging) {
      this.rotateDelta.set(
        e.touches[0].clientX - this.rotateStart.x,
        e.touches[0].clientY - this.rotateStart.y
      ).multiplyScalar(0.5);
      this.sphericalDelta.theta -= (2 * Math.PI * this.rotateDelta.x) / this.domElement.clientHeight;
      this.sphericalDelta.phi -= (2 * Math.PI * this.rotateDelta.y) / this.domElement.clientHeight;
      this.rotateStart.set(e.touches[0].clientX, e.touches[0].clientY);
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      this.sphericalDelta.radius += (this.touchStartDistance - distance) * 0.01;
      this.touchStartDistance = distance;
    }
  };
  
  private onTouchEnd = () => {
    this.isDragging = false;
    document.removeEventListener('touchmove', this.onTouchMove);
    document.removeEventListener('touchend', this.onTouchEnd);
  };
  
  update() {
    if (!this.enabled) return;
    
    if (this.enableDamping) {
      this.sphericalDelta.theta *= (1 - this.dampingFactor);
      this.sphericalDelta.phi *= (1 - this.dampingFactor);
      this.sphericalDelta.radius *= (1 - this.dampingFactor);
    }
    
    this.spherical.theta += this.sphericalDelta.theta;
    this.spherical.phi += this.sphericalDelta.phi;
    this.spherical.radius += this.sphericalDelta.radius;
    
    this.spherical.phi = Math.max(0.01, Math.min(Math.PI - 0.01, this.spherical.phi));
    this.spherical.radius = Math.max(this.minDistance, Math.min(this.maxDistance, this.spherical.radius));
    
    if (!this.enableDamping) {
      this.sphericalDelta.theta = 0;
      this.sphericalDelta.phi = 0;
      this.sphericalDelta.radius = 0;
    }
    
    const offset = new THREE.Vector3();
    offset.x = this.spherical.radius * Math.sin(this.spherical.phi) * Math.sin(this.spherical.theta);
    offset.y = this.spherical.radius * Math.cos(this.spherical.phi);
    offset.z = this.spherical.radius * Math.sin(this.spherical.phi) * Math.cos(this.spherical.theta);
    
    this.camera.position.copy(this.target).add(offset);
    this.camera.lookAt(this.target);
  }
  
  dispose() {
    this.domElement.removeEventListener('mousedown', this.onMouseDown);
    this.domElement.removeEventListener('wheel', this.onMouseWheel);
    this.domElement.removeEventListener('touchstart', this.onTouchStart);
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('touchmove', this.onTouchMove);
    document.removeEventListener('touchend', this.onTouchEnd);
  }
}