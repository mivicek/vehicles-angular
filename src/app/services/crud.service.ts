import { Injectable } from '@angular/core';
import { Car } from './../models/car.model';
import { catchError } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ResponseMsg } from '../models/response-msg.model';
import { apiUrl } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CrudService {

  REST_API: string = apiUrl;

  all_vehicles: Car[] = [];

  httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');

  allVehiclesSubject = new Subject<Car[]>();
  vehiclesInputSubject = new Subject<any>();


  errorSubject = new Subject<HttpErrorResponse>(); // toDo

  constructor(private httpClient: HttpClient) { }

  convertAllVehicles(vehicles: any[]) {
    this.all_vehicles = [];
    vehicles.forEach(element => {
      // const temp = JSON.parse(element);
      // console.log('element: ', element);
      const temp: Car = new Car;
      temp._id = element._id;
      temp.make = element.make;
      temp.model = element.model
      temp.year = element.year
      /*
      const temp: Car = {
        make: element.make,
        model: element.model,
        year: element.year,
        _id: element._id
      };
      */
      this.all_vehicles.push(temp);
      
    });
    this.allVehiclesSubject.next(this.all_vehicles);
    // console.log('converted: ', this.all_vehicles);
  }

  getAllCars() {
    return this.httpClient.get(`${this.REST_API}/get-all-cars`)
    .pipe(
      catchError(this.handleError)
    )
    .subscribe((data) => {
      console.log('got data', data);
      // this.all_vehicles = JSON.parse(data);
      this.convertAllVehicles(data as any);
    });
  }

  filter(vehicle: Car) {
    console.log('filter: ', vehicle);
    if (vehicle.year === null) {
      vehicle.year = '';
    }
    return this.httpClient.get(`${this.REST_API}/filter/?make=${vehicle.make}&model=${vehicle.model}&year=${vehicle.year}`).pipe(
      catchError(this.handleError)
    ).subscribe((data) => {
      console.log('got filter data', data);
      this.convertAllVehicles(data as any);
    });
  }

  addCar(car: Car) {
    let API_URL = `${this.REST_API}/add-car`;
    return this.httpClient.post(API_URL, car).pipe(
      catchError(this.handleError)
    ).subscribe((data) => {
      // console.log('data:::', data);
      this.vehiclesInputSubject.next(data as ResponseMsg);
    });
  }

  deleteCar(id: any) { // : Observable<any>
    let API_URL = `${this.REST_API}/delete-car/${id}`;
    console.log('deleting id: ', id);
    return this.httpClient.delete(API_URL, { headers: this.httpHeaders }).pipe(
      catchError(this.handleError)
    ).subscribe((data) => {
      console.log('got delete data', data);
      this.getAllCars(); // refresh
    });
  }

  handleError(error: HttpErrorResponse) {
    console.log('crud error');
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
      this.test();
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    return throwError(errorMessage);
  }

  test(): void {
    console.log('just test');
  }
}
