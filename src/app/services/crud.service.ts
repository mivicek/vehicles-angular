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


  errorSubject = new Subject<HttpErrorResponse>();

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
    // if (this.all_vehicles.length )
    return this.httpClient.get(`${this.REST_API}/get-all-cars`)
      .subscribe(
        data => {
          this.convertAllVehicles(data as any)
        },
        error => {
          this.errorSubject.next(error);
          catchError(this.handleError);
          console.log('error:', error)
        }
      );
  }

  filter(vehicle: Car) {
    console.log('filter: ', vehicle);
    if (vehicle.year === null) {
      vehicle.year = '';
    }
    return this.httpClient.get(`${this.REST_API}/filter/?make=${vehicle.make}&model=${vehicle.model}&year=${vehicle.year}`)
      .subscribe(
        data => {
          this.convertAllVehicles(data as any);
        },
        error => {
          this.errorSubject.next(error);
          catchError(this.handleError);
        }
      );
  }

  fuzzyFilter(keyword: string) {
    return this.httpClient.get(`${this.REST_API}/fuzzy-filter/${keyword}`)
    .subscribe(
      data => {
        this.convertAllVehicles(data as any);
      },
      error => {
        this.errorSubject.next(error);
        catchError(this.handleError);
      }
    );
  }

  addCar(car: Car) {
    let API_URL = `${this.REST_API}/add-car`;
    return this.httpClient.post(API_URL, car)
    .subscribe(data => {
      this.vehiclesInputSubject.next(data as ResponseMsg);
    },
    error => {
      this.errorSubject.next(error);
      catchError(this.handleError);
    }
    );
  }

  deleteCar(id: any) { // : Observable<any>
    let API_URL = `${this.REST_API}/delete-car/${id}`;
    console.log('deleting id: ', id);
    return this.httpClient.delete(API_URL, { headers: this.httpHeaders }).subscribe(
      data => {
      console.log('got delete data', data);
      this.getAllCars(); // refresh
    },
    error => {
      this.errorSubject.next(error);
      catchError(this.handleError);
    }
    );
  }

  handleError(error: HttpErrorResponse) {
    console.log('crud error');
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return (errorMessage)
  }


}
