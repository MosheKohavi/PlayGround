/**
 * Dual converters: from standard unit to the requested unit and vise versa.
 */
export interface UnitConverters<T> {
  fromStd: (value: T) => T;
  toStd: (value: T) => T;
}

/**
 * A utility function for building a commonly used numeric converters using a factor
 * @param factor
 * @param maxDecimals limit the number of digits after the decimal dot for the unit
 */
export function factorConverters(factor: number, maxDecimals?: number): UnitConverters<number> {
  return {
    fromStd: value => {
      const fromSrdValue = value * factor;
      if (maxDecimals) {
        const order = 10 ^ maxDecimals;
        return Math.round(fromSrdValue * order) / order;
      } else {
        return fromSrdValue;
      }
    },
    toStd: value => value / factor,
  }
}

/**
 * A unit definition, containing the converters from and to the standard unit.
 * The standard unit itself does not need to include the converters field.
 */
export interface Unit<T> {
  title: string;
  symbol?: string;
  converters?: UnitConverters<T>;
}

/**
 * A units' system is a map of units.
 * The object keys should include the names of the units
 */
export type UnitsSystem<N extends string, T> = {
  [Key in N]: Unit<T>;
}

/**
 * Find the standard unit of the system (the one without converters)
 * @param unitsSystem
 */
export function getStandardUnit<N extends string, T>(unitsSystem: UnitsSystem<N, T>): Unit<T> {
  const units = Object.values(unitsSystem) as Unit<T>[];
  const unit = units.find((u) => !u.converters);
  if (unit) {
    return unit;
  }
  throw new Error('The unit system has no standard unit!');
}


// /**
//  * A utility function to connect a proxy form value to source form value by converting their units
//  * @param proxyFormCtrl The form that is being controlled by the user
//  * @param sourceFormCtrl The form behind the scenes that holds the "real" value with the standard unit
//  * @param unitsSystem The units system to use
//  * @param unitName$ An observable that contains the unit to use in the proxy control
//  * @param takeUntil$ Some observable for unsubscribing (should usually be emitted by ngOnDestroy)
//  */
// export function connectUnitProxyForm<Names extends string>(
//   proxyFormCtrl: AbstractControl,
//   sourceFormCtrl: AbstractControl,
//   unitsSystem: UnitsSystem<Names, any>,
//   unitName$: Observable<Names>,
//   takeUntil$: Observable<unknown>,
// ) {
//
//   let currentUnit: Unit<any>;
//
//   // Change the value of the proxy form, according to the "real" value and the requested unit to use
//   combineLatest([
//     sourceFormCtrl.valueChanges.pipe(startWith(sourceFormCtrl.value)),
//     unitName$,
//   ]).pipe(
//     takeUntil(takeUntil$),
//   ).subscribe(([value, unit]) => {
//     currentUnit = unitsSystem[unit];
//     const fromStd = currentUnit.converters?.fromStd;
//     const newValue = fromStd ? fromStd(value) : value;
//     if (proxyFormCtrl.value !== newValue) {
//       proxyFormCtrl.setValue(newValue);
//     }
//   });
//
//   // When the user changes the proxy form, the source get the converted back value
//   proxyFormCtrl.valueChanges.pipe(
//     takeUntil(takeUntil$),
//   ).subscribe(value => {
//     if (!currentUnit) {
//       throw new Error('The unit$ observable has not emitted!');
//     }
//     const toStd = currentUnit.converters?.toStd;
//     const newValue = toStd ? toStd(value) : value;
//     if (sourceFormCtrl.value !== newValue) {
//       sourceFormCtrl.setValue(newValue);
//     }
//   });
//
//   // The proxy status should follow the source status
//   sourceFormCtrl.statusChanges.pipe(
//     takeUntil(takeUntil$),
//   ).subscribe(status => {
//     if (status === "DISABLED") {
//       proxyFormCtrl.disable();
//     } else {
//       proxyFormCtrl.enable();
//       if (status === "PENDING") {
//         proxyFormCtrl.markAsPending();
//       } else {
//         proxyFormCtrl.setErrors(sourceFormCtrl.errors);
//       }
//     }
//   });
//
// }
//
