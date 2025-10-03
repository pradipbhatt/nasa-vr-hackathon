import { StorySection } from '../types';
import * as THREE from 'three';
import { SceneObjects } from '../types';

const CoralReefsSection: StorySection = {
  title: 'Coral Reefs',
  subtitle: 'Rainforests of the Sea',
  description: 'Coral reefs are diverse underwater ecosystems facing threats from climate change and pollution.',
  facts: [
    'Support ~25% of all marine species.',
    'Satellite data monitors reef health.',
    'Bleaching events are increasing due to warming oceans.'
  ],
  progress: 0,
  animate: (scene: SceneObjects, progress: number, camera: THREE.PerspectiveCamera, userControlled: boolean) => {
    // TODO: animate reef structures
  }
};

export default CoralReefsSection;
