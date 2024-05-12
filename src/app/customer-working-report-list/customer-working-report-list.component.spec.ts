import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerWorkingReportListComponent } from './customer-working-report-list.component';

describe('CustomerWorkingReportListComponent', () => {
  let component: CustomerWorkingReportListComponent;
  let fixture: ComponentFixture<CustomerWorkingReportListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerWorkingReportListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerWorkingReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
