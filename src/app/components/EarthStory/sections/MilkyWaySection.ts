import { StorySection } from "../types";
import { easeInOutCubic } from "../utils/easing";
import * as THREE from "three";

export const MilkyWaySection: StorySection = {
  title: "Milky Way Forms",
  subtitle: "T = 1 billion years",
  description: "Our galaxy coalesces from merging gas clouds.",
  facts: ["Diameter: 105,700 light-years", "Mass: 1.5 trillion M☉", "Contains our future Solar System"],
  progress: 3/13,
  animate: (obj, p, camera, userControlled) => {
    const eased = easeInOutCubic(p);
    
    if (!userControlled) {
      camera.position.set(0, 2 + eased * 5, 5 + eased * 5);
      camera.lookAt(0, 0, 0);
    }

    obj.nebula.group.children.forEach((nebula, i) => {
      const mesh = nebula as THREE.Mesh;
      (mesh.material as THREE.MeshBasicMaterial).opacity = eased * (0.38 - i * 0.065);
      mesh.scale.set(1 + eased * 2.2, 1 + eased * 2.2, 1 + eased * 2.2);
    });

    obj.cosmos.cmbMaterial.uniforms.opacity.value = 0;
    obj.lights.point1.intensity = 4.5;
    obj.lights.point2.intensity = 4.5;
    obj.lights.rim.intensity = 2.5;
  }
};