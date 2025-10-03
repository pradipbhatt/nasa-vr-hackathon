import { StorySection } from '../types';
import * as THREE from 'three';
import { SceneObjects } from '../types';

const SeaLevelRiseSection: StorySection = {
  title: 'Sea Level Rise',
  subtitle: 'Rising Seas, Sinking Lands',
  description: 'NASA satellites measure global sea level rise due to melting ice and warming oceans.',
  facts: [
    'Global sea level has risen ~8 inches since 1900.',
    'Thermal expansion and ice melt are main drivers.',
    'Satellites track changes with cm precision.'
  ],
  progress: 0,
  animate: (scene: SceneObjects, progress: number, camera: THREE.PerspectiveCamera, userControlled: boolean) => {
    if (scene.ocean && scene.ocean.waves) {
      // Animate waves' vertical position based on scroll progress
      scene.ocean.waves.position.y = progress * 2;
    }
  }
};

export default SeaLevelRiseSection;
