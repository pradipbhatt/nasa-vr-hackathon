import * as THREE from "three";

// export interface StorySection {
//   title: string;
//   subtitle: string;
//   description: string;
//   facts: string[];
//   progress: number;
//   animate: (obj: SceneObjects, progress: number, camera: THREE.Camera, userControlled: boolean) => void;
// }
export interface StorySection {
  title: string;
  subtitle: string;
  description: string;
  facts: string[];
  progress?: number;
  animate: (
    obj: SceneObjects,
    progress: number,
    camera: THREE.PerspectiveCamera,  // 👈 fixed here
    userControlled: boolean
  ) => void;
}


export interface SceneObjects {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  lights: {
    ambient: THREE.AmbientLight;
    directional: THREE.DirectionalLight;
    point1: THREE.PointLight;
    point2: THREE.PointLight;
    rim: THREE.PointLight;
  };
  cosmos: {
    starsGroup: THREE.Group;
    cmb: THREE.Mesh;
    cmbMaterial: THREE.ShaderMaterial;
  };
  bigBang: {
    singularity: THREE.Mesh;
    singularityMaterial: THREE.MeshBasicMaterial;
    energyWave: THREE.Mesh;
    waveMaterial: THREE.MeshBasicMaterial;
    particles: THREE.Points;
    particlesMaterial: THREE.PointsMaterial;
  };
  nebula: {
    group: THREE.Group;
  };
  solarSystem: {
    disk: THREE.Mesh;
    diskMaterial: THREE.MeshBasicMaterial;
    sun: THREE.Mesh;
    sunMaterial: THREE.MeshBasicMaterial;
    coronaLayers: THREE.Mesh[];
    prominences: THREE.Mesh[];
    asteroids: THREE.Mesh[];
  };
  earth: {
    earth: THREE.Mesh;
    earthMaterial: THREE.MeshPhongMaterial;
    moltenEarth: THREE.Mesh;
    moltenMaterial: THREE.MeshBasicMaterial;
    lavaGlow: THREE.Mesh;
    lavaGlowMaterial: THREE.MeshBasicMaterial;
    atmosphere: THREE.Mesh;
    atmosphereMaterial: THREE.ShaderMaterial;
    clouds: THREE.Mesh;
    cloudsMaterial: THREE.MeshPhongMaterial;
    oceanParticles: THREE.Points;
    oceanMaterial: THREE.PointsMaterial;
    moon: THREE.Mesh;
    moonMaterial: THREE.MeshStandardMaterial;
  };
  impact: {
    theia: THREE.Mesh;
    theiaMaterial: THREE.MeshStandardMaterial;
    impactFlash: THREE.Mesh;
    impactFlashMaterial: THREE.MeshBasicMaterial;
    debrisField: THREE.Mesh[];
  };
  climate: {
    co2Particles: THREE.Points;
    co2Material: THREE.PointsMaterial;
    heatMap: THREE.Mesh;
    heatMapMaterial: THREE.MeshBasicMaterial;
    seaLevelScale: { value: number };
  };
  ocean: {
    waves: THREE.Group;
    microplastics: THREE.Points;
    microplasticsMaterial: THREE.PointsMaterial;
    coralReef: THREE.Group;
    phytoplankton: THREE.Points;
    phytoplanktonMaterial: THREE.PointsMaterial;
  };
}