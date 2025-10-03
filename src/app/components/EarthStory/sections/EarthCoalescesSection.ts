import { StorySection } from "../types";
import { easeInOutCubic } from "../utils/easing";
import * as THREE from "three";

export const EarthCoalescesSection: StorySection = {
  title: "Earth Coalesces",
  subtitle: "T = 4.54 billion years ago",
  description: "Rocky planetesimals collide over millions of years, forming molten proto-Earth.",
  facts: ["Initial temp: 1,200-1,500°C", "Rotation: 5-6 hours/day", "No atmosphere yet"],
  progress: 5/13,
  animate: (obj, p, camera, userControlled) => {
    const eased = easeInOutCubic(p);
    
    if (!userControlled) {
      camera.position.set(0, 2, 5);
      camera.lookAt(0, 0, 0);
    }

    obj.solarSystem.sunMaterial.opacity = 1 - eased * 0.65;
    obj.solarSystem.coronaLayers.forEach((corona, i) => {
      (corona.material as THREE.MeshBasicMaterial).opacity = (1 - eased * 0.65) * (0.75 - i * 0.11);
    });
    obj.solarSystem.prominences.forEach(prom => {
      (prom.material as THREE.MeshBasicMaterial).opacity = (1 - eased * 0.65) * 0.95;
    });

    obj.nebula.group.children.forEach(nebula => {
      (nebula as THREE.Mesh).visible = false;
    });

    obj.solarSystem.diskMaterial.opacity = 0.45 * (1 - eased);

    obj.earth.moltenMaterial.opacity = eased * 0.88;
    obj.earth.lavaGlowMaterial.opacity = eased * 0.45;
    obj.earth.earthMaterial.opacity = eased * 0.25;

    obj.solarSystem.asteroids.forEach(a => a.visible = true);

    obj.lights.point1.intensity = 2.2 - eased * 1.1;
    obj.lights.point2.intensity = 2.2 - eased * 1.1;
    obj.lights.rim.intensity = 4.3;
  }
};