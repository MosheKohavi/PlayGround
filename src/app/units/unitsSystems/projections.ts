import {UnitsSystem} from "../models";
import {Pipe} from "@angular/core";
import {UnitConverterPipe} from "../pipes/unit.pipe";
import * as proj4x from 'proj4';
const proj4 = (proj4x as any).default;

// The coords type that the app uses
export interface AppCoords {
  lat: number;
  lng: number;
}

// The code of the ESPG:2100 projection
const espg2100Code = "+proj=tmerc +lat_0=0 +lon_0=24 +k=0.9996 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=-199.87,74.79,246.62,0,0,0,0 +units=m +no_defs";
const greekProjection = proj4.Proj(espg2100Code);

export type Projections = 'WGS84' | 'GGRS87';


export const projectionsSystem: UnitsSystem<Projections, AppCoords> = {
  WGS84: {
    title: 'WGS84'
  },
  GGRS87: {
    title: 'GGRS87',
    converters: {
      fromStd: value => {
        const res = proj4.transform(proj4.WGS84, greekProjection, [value?.lng || 0, value?.lat || 0]);
        return {lng: +res.x.toFixed(5), lat: +res.y.toFixed(5)};
      },
      toStd: value => {
        const res = proj4.transform(greekProjection, proj4.WGS84, [value?.lng || 0, value?.lat || 0]);
        return {lng: +res.x.toFixed(5), lat: +res.y.toFixed(5)};
      }
    }
  }
}

@Pipe({
  name: 'projUnit'
})
export class ProjUnitPipe extends UnitConverterPipe<Projections, AppCoords> {

  constructor() {
    super(projectionsSystem);
  }

  override transform(value: AppCoords, unit: Projections): string {
    try {
      const newValue = super.transform(value, unit) as AppCoords;
      return newValue ? [newValue.lat, newValue.lng].join(', ') : '';
    } catch (e) {
      return 'Invalid coordinates';
    }
  }

}
