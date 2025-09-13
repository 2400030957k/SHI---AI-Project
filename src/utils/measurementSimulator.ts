export interface Measurements {
  chest: number;
  waist: number;
  hips: number;
  shoulders: number;
  armLength: number;
  legLength: number;
  height: number;
  weight: number;
}

export const simulateAIMeasurement = async (imageData?: string): Promise<Measurements> => {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Generate realistic measurements (in cm)
  const baseMeasurements = {
    chest: 85 + Math.random() * 20,
    waist: 70 + Math.random() * 15,
    hips: 90 + Math.random() * 15,
    shoulders: 40 + Math.random() * 10,
    armLength: 55 + Math.random() * 10,
    legLength: 75 + Math.random() * 15,
    height: 160 + Math.random() * 30,
    weight: 55 + Math.random() * 30,
  };

  // Round to 1 decimal place
  return Object.fromEntries(
    Object.entries(baseMeasurements).map(([key, value]) => [key, Math.round(value * 10) / 10])
  ) as Measurements;
};

export const calculateSize = (measurements: Measurements): string => {
  const { chest, waist } = measurements;
  
  if (chest < 85 && waist < 70) return 'XS';
  if (chest < 90 && waist < 75) return 'S';
  if (chest < 95 && waist < 80) return 'M';
  if (chest < 100 && waist < 85) return 'L';
  if (chest < 105 && waist < 90) return 'XL';
  return 'XXL';
};