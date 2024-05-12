import { HttpClient } from '@angular/common/http';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-customer-new-order',
  templateUrl: './customer-new-order.component.html',
  styleUrls: ['./customer-new-order.component.css'],
})
export class CustomerNewOrderComponent implements OnInit {
  datatable: any = [];
  customerList: any = [];
  billNumber: any;
  selectedCustomerId = null;
  selectedProductId = null;
  lastOrder: object = {};
  currentDate: any;
  currentTime: any;
  customerForm: any;
  productList: any;
  productForm: any;
  totalDue: any;
  totalBox: any;
  // totalDue: number;

  constructor(private _http: HttpClient, private fb: FormBuilder) {
    const now = new Date();
    this.currentDate = this.formatDate(now);
    this.currentTime = this.formatTime(now);
  }

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
      payAmount: [0],
      submitBox: [0],
    });
    this.getOrdersJson();
    this.getCustomers();
    this.getProducts();
    this.updateDateTime();
  }

  private orders = 'http://localhost:3000/orders';
  private customers = 'http://localhost:3000/customerManagement';
  private products = 'http://localhost:3000/products';
  btndataView = true;
  AlertView = false;
  @ViewChild('datalogin', { read: NgForm }) FormEditTemp!: NgForm;

  // POST Data
  // dataSend(formData: any) {
  //   if (this.btndataView) {
  //     window.scrollTo({ top: 0, behavior: 'smooth' });
  //     this._http.post(this.auth, formData).subscribe((res) => {
  //       console.log(res);
  //       this.AlertView = true;
  //       this.FormEditTemp.resetForm();
  //     });
  //   } else {
  //     // Update Operation Fill-2
  //     if (confirm('Are you Sure want to update this entry')) {
  //       this._http.put(this.auth, formData).subscribe((res) => {
  //         console.log(res);
  //       });
  //     }
  //   }
  // }

  formatDate(date: Date): string {
    const day = ('0' + date.getDate()).slice(-2); // Add leading zero if necessary
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are 0-based, add leading zero
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; // Return as DD/MM/YYYY
  }

  formatTime(date: Date): string {
    // Format as HH:mm for the time input compatibility
    return date.toISOString().split('T')[1].substring(0, 5);
  }

  // Fatch Data   -- DONE
  getOrdersJson() {
    this._http.get(this.orders).subscribe((res) => {
      const dataupdate = JSON.stringify(res);
      this.datatable = JSON.parse(dataupdate);
      console.log(res);
      setTimeout(() => {
        this.generateBillNumber();
      }, 1000);
    });
  }

  onDateChange(eve: any) {
    const newDate = eve.target.value;
    const date = new Date(newDate);
    this.currentDate = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;
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

  generateBillNumber() {
    console.log(this.datatable, this.datatable.length);

    console.log(this.datatable[this.datatable.length - 1].orderId);

    const lastOrderId = this.datatable[this.datatable.length - 1].orderId;
    const prefix = lastOrderId.replace(/[0-9]/g, '');
    const numericPart = parseInt(lastOrderId.replace(/\D/g, ''), 10);

    if (!isNaN(numericPart)) {
      const nextNumericPart = numericPart + 1;

      this.billNumber = `${prefix}${nextNumericPart}`;
    }
  }

  updateDateTime(): void {
    const now = new Date();

    this.currentDate = now.toISOString().split('T')[0];

    this.currentTime = now.toTimeString().split(' ')[0];
  }

  selectCustomer() {
    this.selectedCustomerId = this.customerForm.value.selectCustomer;
    const selectedCustomer = this.customerList.filter(
      (ele: any) => ele.id == this.selectedCustomerId
    );

    this.processAllControls('enable');
    this.customerForm.patchValue({
      name: selectedCustomer[0].firstName + selectedCustomer[0].LastName,
      contact: selectedCustomer[0].custContact,
      wallet: selectedCustomer[0].Wallet,
      box: selectedCustomer[0].custBox,
      address: selectedCustomer[0].custAddres,
    });
    this.totalDue = this.customerForm.get('wallet').value;
    this.totalBox = this.customerForm.get('box').value;
    this.processAllControls('disable');
    console.log(selectedCustomer, selectedCustomer[0].name, 'Customer');
    console.log(this.customerForm);
  }

  processAllControls(type: any) {
    Object.keys(this.customerForm.controls).forEach((field) => {
      console.log(field);

      if (field != 'selectCustomer') {
        const control = this.customerForm.get(field);
        type == 'enable' ? control.enable() : control.disable();
      }
    });
  }

  calculateGoodsWeight() {
    const boxCount = this.productForm.get('box').value || 0;
    const totalWeight = this.productForm.get('totalWeight').value || 0;
    if (boxCount && totalWeight) {
      const boxWeight = 2; // Each box's weight

      // Calculate goods weight
      const goodsWeight = totalWeight - boxCount * boxWeight;

      this.productForm.patchValue({
        goodsWeight: goodsWeight > 0 ? goodsWeight : 0, // Ensure that the goods weight isn't negative
      });
      // this.productForm.get('goodsWeight').disable();
    }
  }


  isButtonClickedAct2 = false;
  calculateDueAmount() {
    if (!this.isButtonClickedAct2) {
      this.isButtonClickedAct2 = true;
    } else {
      alert("You already tried.");
      return;
    }
    if (parseFloat(this.productForm.get('payAmount').value)) {
      const totalBill =
        parseFloat(this.productForm.get('totalBill').value) || 0;
      const existingDue =
        parseFloat(this.customerForm.get('wallet').value) || 0;
      const payAmount = parseFloat(this.productForm.get('payAmount').value);
      const currentDue = totalBill + existingDue - payAmount;
      this.customerForm.patchValue({
        wallet: currentDue,
      });
    }
    
  }


  isButtonClicked = false;
  calculateBoxCount() {
    if (!this.isButtonClicked) {
      this.isButtonClicked = true;
    } else {
      alert("Sorry, you already tried.");
      return;
    }

    if (parseFloat(this.productForm.get('submitBox').value)) {
      const currentBox = parseFloat(this.productForm.get('box').value) || 0;
      const existingDueBox =
        parseFloat(this.customerForm.get('box').value) || 0;
      const submitBox = parseFloat(this.productForm.get('submitBox').value);
      const remainingBox = currentBox + existingDueBox - submitBox;
      this.customerForm.patchValue({
        box: remainingBox,
      });
    }

    
  }

  resetDueAmount() {
    this.customerForm.patchValue({
      wallet: this.totalDue,
    });
  }

  resetBox() {
    this.customerForm.patchValue({
      box: this.totalBox,
    });
  }

  printPage() {
    window.print();
  }

  saveOrder() {
    console.log(this.productForm.get('payAmount').value);

    if (
      this.productForm.get('payAmount').value === null ||
      this.productForm.get('payAmount').value === 0
    ) {
      const totalBill =
        parseFloat(this.productForm.get('totalBill').value) || 0;
      const existingDue =
        parseFloat(this.customerForm.get('wallet').value) || 0;
      const currentDue = totalBill + existingDue;
      this.customerForm.patchValue({
        wallet: currentDue,
      });
    }

    if (
      this.productForm.get('submitBox').value === null ||
      this.productForm.get('payAmount').value === 0
    ) {
      const currentBox = parseFloat(this.productForm.get('box').value) || 0;
      const existingDueBox =
        parseFloat(this.customerForm.get('box').value) || 0;
      const remainingBox = currentBox + existingDueBox;
      this.customerForm.patchValue({
        box: remainingBox,
      });
    }

    let status;
    if (
      this.productForm.value.payAmount == 0 ||
      this.productForm.value.payAmount == null
    ) {
      status = 'Not Paid';
    } else if (
      this.productForm.value.payAmount == this.productForm.value.totalBill ||
      this.customerForm?.get('wallet')?.value == 0
    ) {
      status = 'Fully Paid';
    } else if (this.customerForm?.get('wallet')?.value != 0) {
      console.log(this.customerForm.value.wallet);

      status = 'Due Pay';
    }

    let postData = {
      orderId: this.billNumber,
      autoDate: this.currentDate,
      autoTime: this.currentTime,
      status: status,
      customerId: this.selectedCustomerId,
      items: [
        {
          id: this.productForm.value.productName,
          boxNug: this.productForm.value.box,
          totalWeight: this.productForm.value.totalWeight,
          goodsWeight: this.productForm.value.goodsWeight,
          totalBill: this.productForm.value.totalBill,
          payAmount: this.productForm.value.payAmount,
          submitBox: this.productForm.value.submitBox,
        },
      ],
    };

    // if (
    //   this.productForm.get('payAmount').value ||
    //   this.productForm.get('submitBox').value
    // ) {
    this.customerList.filter((ele: any) => {
      if (ele.id == this.customerForm.value.selectCustomer) {
        ele['Wallet'] = this.customerForm?.get('wallet')?.value;
        ele['custBox'] = this.customerForm?.get('box')?.value;
        this._http.put(this.customers + '/' + ele.id, ele).subscribe((res) => {
          console.log(res);
        });
      }
    });
    // }

    this._http.post(this.orders, postData).subscribe((res) => {
      console.log(res);
      this.AlertView = true;
      // this.customerForm.reset();
      // this.productForm.reset();
      // this.generateBillNumber();
    });
  }

  closeModal() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.AlertView = false;
    this.FormEditTemp.resetForm();
    this.customerForm.reset();
    this.productForm.reset();
    this.getOrdersJson();
    this.generateBillNumber();
  }
}
