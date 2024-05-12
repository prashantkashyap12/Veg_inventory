import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerManagComponent } from './customer-manag.component';

describe('CustomerManagComponent', () => {
  let component: CustomerManagComponent;
  let fixture: ComponentFixture<CustomerManagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerManagComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerManagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
