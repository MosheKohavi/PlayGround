import { Pipe, PipeTransform } from '@angular/core';
import {getStandardUnit, Unit, UnitsSystem} from "../models";

@Pipe({
  name: 'unit'
})
export class UnitPipe<N extends string, T> implements PipeTransform {

  /**
   * Convert the standard value to the request unit
   * @param value
   * @param unit
   */
  transform(value: T, unit: Unit<T>): T

  /**
   * Convert the standard value by supplying the units system and unit name.
   * If unit name not supplied or unit not found, use the standard unit.
   * @param value
   * @param unitsSystem
   * @param unitName
   */
  transform(value: T, unitsSystem: UnitsSystem<N, T>, unitName?: N): T

  transform(value: T, unitOrSystem: UnitsSystem<N, T> | Unit<T>, unitName?: N): T {
    let unit: Unit<T>;
    if (Object.values(unitOrSystem).every(u => typeof u === "object")) {
      const system = unitOrSystem as UnitsSystem<N, T>;
      unit = (unitName && system[unitName]) || getStandardUnit(system);
    } else {
      unit = unitOrSystem as Unit<T>;
    }
    return unit.converters?.fromStd(value) ?? value;
  }

}

/**
 * An abstract class for building a pipe for a specific units set
 */
export abstract class UnitConverterPipe<N extends string, T> implements PipeTransform {

  /**
   * The child pipe should be initiated with a given unit system.
   * @param unitsSet
   * @protected
   */
  protected constructor(protected unitsSet: UnitsSystem<N ,T>) {
  }

  /**
   * Convert the given value in the standard unit into the given unit name.
   * The child pipe can extend this function to return a sting of an appropriate format.
   * @param value The "real" value in standard unit
   * @param unitName
   */
  transform(value: T, unitName?: N): T | string {
    const unit = unitName && this.unitsSet[unitName];
    const fromStd = unit?.converters?.fromStd;
    return fromStd ? fromStd(value) : value;
  }

}
