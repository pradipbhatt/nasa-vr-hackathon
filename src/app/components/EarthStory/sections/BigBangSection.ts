import { StorySection } from "../types";
import { easeInOutCubic } from "../utils/easing";

export const BigBangSection: StorySection = {
  title: "The Big Bang",
  subtitle: "T = 0 seconds",
  description: "13.8 billion years ago, the Universe exploded from a singularity smaller than an atom.",
  facts: ["Temperature: 10³² Kelvin", "Size: <10⁻³⁵ meters", "Age: 0 seconds"],
  progress: 0,
  animate: (obj, p, camera, userControlled) => {
    const eased = easeInOutCubic(p);
    
    if (!userControlled) {
      camera.position.set(0, 2, 25 - eased * 20);
      camera.lookAt(0, 0, 0);
    }

    obj.lights.ambient.intensity = 0.05 + eased * 0.35;
    obj.bigBang.singularityMaterial.opacity = p < 0.05 ? p * 20 : 0;
    obj.bigBang.waveMaterial.opacity = p < 0.15 ? p / 0.15 : 1 - (p - 0.15) / 0.85;
    obj.bigBang.energyWave.scale.set(1 + eased * 150, 1 + eased * 150, 1 + eased * 150);
    obj.cosmos.cmbMaterial.uniforms.opacity.value = eased * 0.25;
    obj.bigBang.particlesMaterial.opacity = eased * 0.9;
    
    const positions = obj.bigBang.particles.geometry.attributes.position.array as Float32Array;
    const velocities = obj.bigBang.particles.geometry.attributes.velocity.array as Float32Array;
    
    for (let i = 0; i < positions.length; i += 3) {
      const spread = eased * 75;
      positions[i] = velocities[i] * spread;
      positions[i + 1] = velocities[i + 1] * spread;
      positions[i + 2] = velocities[i + 2] * spread;
    }
    obj.bigBang.particles.geometry.attributes.position.needsUpdate = true;

    obj.lights.point1.intensity = eased * 4.5;
    obj.lights.point2.intensity = eased * 4.5;
    obj.lights.rim.intensity = eased * 2.5;
  }
};