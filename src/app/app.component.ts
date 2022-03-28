import { Component } from '@angular/core';
import {FormControl} from "@angular/forms";
import {lengthSystem} from "./units/unitsSystems/length";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  form = new FormControl();

  lengthUnitSystem = lengthSystem;

  selectedUnit = new FormControl('meter');

  constructor() {
  }

  selectUnit(event: Event) {
    // @ts-ignore
    this.selectedUnit.setValue(event.target.value);
  }

}
