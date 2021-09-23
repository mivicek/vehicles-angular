import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCarComponent } from './components/add-car/add-car.component';
import { AllCarsComponent } from './components/all-cars/all-cars.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

const routes: Routes = [
  { path: '', component: AllCarsComponent },
  { path: 'add-vehicle', component: AddCarComponent },
  { path: '**', component: NotFoundComponent },  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
