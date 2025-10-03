import { StorySection } from '../types';
import * as THREE from 'three';
import { SceneObjects } from '../types';

const PhytoplanktonSection: StorySection = {
  title: 'Phytoplankton',
  subtitle: 'Tiny Ocean Producers',
  description: 'Phytoplankton are microscopic organisms that produce oxygen and form the base of the ocean food chain.',
  facts: [
    'Produce ~50% of the planet’s oxygen.',
    'Satellite imagery tracks blooms globally.',
    'Essential for marine life survival.'
  ],
  progress: 0,
  animate: (scene: SceneObjects, progress: number, camera: THREE.PerspectiveCamera, userControlled: boolean) => {
    // TODO: animate phytoplankton bloom
  }
};

export default PhytoplanktonSection;
