import { StorySection } from "../types";
import { easeInOutCubic } from "../utils/easing";

export const FirstAtomsSection: StorySection = {
  title: "First Atoms Form",
  subtitle: "T = 380,000 years",
  description: "The Universe cools to 3,000K, allowing electrons to bind with nuclei.",
  facts: ["Temperature: 3,000K", "Composition: 75% H, 25% He", "Cosmic Microwave Background forms"],
  progress: 1/13,
  animate: (obj, p, camera, userControlled) => {
    const eased = easeInOutCubic(p);
    
    if (!userControlled) {
      camera.position.set(0, 2, 5);
    }
    
    obj.bigBang.particlesMaterial.opacity = (1 - eased) * 0.9;
    obj.lights.ambient.intensity = 0.4 + eased * 0.25;
    obj.lights.directional.intensity = 1.5 + eased * 0.3;
    obj.cosmos.cmbMaterial.uniforms.opacity.value = 0.25 - eased * 0.15;
    obj.bigBang.waveMaterial.opacity = 0;
    obj.bigBang.singularityMaterial.opacity = 0;

    obj.lights.point1.intensity = 4.5 - eased * 2.8;
    obj.lights.point2.intensity = 4.5 - eased * 2.8;
    obj.lights.rim.intensity = 2.5 - eased * 1.5;
  }
};