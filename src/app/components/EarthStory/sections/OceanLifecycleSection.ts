import { StorySection } from "../types";
import { easeInOutCubic } from "../utils/easing";
import * as THREE from "three";

export const OceanLifecycleSection: StorySection = {
  title: "Ocean Crisis & Future",
  subtitle: "2025-2100 Projection",
  description: "Ocean ecosystems collapse, coral bleaching widespread, marine life diminishes dramatically.",
  facts: [
    "Coral: 90% bleached by 2050",
    "Microplastics: 150M tons in oceans",
    "Fish populations: -70%",
    "Ocean acidification: pH 7.8 → 7.7"
  ],
  progress: 12/13,
  animate: (obj, p, camera, userControlled) => {
    const eased = easeInOutCubic(p);
    
    if (!userControlled) {
      camera.position.set(0, 1, 1.8);
      camera.lookAt(0, 0, 0);
    }
    
    // Extreme climate effects
    obj.earth.atmosphereMaterial.uniforms.opacity.value = 0.81 + eased * 0.15;
    obj.climate.seaLevelScale.value = 1.1 + eased * 0.1;
    obj.climate.co2Material.opacity = 0.9;
    obj.climate.heatMapMaterial.opacity = 0.6 + eased * 0.3;
    
    // Ocean health deterioration
    obj.earth.oceanMaterial.color = new THREE.Color(0x006699);
    obj.ocean.microplasticsMaterial.opacity = 0.7 + eased * 0.3;
    
    // Coral bleaching
    obj.ocean.coralReef.children.forEach((coral) => {
      const mesh = coral as THREE.Mesh;
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.3 + eased * 0.5;
      const bleachColor = new THREE.Color();
      bleachColor.lerpColors(new THREE.Color(0xff6b6b), new THREE.Color(0xcccccc), eased);
      mat.color = bleachColor;
    });
    
    // Phytoplankton decline
    obj.ocean.phytoplanktonMaterial.opacity = 0.7 * (1 - eased * 0.6);
    
    // Ocean waves intensify
    obj.ocean.waves.children.forEach((wave, i) => {
      const mesh = wave as THREE.Mesh;
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = eased * 0.3;
      mesh.position.y = Math.sin(Date.now() * 0.001 + i * 0.5) * 0.02 * (1 + eased);
    });
    
    // Temperature visualization
    const tempColor = new THREE.Color();
    tempColor.lerpColors(new THREE.Color(0x0077bb), new THREE.Color(0xff4400), eased);
    obj.earth.oceanMaterial.color = tempColor;
  }
};