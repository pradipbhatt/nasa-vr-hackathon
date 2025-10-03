import { StorySection } from '../types';
import * as THREE from 'three';
import { SceneObjects } from '../types';

const FutureOceansSection: StorySection = {
  title: 'Future Oceans',
  subtitle: 'What Lies Ahead',
  description: 'Predicting the future of oceans using NASA data to inform conservation and policy decisions.',
  facts: [
    'Climate models forecast warming and acidification.',
    'Satellite observations help plan mitigation.',
    'Global cooperation is needed to protect oceans.'
  ],
  progress: 0,
  animate: (scene: SceneObjects, progress: number, camera: THREE.PerspectiveCamera, userControlled: boolean) => {
    // TODO: animate future projections visually
  }
};

export default FutureOceansSection;
