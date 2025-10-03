import { StorySection } from "../types";
import { easeInOutCubic } from "../utils/easing";
import * as THREE from "three";

export const SunIgnitesSection: StorySection = {
  title: "The Sun Ignites",
  subtitle: "T = 4.6 billion years ago",
  description: "A collapsing molecular cloud triggers nuclear fusion, birthing our star.",
  facts: ["Mass: 1.989 × 10³⁰ kg", "Diameter: 1,391,000 km", "Core temp: 15 million K"],
  progress: 4/13,
  animate: (obj, p, camera, userControlled) => {
    const eased = easeInOutCubic(p);
    
    if (!userControlled) {
      camera.position.set(0, 7 - eased * 5, 10 - eased * 5);
      camera.lookAt(0, 0, 0);
    }

    obj.nebula.group.children.forEach((nebula) => {
      const mesh = nebula as THREE.Mesh;
      mesh.material = mesh.material;
    });

    obj.solarSystem.diskMaterial.opacity = eased * 0.45;
    obj.solarSystem.disk.rotation.y = eased * Math.PI * 2.5;

    obj.solarSystem.sunMaterial.opacity = eased;
    obj.solarSystem.coronaLayers.forEach((corona, i) => {
      (corona.material as THREE.MeshBasicMaterial).opacity = eased * (0.75 - i * 0.11);
    });
    obj.solarSystem.prominences.forEach(prom => {
      (prom.material as THREE.MeshBasicMaterial).opacity = eased * 0.95;
    });

    obj.solarSystem.asteroids.forEach(a => a.visible = eased > 0.7);

    obj.lights.point1.intensity = 4.5 - eased * 2.3;
    obj.lights.point2.intensity = 4.5 - eased * 2.3;
    obj.lights.rim.intensity = 2.5 + eased * 1.8;
  }
};