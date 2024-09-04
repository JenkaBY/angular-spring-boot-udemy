import { Component, OnInit } from '@angular/core';
import {SalesPerson} from "./sales-person";

@Component({
  selector: 'app-sales-person-list',
  templateUrl: './sales-person-list.component.html',
  styleUrls: ['./sales-person-list.component.css']
})
export class SalesPersonListComponent implements OnInit {
  salesPersonList: SalesPerson[] = [
    new SalesPerson("Ivan", "Ivanov", "i.ivanov@company.com", 50000),
    new SalesPerson("Abbey", "Ivanov", "a.ivanov@company.com", 4000),
    new SalesPerson("Bob", "Ivanov", "b.ivanov@company.com", 30000),
    new SalesPerson("Cat", "Ivanov", "c.ivanov@company.com", 90000),
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
