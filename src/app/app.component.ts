import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {lengthSystem} from "./units/unitsSystems/length";
import {projectionsSystem} from "./units/unitsSystems/projections";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  lengthForm = new FormControl();

  lengthUnitSystem = lengthSystem;

  selectedLengthUnit = new FormControl('meter');

  coordsForm = this.formBuilder.group({
    lat: ['', Validators.required],
    lng: ['', Validators.required]
  });

  projectionUnitSystem = projectionsSystem;

  selectedProjUnit = new FormControl('WGS84');

  constructor(
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
  }

  selectLengthUnit(event: Event) {
    // @ts-ignore
    this.selectedLengthUnit.setValue(event.target.value);
  }

  selectProjUnit(event: Event) {
    // @ts-ignore
    this.selectedProjUnit.setValue(event.target.value);
  }

}
