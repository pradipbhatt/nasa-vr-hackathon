import { StorySection } from "../types";
import { easeInOutCubic } from "../utils/easing";
import * as THREE from "three";

export const WorldWarsSection: StorySection = {
  title: "World Wars Era",
  subtitle: "20th Century (1900-1950)",
  description: "Rapid industrialization, oceans start warming, atmosphere thickens.",
  facts: ["CO2: 310 ppm", "Sea temp rise: 0.2°C", "Global population: 1.6B to 2.5B"],
  progress: 9/13,
  animate: (obj, p, camera, userControlled) => {
    const eased = easeInOutCubic(p);
    
    if (!userControlled) {
      camera.position.set(0, 2, 3 - eased * 1);
      camera.lookAt(0, 0, 0);
    }

    obj.earth.cloudsMaterial.opacity = 0.7 + eased * 0.1;
    obj.earth.atmosphereMaterial.uniforms.opacity.value = 0.51 + eased * 0.1;

    obj.climate.seaLevelScale.value = 1.01 + eased * 0.02;

    obj.climate.co2Material.opacity = 0.1 + eased * 0.2;
    obj.climate.heatMapMaterial.opacity = 0.05 + eased * 0.15;

    obj.earth.oceanMaterial.color = new THREE.Color(0x00aaff);
  }
};