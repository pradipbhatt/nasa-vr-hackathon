import { StorySection } from '../types';
import * as THREE from 'three';
import { SceneObjects } from '../types';

const OceanCurrentsSection: StorySection = {
  title: 'Ocean Currents',
  subtitle: 'The Global Conveyor Belt',
  description: 'Ocean currents circulate heat and nutrients across the planet, affecting climate and ecosystems.',
  facts: [
    'Currents regulate Earth’s climate.',
    'The Gulf Stream is one of the most famous currents.',
    'Satellites track surface currents globally.'
  ],
  progress: 0,
  animate: (scene: SceneObjects, progress: number, camera: THREE.PerspectiveCamera, userControlled: boolean) => {
    // TODO: animate currents flow
  }
};

export default OceanCurrentsSection;
