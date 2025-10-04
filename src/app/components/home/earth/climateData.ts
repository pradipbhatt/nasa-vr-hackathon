import { 
  ThermometerIcon, 
  LeafIcon, 
  DropletIcon, 
  WavesIcon 
} from "./Icons";

export const temperatureData = [
  { year: 1880, temp: -0.16, avgTemp: 13.64, co2: 291, sst: 16.2, chlorophyll: 0.15, salinity: 34.7, seaLevel: 0 },
  { year: 1890, temp: -0.33, avgTemp: 13.47, co2: 295, sst: 16.0, chlorophyll: 0.16, salinity: 34.7, seaLevel: 0.5 },
  { year: 1900, temp: -0.08, avgTemp: 13.72, co2: 296, sst: 16.3, chlorophyll: 0.15, salinity: 34.7, seaLevel: 1.2 },
  { year: 1910, temp: -0.42, avgTemp: 13.38, co2: 300, sst: 15.9, chlorophyll: 0.17, salinity: 34.7, seaLevel: 1.8 },
  { year: 1920, temp: -0.27, avgTemp: 13.53, co2: 303, sst: 16.1, chlorophyll: 0.16, salinity: 34.7, seaLevel: 2.3 },
  { year: 1930, temp: -0.15, avgTemp: 13.65, co2: 306, sst: 16.2, chlorophyll: 0.15, salinity: 34.7, seaLevel: 2.9 },
  { year: 1940, temp: 0.13, avgTemp: 13.93, co2: 310, sst: 16.5, chlorophyll: 0.14, salinity: 34.7, seaLevel: 3.5 },
  { year: 1950, temp: -0.02, avgTemp: 13.78, co2: 311, sst: 16.3, chlorophyll: 0.15, salinity: 34.7, seaLevel: 4.0 },
  { year: 1960, temp: 0.03, avgTemp: 13.83, co2: 317, sst: 16.4, chlorophyll: 0.14, salinity: 34.7, seaLevel: 4.8 },
  { year: 1970, temp: 0.03, avgTemp: 13.83, co2: 326, sst: 16.4, chlorophyll: 0.13, salinity: 34.6, seaLevel: 5.5 },
  { year: 1980, temp: 0.26, avgTemp: 14.06, co2: 339, sst: 16.6, chlorophyll: 0.12, salinity: 34.6, seaLevel: 6.5 },
  { year: 1985, temp: 0.12, avgTemp: 13.92, co2: 346, sst: 16.5, chlorophyll: 0.12, salinity: 34.6, seaLevel: 7.2 },
  { year: 1990, temp: 0.45, avgTemp: 14.25, co2: 354, sst: 16.8, chlorophyll: 0.11, salinity: 34.6, seaLevel: 8.0 },
  { year: 1995, temp: 0.45, avgTemp: 14.25, co2: 361, sst: 16.8, chlorophyll: 0.11, salinity: 34.6, seaLevel: 8.9 },
  { year: 2000, temp: 0.42, avgTemp: 14.22, co2: 370, sst: 16.8, chlorophyll: 0.10, salinity: 34.5, seaLevel: 10.0 },
  { year: 2005, temp: 0.68, avgTemp: 14.48, co2: 380, sst: 17.0, chlorophyll: 0.10, salinity: 34.5, seaLevel: 11.5 },
  { year: 2010, temp: 0.72, avgTemp: 14.52, co2: 390, sst: 17.1, chlorophyll: 0.09, salinity: 34.5, seaLevel: 13.2 },
  { year: 2015, temp: 0.90, avgTemp: 14.70, co2: 401, sst: 17.3, chlorophyll: 0.09, salinity: 34.5, seaLevel: 15.0 },
  { year: 2016, temp: 1.02, avgTemp: 14.82, co2: 404, sst: 17.4, chlorophyll: 0.08, salinity: 34.4, seaLevel: 15.8 },
  { year: 2017, temp: 0.92, avgTemp: 14.72, co2: 407, sst: 17.3, chlorophyll: 0.08, salinity: 34.4, seaLevel: 16.5 },
  { year: 2018, temp: 0.85, avgTemp: 14.65, co2: 409, sst: 17.2, chlorophyll: 0.08, salinity: 34.4, seaLevel: 17.2 },
  { year: 2019, temp: 0.98, avgTemp: 14.78, co2: 411, sst: 17.4, chlorophyll: 0.08, salinity: 34.4, seaLevel: 18.0 },
  { year: 2020, temp: 1.02, avgTemp: 14.82, co2: 414, sst: 17.4, chlorophyll: 0.08, salinity: 34.4, seaLevel: 18.8 },
  { year: 2021, temp: 0.85, avgTemp: 14.65, co2: 416, sst: 17.2, chlorophyll: 0.08, salinity: 34.4, seaLevel: 19.5 },
  { year: 2022, temp: 0.89, avgTemp: 14.69, co2: 418, sst: 17.3, chlorophyll: 0.08, salinity: 34.3, seaLevel: 20.2 },
  { year: 2023, temp: 1.17, avgTemp: 14.97, co2: 421, sst: 17.6, chlorophyll: 0.07, salinity: 34.3, seaLevel: 21.0 },
  { year: 2024, temp: 1.20, avgTemp: 15.00, co2: 424, sst: 17.6, chlorophyll: 0.07, salinity: 34.3, seaLevel: 21.8 },
  { year: 2025, temp: 1.24, avgTemp: 15.04, co2: 427, sst: 17.7, chlorophyll: 0.07, salinity: 34.3, seaLevel: 22.5 },
  { year: 2026, temp: 1.28, avgTemp: 15.08, co2: 430, sst: 17.7, chlorophyll: 0.07, salinity: 34.3, seaLevel: 23.3 },
  { year: 2027, temp: 1.31, avgTemp: 15.11, co2: 433, sst: 17.8, chlorophyll: 0.07, salinity: 34.2, seaLevel: 24.0 },
  { year: 2028, temp: 1.35, avgTemp: 15.15, co2: 436, sst: 17.9, chlorophyll: 0.06, salinity: 34.2, seaLevel: 24.8 },
  { year: 2029, temp: 1.38, avgTemp: 15.18, co2: 439, sst: 17.9, chlorophyll: 0.06, salinity: 34.2, seaLevel: 25.5 },
  { year: 2030, temp: 1.42, avgTemp: 15.22, co2: 442, sst: 18.0, chlorophyll: 0.06, salinity: 34.2, seaLevel: 26.3 },
  { year: 2031, temp: 1.46, avgTemp: 15.26, co2: 445, sst: 18.1, chlorophyll: 0.06, salinity: 34.2, seaLevel: 27.0 },
  { year: 2032, temp: 1.50, avgTemp: 15.30, co2: 448, sst: 18.1, chlorophyll: 0.06, salinity: 34.1, seaLevel: 27.8 },
  { year: 2033, temp: 1.53, avgTemp: 15.33, co2: 451, sst: 18.2, chlorophyll: 0.06, salinity: 34.1, seaLevel: 28.5 },
  { year: 2034, temp: 1.57, avgTemp: 15.37, co2: 454, sst: 18.3, chlorophyll: 0.05, salinity: 34.1, seaLevel: 29.3 },
  { year: 2035, temp: 1.60, avgTemp: 15.40, co2: 457, sst: 18.4, chlorophyll: 0.05, salinity: 34.1, seaLevel: 30.0 },
];

export const dataLayers = [
  {
    id: 'temperature',
    name: 'Temperature',
    icon: ThermometerIcon,
    description: 'Phytoplankton distribution',
    color: { cold: [0, 76, 204], warm: [229, 76, 26], hot: [255, 179, 0] },
    dataKey: 'sst',
    unit: '°C',
    range: [15, 19]
  },
  {
    id: 'chlorophyll',
    name: 'Chlorophyll Concentration',
    icon: LeafIcon,
    description: 'Phytoplankton distribution',
    color: { cold: [0, 100, 0], warm: [50, 200, 50], hot: [150, 255, 150] },
    dataKey: 'chlorophyll',
    unit: 'mg/m³',
    range: [0.05, 0.20]
  },
  {
    id: 'salinity',
    name: 'Ocean Salinity',
    icon: DropletIcon,
    description: 'Salinity variations',
    color: { cold: [100, 100, 255], warm: [150, 150, 255], hot: [200, 200, 255] },
    dataKey: 'salinity',
    unit: 'PSU',
    range: [34, 35]
  },
  {
    id: 'seaLevel',
    name: 'Sea Level Rise',
    icon: WavesIcon,
    description: 'Sea level rise trends',
    color: { cold: [0, 150, 255], warm: [0, 100, 200], hot: [0, 50, 150] },
    dataKey: 'seaLevel',
    unit: 'cm',
    range: [0, 35]
  }
];