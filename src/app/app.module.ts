import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CustomerManagComponent } from './customer-manag/customer-manag.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerNewOrderComponent } from './customer-new-order/customer-new-order.component';
import { CustomerWorkingReportListComponent } from './customer-working-report-list/customer-working-report-list.component';
import { MainmenuComponent } from './mainmenu/mainmenu.component';
import { ReactiveFormsModule } from '@angular/forms';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UpdateOrderComponent } from './update-order/update-order.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CustomerManagComponent,
    CustomerListComponent,
    CustomerNewOrderComponent,
    CustomerWorkingReportListComponent,
    MainmenuComponent,
    UpdateOrderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    AppComponent,
    DashboardComponent,
    CustomerManagComponent,
    CustomerListComponent,
    CustomerNewOrderComponent,
    CustomerWorkingReportListComponent,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
