import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Car } from 'src/app/models/car.model';
import { ResponseMsg } from 'src/app/models/response-msg.model';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.scss']
})
export class AddCarComponent implements OnInit, OnDestroy {

  submited: boolean = false;
  submitSuccess: boolean = false;
  // submitMessage: string = '';

  private vehiclesInputSubscription: Subscription;

  new_vehicle: Car = {
    make: '',
    model: '',
    year: 2021,
  }

  constructor(
    private router: Router,
    private crudService: CrudService,
  ) {
    this.vehiclesInputSubscription = this.crudService.vehiclesInputSubject.subscribe((response: ResponseMsg) => {
      
      if (response.msg === 'exists') {
        this.submitSuccess = false;
      } else if (response.msg === 'success') { 
        this.submitSuccess = true;
      } else {
        console.log('error: ', response); // todo prosljediti u handler
      }
      this.submited = true;
    })
   }

  ngOnInit(): void {
  }

  submit() {
    this.crudService.addCar(this.new_vehicle);
  }

  reset() {
    this.new_vehicle = {
      make: '',
      model: '',
      year: 2021,  
    }
    this.submited = false;
    this.submitSuccess = false;
  }

  backToAllCars() {
    this.reset();
    this.router.navigate(['']);
  }

  ngOnDestroy(): void {
    this.vehiclesInputSubscription.unsubscribe;
  }

}
