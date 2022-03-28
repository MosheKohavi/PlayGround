import {Directive, Input, OnChanges, OnDestroy, OnInit, Optional, Self, SimpleChanges} from '@angular/core';
import {NgControl} from "@angular/forms";
import {filter, startWith, Subscription} from "rxjs";
import {getStandardUnit, Unit, UnitsSystem} from "../models";

@Directive({
  selector: '[appFormUnitConverter]'
})
export class FormUnitConverterDirective<N extends string> implements OnInit, OnChanges, OnDestroy {

  /**
   * The directive must get the unit system to use
   */
  @Input('appFormUnitConverter') unitSystem!: UnitsSystem<N, any>;

  /**
   * The name of the unit to use
   */
  @Input() unitName?: N;

  private _sub?: Subscription;

  /**
   * The selected unit. If not supplied, or not exist
   */
  private get unit(): Unit<any> {
    return (this.unitName && this.unitSystem[this.unitName]) || getStandardUnit(this.unitSystem);
  }

  constructor(
    @Optional() @Self() private ngControl: NgControl,
  ) {
    if (!this.ngControl) {
      console.log('The directive must be used on a form element');
    }
  }

  ngOnInit() {
    // When the control value is being changed, convert the form value to the standard unit, but keep the input view
    this._sub = this.ngControl.control?.valueChanges.pipe(
      filter((v, i) => i % 2 === 0),
      startWith(this.ngControl.value),
    ).subscribe(v => {
      const stdValue = this.unit.converters?.toStd(v) ?? v;
      this.ngControl.control?.setValue(stdValue, {
        emitModelToViewChange: false,
        emitViewToModelChange: true,
      });
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    // When the unit is being changed, keep the form's value but convert the input's view according to the unit
    if (changes["unitName"]) {
      const ctrlValue = this.ngControl.control?.value;
      const unitValue = this.unit.converters?.fromStd(ctrlValue) ?? ctrlValue;
      this.ngControl.control?.setValue(unitValue, {
        emitModelToViewChange: true,
        emitViewToModelChange: false,
      });
    }
  }

  ngOnDestroy() {
    this._sub?.unsubscribe();
  }

}
