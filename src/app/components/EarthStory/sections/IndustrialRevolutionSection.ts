import { StorySection } from "../types";
import { easeInOutCubic } from "../utils/easing";

export const IndustrialRevolutionSection: StorySection = {
  title: "Industrial Revolution",
  subtitle: "19th Century",
  description: "Human industrialization begins, leading to early ocean acidification.",
  facts: ["CO2 rise: +10%", "Sea level: Stable", "Early ocean pollution"],
  progress: 8/13,
  animate: (obj, p, camera, userControlled) => {
    const eased = easeInOutCubic(p);
    
    if (!userControlled) {
      camera.position.set(0, 2, 5 - eased * 2);
      camera.lookAt(0, 0, 0);
    }

    obj.earth.earthMaterial.opacity = 1;
    obj.earth.cloudsMaterial.opacity = 0.6 + eased * 0.1;
    obj.earth.oceanMaterial.opacity = 0.9;
    obj.earth.atmosphereMaterial.uniforms.opacity.value = 0.46 + eased * 0.05;

    obj.climate.seaLevelScale.value = 1.0 + eased * 0.01;

    obj.climate.co2Material.opacity = eased * 0.1;
    obj.climate.heatMapMaterial.opacity = eased * 0.05;

    obj.solarSystem.sunMaterial.opacity = 0.35 - eased * 0.35;
  }
};