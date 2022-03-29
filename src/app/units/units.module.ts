import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormUnitConverterDirective} from './directives/form-unit-converter.directive';
import {lengthSystem, LengthUnitPipe} from "./unitsSystems/length";
import { UnitPipe } from './pipes/unit.pipe';
import {ProjUnitPipe} from "./unitsSystems/projections";


@NgModule({
  declarations: [
    FormUnitConverterDirective,
    UnitPipe,
    LengthUnitPipe,
    ProjUnitPipe
  ],
  exports: [
    FormUnitConverterDirective,
    LengthUnitPipe,
    ProjUnitPipe
  ],
  imports: [
    CommonModule
  ],
})
export class UnitsModule {
}
