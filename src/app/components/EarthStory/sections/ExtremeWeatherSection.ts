import { StorySection } from '../types';
import * as THREE from 'three';
import { SceneObjects } from '../types';

const ExtremeWeatherSection: StorySection = {
  title: 'Extreme Weather',
  subtitle: 'Oceans and Climate',
  description: 'Ocean temperatures drive hurricanes, typhoons, and extreme weather events worldwide.',
  facts: [
    'Satellite sensors monitor sea surface temperatures.',
    'Warmer oceans fuel stronger storms.',
    'Understanding patterns helps protect communities.'
  ],
  progress: 0,
  animate: (scene: SceneObjects, progress: number, camera: THREE.PerspectiveCamera, userControlled: boolean) => {
    // TODO: animate storms and waves
  }
};

export default ExtremeWeatherSection;
