import { existsSync, readFileSync } from 'fs';

export function loadDataFromFIle(geoJsonFilePath = '/Users/sanyam.arya/Desktop/geojson.json'): string {
  // check if file exists
  if (!existsSync(geoJsonFilePath)) throw new Error('File does not exist');

  // load data
  const geoJsonData = readFileSync(geoJsonFilePath, 'utf-8');

  // parse data
  const parsedData = JSON.parse(geoJsonData);

  return parsedData;
}
