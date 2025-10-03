import { StorySection } from "../types";
import { easeInOutCubic } from "../utils/easing";
import * as THREE from "three";

export const LifeEmergesSection: StorySection = {
  title: "Life Emerges",
  subtitle: "T = 3.5 billion years ago",
  description: "Single-celled organisms appear in Earth's oceans, beginning evolution of all life.",
  facts: ["First life: Prokaryotes", "Ocean temp: 55-85°C", "Leads to 8.7M species today"],
  progress: 7/13,
  animate: (obj, p, camera, userControlled) => {
    const eased = easeInOutCubic(p);
    
    if (!userControlled) {
      camera.position.set(0, 2, 5);
      camera.lookAt(0, 0, 0);
    }

    obj.earth.moltenMaterial.opacity = 0;
    obj.earth.lavaGlowMaterial.opacity = 0;
    obj.earth.earthMaterial.opacity = 1;
    obj.earth.cloudsMaterial.opacity = eased * 0.6;
    obj.earth.oceanMaterial.opacity = eased * 0.9;
    obj.earth.atmosphereMaterial.uniforms.opacity.value = 0.28 + eased * 0.18;

    obj.earth.moonMaterial.opacity = 1;

    obj.impact.debrisField.forEach(d => d.visible = false);
    obj.impact.theiaMaterial.opacity = 0;
    obj.impact.impactFlashMaterial.opacity = 0;

    obj.solarSystem.sunMaterial.opacity = 0.35;
    obj.solarSystem.coronaLayers.forEach((corona, i) => {
      (corona.material as THREE.MeshBasicMaterial).opacity = 0.35 * (0.75 - i * 0.11);
    });

    obj.lights.point1.intensity = 1.1;
    obj.lights.point2.intensity = 1.1;
    obj.lights.rim.intensity = 4.3;

    // Phytoplankton appears
    obj.ocean.phytoplanktonMaterial.opacity = eased * 0.7;
    obj.ocean.phytoplankton.rotation.y += 0.0003;
  }
};