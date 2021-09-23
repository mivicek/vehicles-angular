import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Subscription } from 'rxjs';
import { Car } from 'src/app/models/car.model';
import { CrudService } from 'src/app/services/crud.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteVehicleDialogComponent } from 'src/app/reusable-components/delete-vehicle-dialog/delete-vehicle-dialog.component';

@Component({
  selector: 'app-all-cars',
  templateUrl: './all-cars.component.html',
  styleUrls: ['./all-cars.component.scss']
})
export class AllCarsComponent implements OnInit, OnDestroy {
  allVehicles: Car[] = [];
  backendSearchTerm: Car = {
    make: '',
    model: '',
    year: '' 
  }


  displayedColumns: string[] = ['make', 'model', 'year', 'delete'];
  dataSource: MatTableDataSource<Car>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private allVehiclesSubscription: Subscription;

  constructor(
    private crudService: CrudService,
    public dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource(this.allVehicles);
    this.allVehiclesSubscription = this.crudService.allVehiclesSubject.subscribe((vehicles: Car[]) => {
      this.allVehicles = [];
      this.allVehicles = vehicles;
      this.dataSource.data = this.allVehicles;
    })
  }

  ngOnInit(): void {
    if (this.crudService.all_vehicles.length > 0) {
      this.dataSource.data = this.crudService.all_vehicles;
    } else {
      this.getAllCars();
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getAllCars(): void {
    this.crudService.getAllCars();
  }

  openDeleteDialog(element: Car) {
    console.log('element: ', element);
    const dialogRef = this.dialog.open(DeleteVehicleDialogComponent, {
      data: {
        vehicle: element
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result === true) {
        this.crudService.deleteCar(element._id);
      }
    });
  }

  clientFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  backendFilter() {
    console.log('backendFilter: ', this.backendSearchTerm);
    this.crudService.filter(this.backendSearchTerm);
  }

  ngOnDestroy(): void {
    this.allVehiclesSubscription.unsubscribe;
  }

}
