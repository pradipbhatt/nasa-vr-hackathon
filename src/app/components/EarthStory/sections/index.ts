// Historical / Earth story sections
import { BigBangSection } from "./BigBangSection";
import { FirstAtomsSection } from "./FirstAtomsSection";
import { FirstStarsSection } from "./FirstStarsSection";
import { MilkyWaySection } from "./MilkyWaySection";
import { SunIgnitesSection } from "./SunIgnitesSection";
import { EarthCoalescesSection } from "./EarthCoalescesSection";
import { GiantImpactSection } from "./GiantImpactSection";
import { LifeEmergesSection } from "./LifeEmergesSection";
import { IndustrialRevolutionSection } from "./IndustrialRevolutionSection";
import { WorldWarsSection } from "./WorldWarsSection";
import { ModernEraSection } from "./ModernEraSection";
import { ContemporarySection } from "./ContemporarySection";
import { OceanLifecycleSection } from "./OceanLifecycleSection";
import { SpaceColonizationSection } from "./SpaceColonizationSection";

// New Ocean Sections (default exports)
import OceanFormationSection from "./OceanFormationSection";
import OceanCurrentsSection from "./OceanCurrentsSection";
import PhytoplanktonSection from "./PhytoplanktonSection";
import CoralReefsSection from "./CoralReefsSection";
import SeaLevelRiseSection from "./SeaLevelRiseSection";
import PlasticPollutionSection from "./PlasticPollutionSection";
import ExtremeWeatherSection from "./ExtremeWeatherSection";
import FutureOceansSection from "./FutureOceansSection";

export const sections = [
  BigBangSection,
  FirstAtomsSection,
  FirstStarsSection,
  MilkyWaySection,
  SunIgnitesSection,
  EarthCoalescesSection,
  GiantImpactSection,
  LifeEmergesSection,
  IndustrialRevolutionSection,
  WorldWarsSection,
  ModernEraSection,
  ContemporarySection,
  OceanLifecycleSection,

  // Ocean-related sections
  OceanFormationSection,
  OceanCurrentsSection,
  PhytoplanktonSection,
  CoralReefsSection,
  SeaLevelRiseSection,
  PlasticPollutionSection,
  ExtremeWeatherSection,
  FutureOceansSection,

  SpaceColonizationSection
];
