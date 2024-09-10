import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CheckoutFormService} from "../../service/checkout-form.service";
import {Country} from "../../common/country";
import {State} from "../../common/state";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup?: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;
  creditCardMonths?: number[] = []
  creditCardYears?: number[] = []
  countries: Country[] = [];
  shippingStates: State[] = [];
  billingStates: State[] = [];

  constructor(private formBuilder: FormBuilder,
              private checkoutFormService: CheckoutFormService) {

  }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', Validators.required],
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: [''],
      }),
    })

    const startMonth = new Date().getMonth() + 1;

    this.checkoutFormService.getCreditCardMonths(startMonth).subscribe(
      data => this.creditCardMonths = data
    )

    this.checkoutFormService.getCreditCardYears().subscribe(
      data => this.creditCardYears = data
    )
    //    loadCountries:
    this.checkoutFormService.getCountries().subscribe(
      data => this.countries = data
    )
  }

  onSubmit() {
    console.log(this.checkoutFormGroup!.get('customer')?.value)
  }

  copyShippingAddressToBillingAddress(event: any) {
    if (event.target.checked) {
      this.checkoutFormGroup?.controls['billingAddress'].setValue(
        this.checkoutFormGroup?.controls['shippingAddress'].value
      );
      this.billingStates = this.shippingStates;
    } else {
      this.checkoutFormGroup?.controls['billingAddress'].reset();
      this.billingStates = [];
    }
  }

  handleMonthAndYear() {
    const creditCardFormGroup: FormGroup = this.checkoutFormGroup?.get('creditCard') as FormGroup;
    const currentYear = new Date().getFullYear();
    const selectedYear = +creditCardFormGroup.value.expirationYear;

    let startMonth: number;
    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }
    this.checkoutFormService.getCreditCardMonths(startMonth).subscribe(
      data => this.creditCardMonths = data
    )
  }

  handleCountryChange(formGroupName: string) {
    const formGroup = this.checkoutFormGroup?.get(formGroupName)!;

    this.checkoutFormService.getStates(formGroup.value.country.code).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
          this.shippingStates = data;
        } else {
          this.billingStates = data;
        }
        formGroup.get('state')!.setValue(data[0])
      }
    )
  }
}
