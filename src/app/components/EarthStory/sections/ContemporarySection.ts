import { StorySection } from "../types";
import { easeInOutCubic } from "../utils/easing";
import * as THREE from "three";

export const ContemporarySection: StorySection = {
  title: "Contemporary Era",
  subtitle: "21st Century (2000-2025)",
  description: "Intense warming, rising seas flood coasts, atmosphere traps more heat.",
  facts: ["CO2: 420+ ppm", "Sea level rise: 20cm", "Extreme weather increases"],
  progress: 11/13,
  animate: (obj, p, camera, userControlled) => {
    const eased = easeInOutCubic(p);
    
    if (!userControlled) {
      camera.position.set(0, 2, 1.5);
      camera.lookAt(0, 0, 0);
    }

    obj.earth.cloudsMaterial.opacity = 0.9;
    obj.earth.atmosphereMaterial.uniforms.opacity.value = 0.71 + eased * 0.1;

    obj.climate.seaLevelScale.value = 1.06 + eased * 0.04;

    obj.climate.co2Material.opacity = 0.6 + eased * 0.4;
    obj.climate.heatMapMaterial.opacity = 0.4 + eased * 0.3;

    obj.ocean.microplasticsMaterial.opacity = 0.4 + eased * 0.3;

    obj.earth.oceanMaterial.color = new THREE.Color(0x0077bb);
  }
};