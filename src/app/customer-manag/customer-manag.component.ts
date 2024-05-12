import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-customer-manag',
  templateUrl: './customer-manag.component.html',
  styleUrls: ['./customer-manag.component.css'],
})
export class CustomerManagComponent implements OnInit {
  dataTable: any = [];
  id: any;
  constructor(private _http: HttpClient) {}
  ngOnInit(): void {
    this.dataget();
  }

  private auth = 'http://localhost:3000/customerManagement';

  btndataView = true;
  AlertView = false;
  @ViewChild('datalogin', { read: NgForm }) FormEditTemp!: NgForm;

  // POST Data
  dataSend(formData: any) {
    if (this.btndataView) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      console.log(formData, 'FORMs');

      this._http.post(this.auth, formData).subscribe((res) => {
        console.log(res);
        this.AlertView = true;
        this.FormEditTemp.resetForm();
        window.location.reload();
      });
    } else {
      // Update Operation Fill-2
      if (confirm('Are you Sure want to update this entry')) {
        this._http.put(`${this.auth}/${this.id}`, formData).subscribe((res) => {
          this.AlertView = true;
          this.FormEditTemp.resetForm();
          window.location.reload();
        });
      }
    }

    this.dataget();
  }

  // Delete Data -- DONE
  del(id: any, i: any) {
    if (
      confirm(
        'Do You want to delete this : ' +
          this.dataTable[i].firstName +
          ' ' +
          this.dataTable[i].LastName
      )
    ) {
      console.log(i, 'index');
      const index = i + 1;
      console.log(`${this.auth}/${id}`);

      this._http.delete(`${this.auth}/${id}`).subscribe((res) => {
        console.log(res);
        this.dataget();
      });
    }
  }

  // Fatch Data   -- DONE
  dataget() {
    this._http.get(this.auth).subscribe((res) => {
      this.dataTable = res;
      // this.datatable = JSON.parse(dataupdate);
      console.log(res);
    });
  }

  // Update Operation Fill-1 - DONE
  edit(i: any, id: any) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.btndataView = false;
    this.id = id;
    let sr = i;
    this.FormEditTemp.setValue({
      firstName: this.dataTable[i].firstName,
      LastName: this.dataTable[i].LastName,
      custContact: this.dataTable[i].custContact,
      altcontact: this.dataTable[i].altcontact,
      Wallet: this.dataTable[i].Wallet,
      custBox: this.dataTable[i].custBox,
      custAddres: this.dataTable[i].custAddres,
      custlandMark: this.dataTable[i].custlandMark,
      custCity: this.dataTable[i].custCity,
    });
  }
}
