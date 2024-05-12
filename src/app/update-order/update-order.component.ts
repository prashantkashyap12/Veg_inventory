import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-order',
  templateUrl: './update-order.component.html',
  styleUrls: ['./update-order.component.css'],
})
export class UpdateOrderComponent implements OnInit {
  customerForm: any;
  productForm: any;
  datatable: any;
  customerList: any;
  productList: any;
  billNumber: any;
  currentDate: any;
  currentTime: any;
  selectedCustomerId: any;
  totalDue: any;
  totalBox: any;
  AlertView = false;
  totalBillForRef: any;
  totalBoxForRef: any;
  @ViewChild('datalogin', { read: NgForm }) FormEditTemp!: NgForm;

  constructor(private _http: HttpClient, private fb: FormBuilder) {}
  ngOnInit(): void {
    this.customerForm = this.fb.group({
      selectCustomer: [''],
      firstName: [{ value: '', disabled: true }],
      lastName: [{ value: '', disabled: true }],
      contact: [{ value: '', disabled: true }],
      wallet: [{ value: '', disabled: true }],
      box: [{ value: '', disabled: true }],
      address: [{ value: '', disabled: true }],
    });
    this.productForm = this.fb.group({
      id: [{ value: '' }],
      productName: [null, Validators.required],
      box: [null, Validators.required],
      totalWeight: [null, Validators.required],
      goodsWeight: [null, Validators.required],
      totalBill: [null, Validators.required],
      payAmount: [0, Validators.required],
      status: [{ value: '' }],
      submitBox: [0, Validators.required],
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

  searchOrder() {
    console.log(this.billNumber);

    if (this.billNumber) {
      const selectedOrder = this.datatable.filter(
        (ele: any) => ele.orderId == this.billNumber
      );
      // this.currentDate = selectedOrder[0].autoDate;
      // this.currentTime = selectedOrder[0].autoTime;
      this.customerForm.patchValue({
        selectCustomer: selectedOrder[0].customerId,
      });
      this.productForm.patchValue({
        status: selectedOrder[0].status,
        id: selectedOrder[0].id,
      });
      this.productForm.patchValue({
        productName: selectedOrder[0].items[0].id,
        box: selectedOrder[0].items[0].boxNug,
        totalWeight: selectedOrder[0].items[0].totalWeight,
        goodsWeight: selectedOrder[0].items[0].goodsWeight,
        totalBill: selectedOrder[0].items[0].totalBill,
      });

      this.totalBillForRef = selectedOrder[0].items[0].totalBill;
      this.totalBoxForRef = selectedOrder[0].items[0].boxNug;
      this.selectCustomer();
      console.log(selectedOrder, 'ORDER');
      // const payLoad = {
      //   items: [
      //     {
      //       id: this.productForm.value.id,
      //       boxNug: this.productForm.value.box,
      //       totalWeight: this.productForm.value.totalWeight,
      //       goodsWeight: this.productForm.value.goodsWeight,
      //       totalBill: this.productForm.value.totalBill,
      //       payAmount: this.productForm.value.payAmount,
      //       submitBox: this.productForm.value.submitBox,
      //     },
      //   ],
      //   orderId: this.billNumber,
      //   customerId: this.customerForm.value.selectCustomer,
      //   status: this.productForm.value.status,
      //   autoDate: this.currentDate,
      //   autoTime: this.currentTime,
      // };

      // localStorage.setItem('order', JSON.stringify(payLoad));
    }
  }

  updateDateTime(): void {
    const now = new Date();

    this.currentDate = now.toISOString().split('T')[0];

    this.currentTime = now.toTimeString().split(' ')[0];
  }

  calculateDueBill() {
    const totalBill = parseFloat(this.productForm.get('totalBill').value) || 0;
    if (this.totalBillForRef != totalBill) {
      if (totalBill > this.totalBillForRef) {
        let diff = totalBill - this.totalBillForRef;
        let existingDue =
          parseFloat(this.customerForm.get('wallet').value) || 0;
        const currentDue = diff + existingDue;
        this.customerForm.patchValue({
          wallet: currentDue,
        });
        if (parseFloat(this.productForm.get('payAmount').value)) {
          const payAmount = parseFloat(this.productForm.get('payAmount').value);
          const currentDue = diff + existingDue - payAmount;
          this.customerForm.patchValue({
            wallet: currentDue,
          });
        }
      }
      if (totalBill < this.totalBillForRef) {
        let diff = this.totalBillForRef - totalBill;
        let existingDue =
          parseFloat(this.customerForm.get('wallet').value) || 0;
        let currentDue = existingDue - diff;
        this.customerForm.patchValue({
          wallet: currentDue,
        });
        if (parseFloat(this.productForm.get('payAmount').value)) {
          const payAmount = parseFloat(this.productForm.get('payAmount').value);
          const currentDue1 = currentDue - payAmount;
          this.customerForm.patchValue({
            wallet: currentDue1,
          });
        }
      }
    }
    if (
      this.totalBillForRef == totalBill &&
      parseFloat(this.productForm.get('payAmount').value)
    ) {
      const existingDue =
        parseFloat(this.customerForm.get('wallet').value) || 0;
      const payAmount = parseFloat(this.productForm.get('payAmount').value);
      const currentDue = existingDue - payAmount;
      this.customerForm.patchValue({
        wallet: currentDue,
      });
    }
  }

  updateBoxCount() {
    const currentBox = parseFloat(this.productForm.get('box').value) || 0;

    if (currentBox > this.totalBoxForRef) {
      let diff = currentBox - this.totalBoxForRef;
      let existingDueBox = parseFloat(this.customerForm.get('box').value) || 0;

      const currentDue = diff + existingDueBox;
      this.customerForm.patchValue({
        box: currentDue,
      });
      if (parseFloat(this.productForm.get('submitBox').value)) {
        const submitBox = parseFloat(this.productForm.get('submitBox').value);
        const currentDue = diff + existingDueBox - submitBox;
        this.customerForm.patchValue({
          box: currentDue,
        });
      }
    }
    if (currentBox < this.totalBoxForRef) {
      let diff = this.totalBoxForRef - currentBox;
      const existingDueBox =
        parseFloat(this.customerForm.get('box').value) || 0;

      let currentDue = existingDueBox - diff;
      this.customerForm.patchValue({
        box: currentDue,
      });
      if (parseFloat(this.productForm.get('submitBox').value)) {
        const submitBox = parseFloat(this.productForm.get('submitBox').value);
        const currentDue1 = currentDue - submitBox;
        this.customerForm.patchValue({
          box: currentDue1,
        });
      }
    }
    if (
      this.totalBoxForRef == currentBox &&
      parseFloat(this.productForm.get('submitBox').value)
    ) {
      const existingDue = parseFloat(this.customerForm.get('box').value) || 0;
      const submitBox = parseFloat(this.productForm.get('submitBox').value);
      const currentDue = existingDue - submitBox;
      this.customerForm.patchValue({
        box: currentDue,
      });
    }
  }

  // Fatch Data   -- DONE
  getOrdersJson() {
    this._http.get(this.orders).subscribe((res) => {
      const dataupdate = JSON.stringify(res);
      this.datatable = JSON.parse(dataupdate);
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

  selectCustomer() {
    this.selectedCustomerId = this.customerForm.value.selectCustomer;
    const selectedCustomer = this.customerList.filter(
      (ele: any) => ele.id == this.selectedCustomerId
    );

    this.processAllControls('enable');
    this.customerForm.patchValue({
      firstName: selectedCustomer[0].firstName,
      lastName: selectedCustomer[0].LastName,
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
  // // calculateDueAmount() {
  // //   if (parseFloat(this.productForm.get('payAmount').value)) {
  // //     const totalBill =
  // //       parseFloat(this.productForm.get('totalBill').value) || 0;
  // //     const existingDue =
  // //       parseFloat(this.customerForm.get('wallet').value) || 0;
  // //     const payAmount = parseFloat(this.productForm.get('payAmount').value);
  // //     let currentDue;
  // //     if (this.totalBillForRef == totalBill) {
  // //       currentDue = existingDue - payAmount;
  // //     } else {
  // //       currentDue = totalBill + existingDue - payAmount;
  // //     }
  // //     this.calculateDueBill();
  // //     this.customerForm.patchValue({
  // //       wallet: currentDue,
  // //     });
  // //   }
  // }

  // calculateBoxCount() {
  //   if (parseFloat(this.productForm.get('submitBox').value)) {
  //     const currentBox = parseFloat(this.productForm.get('box').value) || 0;
  //     const existingDueBox =
  //       parseFloat(this.customerForm.get('box').value) || 0;
  //     const submitBox = parseFloat(this.productForm.get('submitBox').value);
  //     const remainingBox = currentBox + existingDueBox - submitBox;
  //     this.customerForm.patchValue({
  //       box: remainingBox,
  //     });
  //   }
  // }

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

  saveOrder() {
    // if (
    //   this.productForm.get('payAmount').value === null ||
    //   this.productForm.get('payAmount').value === 0
    // ) {
    // const totalBill =
    //   parseFloat(this.productForm.get('totalBill').value) || 0;
    // const existingDue =
    //   parseFloat(this.customerForm.get('wallet').value) || 0;
    // const currentDue = totalBill + existingDue;
    // this.customerForm.patchValue({
    //   wallet: currentDue,
    // });
    //   this.calculateDueBill();
    // }

    // if (
    //   this.productForm.get('submitBox').value === null ||
    //   this.productForm.get('payAmount').value === 0
    // ) {
    // const currentBox = parseFloat(this.productForm.get('box').value) || 0;
    // const existingDueBox =
    //   parseFloat(this.customerForm.get('box').value) || 0;
    // const remainingBox = currentBox + existingDueBox;
    // this.customerForm.patchValue({
    //   box: remainingBox,
    // });
    //   this.updateBoxCount();
    // }

    // if (
    //   this.productForm.get('payAmount').value ||
    //   this.productForm.get('submitBox').value
    // ) {
    this.customerList.filter((ele: any) => {
      if (ele.id == this.customerForm.value.selectCustomer) {
        ele['Wallet'] = this.customerForm?.get('wallet')?.value;
        ele['custBox'] = this.customerForm?.get('box')?.value;
        console.log(ele, 'customer');

        this._http.put(this.customers + '/' + ele.id, ele).subscribe((res) => {
          console.log(res);
        });
      }
    });
    // }
    let status;
    if (this.productForm.value.payAmount == 0) {
      status = 'Not Paid';
    } else if (
      this.productForm.value.payAmount == this.productForm.value.totalBill
    ) {
      status = 'Fully Paid';
    } else {
      status = 'Due Pay';
    }

    let postData = {
      id: this.productForm.value.id,
      orderId: this.billNumber,
      autoDate: this.currentDate,
      autoTime: this.currentTime,
      status: this.productForm.value.status,
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
    console.log(postData);

    this._http
      .put(this.orders + '/' + postData.id, postData)
      .subscribe((res) => {
        console.log(res);
        this.AlertView = true;
      });
  }

  closeModal() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.AlertView = false;
    this.FormEditTemp.resetForm();
    this.customerForm.reset();
    this.productForm.reset();
  }
}
