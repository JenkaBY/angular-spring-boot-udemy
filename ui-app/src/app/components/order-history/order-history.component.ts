import {Component, OnInit} from '@angular/core';
import {OrderHistoryService} from "../../service/order-history.service";
import {OrderHistory} from "../../common/order-history";

@Component({
    selector: 'app-order-history',
    templateUrl: './order-history.component.html',
    styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
    orders: OrderHistory[] = [];
    storage: Storage = sessionStorage;

    constructor(private orderHistoryService: OrderHistoryService) {
    }

    ngOnInit(): void {
        this.handleOrderHistory();
    }

    private handleOrderHistory() {
        const email = this.storage.getItem('userEmail') as string;

        this.orderHistoryService.getOrderHistory(JSON.parse(email)).subscribe(data => {
            this.orders = data._embedded.orders
        })

    }
}
