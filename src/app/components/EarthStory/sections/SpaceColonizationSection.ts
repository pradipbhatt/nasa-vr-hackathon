import { SceneObjects } from "../types";
import * as THREE from "three";

export const SpaceColonizationSection = {
  title: "Human Colonization of Space",
  subtitle: "Future Era",
  description: "Humanity expands beyond Earth, establishing colonies on the Moon, Mars, and beyond.",
  facts: [
    "First Moon base established in 2050",
    "Terraforming experiments begin on Mars",
    "Asteroid mining fuels new industries"
  ],
  animate: (scene: SceneObjects, progress: number, camera: THREE.PerspectiveCamera, userControlled: boolean) => {
    // Example animation logic
    camera.position.z = 5 - progress * 2; 
    camera.lookAt(0, 0, 0);
  }
};
