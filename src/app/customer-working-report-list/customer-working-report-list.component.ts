import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import * as XLSX from 'xlsx'; 

@Component({
  selector: 'app-customer-working-report-list',
  templateUrl: './customer-working-report-list.component.html',
  styleUrls: ['./customer-working-report-list.component.css'],
})
export class CustomerWorkingReportListComponent implements OnInit {
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
      this.datatable.reverse();
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
  normalizeString(input: string): string {
    return input.replace(/\s+/g, '').toLowerCase();
  }
  searchOrder(event: any) {
    this.getOrdersJson();
    setTimeout(() => {
      this.datatable = this.datatable.filter((order: any) => {
        const validName = event.searchName
          ? this.normalizeString(order.name) ===
            this.normalizeString(event.searchName)
          : true;
        const validStatus = event.searchStatus
          ? this.normalizeString(order.status) ===
            this.normalizeString(event.searchStatus)
          : true;
        let validFromDate = true;
        let validToDate = true;
        if (event.fromDate) {
          const from = new Date(event.fromDate);
          const orderDate = new Date(order.autoDate);
          validFromDate = orderDate >= from;
        }
        if (event.toDate) {
          const to = new Date(event.toDate);
          to.setHours(23, 59, 59, 999); // Include the whole day
          const orderDate = new Date(order.autoDate);
          validToDate = orderDate <= to;
        }
        return validName && validStatus && validFromDate && validToDate;
      });
    }, 2000);
  }
  printPage() {
    const ticketElement = document.getElementById("ticket");
    if (ticketElement) {
        const printContents = ticketElement.innerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        window.location.reload();
    } else {
        console.error("Element with id 'ticket' not found.");
    }
  }
  viewOrder(order: any) {
    console.log(order);
    this.viewOrderDetail = order;
  }
  clearFilter(dataLogin: NgForm) {
    this.FormEditTemp.resetForm();
    this.getOrdersJson();
  }
  closeModal() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }







  // * * * * * * * * prashant workd * * * * * * * *
  totalDueVal:any=24;
  totalBoxVal:any=40
  // Nug/Box : Total Sum in Tfoot.
  calculateTotalResultNug(): number {
    let totalNug = 0;
    for (const order of this.datatable) {
      totalNug += Number(order.items[0].boxNug); 
    }
    return totalNug;
  }
   // netPayment : Total Sum in Tfoot.
   TotalnetPayment(): number {
    let totalNug = 0;
    for (const order of this.datatable) {
      totalNug += Number(order.items[0].totalBill); 
    }
    return totalNug;
  }
   // Recsived payment : Total Sum in Tfoot.
   TotalResivdPay(): number {
    let totalNug = 0;
    for (const order of this.datatable) {
      totalNug += Number(order.items[0].payAmount); 
    }
    return totalNug;
  }
  // Recsived Box : Total Sum in Tfoot.
  TotalResivdBox(): number {
    let totalNug = 0;
    for (const order of this.datatable) {
      totalNug += Number(order.items[0].submitBox); 
    }
    return totalNug;
  }
  // Goods Weight : Total Sum in tFooter
  TotalgoodsWeight(): number{
    let totalNug = 0;
    for (const order of this.datatable) {
      totalNug += Number(order.items[0].goodsWeight); 
    }
    return totalNug;
  }
  // Download Excel and print Table
  downloadExcel() {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.datatable);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveExcelFile(excelBuffer, 'orders.xlsx');
  }
  // Function to save the Excel file
  saveExcelFile(buffer: any, filename: string) {
    const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    const url: string = window.URL.createObjectURL(data);
    const a: HTMLAnchorElement = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

}
