import { StorySection } from "../types";
import { easeInOutCubic } from "../utils/easing";
import * as THREE from "three";

export const FirstStarsSection: StorySection = {
  title: "First Stars Ignite",
  subtitle: "T = 100-200 million years",
  description: "Massive Population III stars forge the first heavy elements.",
  facts: ["Star mass: 100-300 M☉", "Lifespan: 2-3 million years", "No metals, pure H/He"],
  progress: 2/13,
  animate: (obj, p) => {
    const eased = easeInOutCubic(p);
    
    obj.cosmos.starsGroup.rotation.y = eased * Math.PI * 3;
    obj.cosmos.starsGroup.children.forEach((layer) => {
      ((layer as THREE.Points).material as THREE.PointsMaterial).opacity = 1;
    });

    obj.lights.directional.intensity = 1.8 + eased * 0.4;
    obj.bigBang.particlesMaterial.opacity = 0;
    obj.cosmos.cmbMaterial.uniforms.opacity.value = 0.1 - eased * 0.1;

    obj.lights.point1.intensity = 1.7 + eased * 2.8;
    obj.lights.point2.intensity = 1.7 + eased * 2.8;
    obj.lights.rim.intensity = 1 + eased * 1.5;
  }
};