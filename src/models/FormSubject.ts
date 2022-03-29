import {AbstractControl} from "@angular/forms";
import {BehaviorSubject, filter, Observable, Observer, Subscription} from "rxjs";

/**
 * An extension for behaviour subject that subscribes and sets a given form value
 */
export class FormSubject<T> extends BehaviorSubject<T> {

  /**
   * @static
   * Create an observable that watches the given form's value
   * @param form
   */
  static formToObservable<T>(form: AbstractControl): Observable<T> {
    return new Observable<T>(subscriber => {
      subscriber.next(form.value);
      const formSub = form.valueChanges.subscribe(value => {
        subscriber.next(value);
      });
      subscriber.add(formSub);
    });
  }

  /**
   * The behaviour subject is being initiated by the form's current value
   * @param form
   * @param ignoreInvalid Whether to ignore invalid values when subscribing the subject
   */
  constructor(public form: AbstractControl, private readonly ignoreInvalid: boolean = false) {
    // Keeps the initial value in the behaviour subject's value
    super(form.value);
  }

  /**
   * Subscribe the form's value (error or complete cannot be occurred, so they are removed from the arguments)
   * @param observerOrNext
   */
  override subscribe(
    observerOrNext?: Partial<Observer<T>> | ((value: T) => void) | null,
  ): Subscription {
    return FormSubject.formToObservable(this.form).pipe(
      filter(() => !this.ignoreInvalid || this.form.valid)
    ).subscribe(...arguments);
  }

  /**
   * Set the form's value
   * @param value
   */
  override next(value: T) {
    this.form.setValue(value);
  }

  /**
   * Get the form's value
   */
  override getValue(): T {
    return this.form.value;
  }

  /**
   * Get the form's initial value (the value of the form at construction)
   */
  getInitialValue() {
    return super.getValue();
  }

  /**
   * Reset the form to its initial value
   */
  reset() {
    this.form.reset(this.getInitialValue());
  }

  /**
   * Whether the current form's value is equal to the initial value
   */
  isInitialValue() {
    return JSON.stringify(this.getValue()) === JSON.stringify(this.getInitialValue());
  }

}
