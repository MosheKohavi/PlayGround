import {factorConverters, UnitsSystem} from "../models";
import {Pipe} from "@angular/core";
import {formatNumber} from "@angular/common";
import {UnitConverterPipe} from "../pipes/unit.pipe";

/**
 * First, define the units names as a type
 */
type LengthUnits = 'meter' | 'centimeter' | 'inch';

/**
 * For each unit name, define its properties and the conversion functions from/to the standard unit.
 * (The standard unit should not contain converters)
 */
export const lengthSystem: UnitsSystem<LengthUnits, number> = {
  meter: {
    title: 'Meter',
    symbol: 'm',
  },
  centimeter: {
    title: 'Centimeter',
    symbol: 'cm',
    converters: factorConverters(100),
  },
  inch: {
    title: 'Inch',
    symbol: "'",
    converters: factorConverters(39.3700787),
  },
}

/**
 * Optional: Creating a pipe which converts the standard unit into the argument's unit.
 * The transform function can be extended to return a string instead of the converted value only.
 */
@Pipe({
  name: 'lengthUnit'
})
export class LengthUnitPipe extends UnitConverterPipe<LengthUnits, number> {

  constructor() {
    // The unit system that the pipe should use
    super(lengthSystem);
  }

  // Optional overriding with number formatting
  override transform(value: number, unit: LengthUnits): string {
    const newValue = super.transform(value, unit);
    let digitInfo: string;
    switch (unit) {
      case "meter":
        digitInfo = '1.2-2';
        break;
      case "centimeter":
        digitInfo = '1.0-0';
        break;
      case 'inch':
        digitInfo = '1.1-1';
        break;
    }
    return formatNumber(+newValue, 'en-US', digitInfo) + this.unitsSet[unit].symbol;
  }

}
