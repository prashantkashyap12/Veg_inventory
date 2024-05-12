import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  private orders = 'http://localhost:3000/orders';
  private customers = 'http://localhost:3000/customerManagement';
  private products = 'http://localhost:3000/products';

  datatable: any;
  customerList: any;
  customerForm: any;
  productForm: any;
  productList: any;
  viewOrderDetail: any;
  fromDate: any;
  toDate: any;
  searchName: any;
  searchStatus = null;
  @ViewChild('datalogin', { read: NgForm }) FormEditTemp!: NgForm;

  constructor(private _http: HttpClient, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      selectCustomer: [null, Validators.required],
      name: [{ value: '', disabled: true }],
      contact: [{ value: '', disabled: true }],
      wallet: [{ value: '', disabled: true }],
      box: [{ value: '', disabled: true }],
      address: [{ value: '', disabled: true }],
    });
    this.productForm = this.fb.group({
      productName: [null, Validators.required],
      box: [null, Validators.required],
      totalWeight: [null, Validators.required],
      goodsWeight: [null, Validators.required],
      totalBill: [null, Validators.required],
      payAmount: [null, Validators.required],
      submitBox: [null, Validators.required],
    });
    this.getProducts();
    this.getCustomers();
    this.getOrdersJson();
  }

  getOrdersJson() {
    this._http.get(this.orders).subscribe((res) => {
      const dataupdate = JSON.stringify(res);
      this.datatable = JSON.parse(dataupdate);
      this.datatable.map((ele: any) => {
        this.customerList.map((custEle: any) => {
          console.log(ele, 'ele');
          this.productList.map((prodEle: any) => {
            if (ele.items[0].id == prodEle.id) {
              ele['prodName'] = prodEle.productName;
            }

            if (ele.customerId == custEle.id) {
              ele['name'] = custEle.firstName + ' ' + custEle.LastName;
              ele['contact'] = custEle.custContact;
              ele['wallet'] = custEle.Wallet;
              ele['box'] = custEle.custBox;
            }
          });
        });
      });
      console.log(res);
    });
  }
  getCustomers() {
    this._http.get(this.customers).subscribe((res) => {
      const dataupdate = JSON.stringify(res);
      this.customerList = JSON.parse(dataupdate);
      console.log(res);
    });
  }

  getProducts() {
    this._http.get(this.products).subscribe((res) => {
      const dataupdate = JSON.stringify(res);
      this.productList = JSON.parse(dataupdate);
      console.log(res);
    });
  }

  getTotalWallet(): number {
    return this.customerList.reduce(
      (total: number, customer: { Wallet: any }) => {
        const walletAmount = Number(customer.Wallet);
        return total + walletAmount;
      },
      0
    );
  }

  getTotalCustBox(): number {
    return this.customerList.reduce(
      (total: number, customer: { custBox: any }) => {
        const boxCount = Number(customer.custBox);
        return total + boxCount;
      },
      0
    );
  }
}
