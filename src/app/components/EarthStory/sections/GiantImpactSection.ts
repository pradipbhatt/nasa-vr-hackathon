import { StorySection } from "../types";
import { easeInOutCubic } from "../utils/easing";
import * as THREE from "three";

export const GiantImpactSection: StorySection = {
  title: "The Giant Impact",
  subtitle: "T = 4.5 billion years ago",
  description: "Theia collides with Earth at 4 km/s, forming the Moon.",
  facts: ["Theia diameter: 6,102 km", "Impact velocity: 4.4 km/s", "Moon forms in 1 year"],
  progress: 6/13,
  animate: (obj, p, camera, userControlled) => {
    const eased = easeInOutCubic(p);
    
    if (!userControlled) {
      camera.position.set(0, 2, 5);
    }

    obj.earth.moltenMaterial.opacity = 0.88 - eased * 0.88;
    obj.earth.lavaGlowMaterial.opacity = 0.45 - eased * 0.45;
    obj.earth.earthMaterial.opacity = 0.25 + eased * 0.75;
    obj.earth.atmosphereMaterial.uniforms.opacity.value = eased * 0.28;

    if (p < 0.4) {
      obj.impact.theiaMaterial.opacity = p / 0.4;
      obj.impact.theia.position.x = 25 - (p / 0.4) * 22;
      obj.impact.theia.position.y = (p / 0.4) * 0.6;
    } else if (p < 0.5) {
      const impactLocal = (p - 0.4) / 0.1;
      obj.impact.theiaMaterial.opacity = 1 - impactLocal;
      obj.impact.theia.position.x = 3 - impactLocal * 3;
      obj.impact.theia.position.y = 0.6 - impactLocal * 0.6;

      obj.impact.impactFlashMaterial.opacity = impactLocal < 0.5 ? impactLocal * 2 : 2 - impactLocal * 2;
      obj.impact.impactFlash.scale.set(impactLocal * 5, impactLocal * 5, impactLocal * 5);

      obj.lights.point1.intensity = 1.1 + impactLocal * 9;
      obj.lights.point2.intensity = 1.1 + impactLocal * 9;
      obj.lights.rim.intensity = 4.3 + impactLocal * 6;
    } else {
      obj.impact.theiaMaterial.opacity = 0;
      obj.impact.impactFlashMaterial.opacity = 0;

      const debrisLocal = (p - 0.5) / 0.5;

      obj.impact.debrisField.forEach((debris, i) => {
        debris.visible = debrisLocal < 0.65;
        if (debris.visible) {
          const spread = debrisLocal * 12;
          debris.position.set(
            Math.cos(i * 0.45) * spread + debris.userData.velocity.x * spread,
            Math.sin(i * 0.28) * spread + debris.userData.velocity.y * spread,
            Math.cos(i * 0.65) * spread + debris.userData.velocity.z * spread
          );
          debris.rotation.x += debris.userData.rotSpeed.x;
          debris.rotation.y += debris.userData.rotSpeed.y;
          debris.rotation.z += debris.userData.rotSpeed.z;
        }
      });

      obj.earth.moonMaterial.opacity = debrisLocal;
      obj.earth.moon.position.x = 3 + debrisLocal * 0.8;

      obj.lights.point1.intensity = 10.1 - debrisLocal * 9;
      obj.lights.point2.intensity = 10.1 - debrisLocal * 9;
      obj.lights.rim.intensity = 10.3 - debrisLocal * 6;
    }

    obj.solarSystem.sunMaterial.opacity = 0.35;
    obj.solarSystem.coronaLayers.forEach((corona, i) => {
      (corona.material as THREE.MeshBasicMaterial).opacity = 0.35 * (0.75 - i * 0.11);
    });
    obj.solarSystem.prominences.forEach(prom => {
      (prom.material as THREE.MeshBasicMaterial).opacity = 0.35 * 0.95;
    });
    obj.solarSystem.diskMaterial.opacity = 0;
    obj.solarSystem.asteroids.forEach(a => a.visible = false);
  }
};