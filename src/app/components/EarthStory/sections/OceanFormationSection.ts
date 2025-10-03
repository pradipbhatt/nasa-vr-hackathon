import { StorySection } from '../types';
import * as THREE from 'three';
import { SceneObjects } from '../types';

const OceanFormationSection: StorySection = {
  title: 'Ocean Formation',
  subtitle: 'Birth of the Oceans',
  description: 'Earth’s oceans formed as the planet cooled and water vapor condensed.',
  facts: [
    'Water originated from volcanic outgassing and comet impacts.',
    'The first oceans appeared ~4 billion years ago.',
    'Oceans cover ~71% of Earth’s surface today.'
  ],
  progress: 0,
  animate: (scene: SceneObjects, progress: number, camera: THREE.PerspectiveCamera, userControlled: boolean) => {
    // Example: raise ocean waves as progress increases
    if (scene.ocean?.waves) {
      scene.ocean.waves.rotation.y = progress * Math.PI * 2;
    }
  }
};

export default OceanFormationSection;
