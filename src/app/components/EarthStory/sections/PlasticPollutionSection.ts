import { StorySection } from '../types';
import * as THREE from 'three';
import { SceneObjects } from '../types';

const PlasticPollutionSection: StorySection = {
  title: 'Plastic Pollution',
  subtitle: 'The Ocean’s Plastic Problem',
  description: 'Marine debris, especially plastics, is harming ocean ecosystems worldwide.',
  facts: [
    'Over 8 million tons of plastic enter oceans yearly.',
    'Satellites track large debris accumulations.',
    'Microplastics affect marine food chains.'
  ],
  progress: 0,
  animate: (scene: SceneObjects, progress: number, camera: THREE.PerspectiveCamera, userControlled: boolean) => {
    // TODO: animate plastic particles floating
  }
};

export default PlasticPollutionSection;
