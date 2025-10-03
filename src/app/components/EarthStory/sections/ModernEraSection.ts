import { StorySection } from "../types";
import { easeInOutCubic } from "../utils/easing";
import * as THREE from "three";

export const ModernEraSection: StorySection = {
  title: "Modern Era",
  subtitle: "Late 20th Century (1950-2000)",
  description: "Accelerated climate change, ocean levels rise, greenhouse effects intensify.",
  facts: ["CO2: 370 ppm", "Sea level rise: 10cm", "Ozone depletion peaks"],
  progress: 10/13,
  animate: (obj, p, camera, userControlled) => {
    const eased = easeInOutCubic(p);
    
    if (!userControlled) {
      camera.position.set(0, 2, 2 - eased * 0.5);
      camera.lookAt(0, 0, 0);
    }

    obj.earth.cloudsMaterial.opacity = 0.8 + eased * 0.1;
    obj.earth.atmosphereMaterial.uniforms.opacity.value = 0.61 + eased * 0.1;

    obj.climate.seaLevelScale.value = 1.03 + eased * 0.03;

    obj.climate.co2Material.opacity = 0.3 + eased * 0.3;
    obj.climate.heatMapMaterial.opacity = 0.2 + eased * 0.2;

    obj.earth.oceanMaterial.color = new THREE.Color(0x0099dd);

    // Microplastics start appearing
    obj.ocean.microplasticsMaterial.opacity = eased * 0.4;
  }
};