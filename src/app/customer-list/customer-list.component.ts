import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css'],
})
export class CustomerListComponent implements OnInit {
  constructor(private _http: HttpClient) {}

  ngOnInit(): void {
    this.dataget();
  }

  private auth = 'http://localhost:3000/customerManagement';
  datatable = [
    {
      id: '1',
      firstName: 'Kunwar',
      LastName: 'Bahadur kashyap',
      custContact: 987465468,
      altcontact: 8865080562,
      Wallet: 174,
      custBox: 215,
      custAddres: 'Nagla Ajeeta',
      custlandMark: 'mandir',
      custCity: 'Agra',
    },
  ];

  // Fatch Data   -- DONE
  dataget() {
    this._http.get(this.auth).subscribe((res) => {
      const dataupdate = JSON.stringify(res);
      this.datatable = JSON.parse(dataupdate);
      console.log(res);
    });
  }

  edit(i: any) {
    console.log(i);
  }

  del(i: any) {
    console.log(i);
  }
}
