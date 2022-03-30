import {
  Directive,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Self,
  SimpleChanges
} from '@angular/core';
import {
  AbstractControl,
  AbstractControlDirective,
  ControlContainer,
  FormArray,
  FormGroup,
  NgControl
} from "@angular/forms";
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

  /**
   * Emits on error while converting the values
   */
  @Output() conversionError = new EventEmitter<any>();

  private _sub?: Subscription;

  /**
   * The selected unit. If not supplied, or not exist
   */
  private get unit(): Unit<any> {
    return (this.unitName && this.unitSystem[this.unitName]) || getStandardUnit(this.unitSystem);
  }

  /**
   * The control's directive is the form control OR the form's group directive of the element
   * @private
   */
  private readonly controlDirective: AbstractControlDirective;

  /**
   * The form control or group of the element (initiated after ngOnInit)
   */
  get control() {
    return this.controlDirective.control!;
  }

  constructor(
    @Optional() @Self() ngControl: NgControl,
    @Optional() @Self() formGroup: ControlContainer,
  ) {
    this.controlDirective = ngControl || formGroup;
    if (!this.controlDirective) {
      throw new Error('The directive must be used on a form element');
    }
  }

  /**
   * Start subscribing the forms value, and convert the form's values into the standard unit by keeping the input's view.
   */
  ngOnInit() {
    this._sub = this.control.valueChanges.pipe(
      filter((v, i) => i % 2 === 0),
      startWith(this.control.value),
    ).subscribe(v => {
      try {
        const stdValue = this.unit.converters?.toStd(v) ?? v;
        this.setCtrlValue(this.control, stdValue, 'model');
      } catch (e) {
        this.conversionError.emit(e);
      }
    })
  }

  /**
   * When the @Input unit is being changed, keep the form's value, but convert the input's view according to the unit
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes["unitName"]) {
      const ctrlValue = this.control.value;
      try {
        const unitValue = this.unit.converters?.fromStd(ctrlValue) ?? ctrlValue;
        this.setCtrlValue(this.control, unitValue, 'view');
      } catch (e) {
        this.conversionError.emit(e);
      }
    }
  }

  /**
   * Stop form's value subscription
   */
  ngOnDestroy() {
    this._sub?.unsubscribe();
  }

  /**
   * Set the given value on the given control, for the model only or for the view only.
   * For a control group, set each sub control individually (1 level down), and emit event only at the end.
   * @param ctrl
   * @param value
   * @param viewOrModel Change only the view or model of the control by keeping the other's value
   * @private
   */
  private setCtrlValue(ctrl: AbstractControl, value: any, viewOrModel: 'view' | 'model') {
    const isGrouped = this.hasSubForms(ctrl);
    const emitValueOptions = {
      emitModelToViewChange: viewOrModel === 'view',
      emitViewToModelChange: viewOrModel === 'model',
      emitEvent: !isGrouped,
    }
    if (isGrouped) {
      Object.keys(ctrl.controls).forEach(k => {
        ctrl.controls[k].setValue(value[k], emitValueOptions);
      });
      ctrl.updateValueAndValidity();
    } else {
      ctrl.setValue(value, emitValueOptions);
    }
  }

  /**
   * Whether the abstract form is a group or an array, and hence has the "controls" property
   * @param ctrl
   * @private
   */
  private hasSubForms(ctrl: AbstractControl): ctrl is FormGroup {
    return ctrl instanceof FormArray || ctrl instanceof FormGroup;
  }

}
