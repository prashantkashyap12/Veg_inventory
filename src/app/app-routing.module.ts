import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerManagComponent } from './customer-manag/customer-manag.component';
import { CustomerNewOrderComponent } from './customer-new-order/customer-new-order.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerWorkingReportListComponent } from './customer-working-report-list/customer-working-report-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UpdateOrderComponent } from './update-order/update-order.component';

const routes: Routes = [

  {path:'', component:DashboardComponent},
  {path:'customer-managment', component:CustomerManagComponent},
  {path:'customer-order', component:CustomerNewOrderComponent},
  {path:'customer-list', component:CustomerListComponent},
  {path:'customer-working', component:CustomerWorkingReportListComponent},
  {path:'update-order', component:UpdateOrderComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
