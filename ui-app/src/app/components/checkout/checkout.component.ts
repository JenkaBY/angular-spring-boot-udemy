import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CheckoutFormService} from "../../service/checkout-form.service";
import {Country} from "../../common/country";
import {State} from "../../common/state";
import {CustomFormValidators} from "../../validators/custom-form-validators";
import {CartService} from "../../service/cart.service";

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
              private checkoutFormService: CheckoutFormService,
              private cartService: CartService,) {

  }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',
          [Validators.required, Validators.minLength(2), CustomFormValidators.notOnlyWhitespace]),
        lastName: new FormControl('',
          [Validators.required, Validators.minLength(2), CustomFormValidators.notOnlyWhitespace]),
        email: new FormControl('',
          [Validators.required, Validators.email, CustomFormValidators.notOnlyWhitespace]),
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, CustomFormValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, CustomFormValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(5), CustomFormValidators.notOnlyWhitespace]),
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, CustomFormValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, CustomFormValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(5), CustomFormValidators.notOnlyWhitespace]),
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(5), CustomFormValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: new FormControl('', [Validators.required]),
        expirationYear: new FormControl('', [Validators.required]),
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

    this.reviewCartDetails();
  }

  onSubmit() {
    console.log(this.checkoutFormGroup!.get('customer')?.value)
    if (this.checkoutFormGroup!.invalid) {
      this.checkoutFormGroup?.markAllAsTouched();
    }
  }

  copyShippingAddressToBillingAddress(event: any) {
    if (event.target.checked) {
      this.checkoutFormGroup?.controls['billingAddress']
        .setValue(
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

  get firstName() {
    return this.checkoutFormGroup?.get('customer.firstName')!
  }

  get lastName() {
    return this.checkoutFormGroup?.get('customer.lastName')!
  }

  get email() {
    return this.checkoutFormGroup?.get('customer.email')!
  }

  get shippingAddressCity() {
    return this.checkoutFormGroup?.get('shippingAddress.city')!
  }

  get shippingAddressState() {
    return this.checkoutFormGroup?.get('shippingAddress.state')!
  }

  get shippingAddressCountry() {
    return this.checkoutFormGroup?.get('shippingAddress.country')!
  }

  get shippingAddressStreet() {
    return this.checkoutFormGroup?.get('shippingAddress.street')!
  }

  get shippingAddressZipCode() {
    return this.checkoutFormGroup?.get('shippingAddress.zipCode')!
  }

  get billingAddressCity() {
    return this.checkoutFormGroup?.get('billingAddress.city')!
  }

  get billingAddressState() {
    return this.checkoutFormGroup?.get('billingAddress.state')!
  }

  get billingAddressCountry() {
    return this.checkoutFormGroup?.get('billingAddress.country')!
  }

  get billingAddressStreet() {
    return this.checkoutFormGroup?.get('billingAddress.street')!
  }

  get billingAddressZipCode() {
    return this.checkoutFormGroup?.get('billingAddress.zipCode')!
  }

  get creditCardType() {
    return this.checkoutFormGroup?.get('creditCard.cardType')!
  }

  get creditCardNameOnCard() {
    return this.checkoutFormGroup?.get('creditCard.nameOnCard')!
  }

  get creditCardCardNumber() {
    return this.checkoutFormGroup?.get('creditCard.cardNumber')!
  }

  get creditCardSecurityCode() {
    return this.checkoutFormGroup?.get('creditCard.securityCode')!
  }

  get creditCardExpirationMonth() {
    return this.checkoutFormGroup?.get('creditCard.expirationMonth')!
  }

  get creditCardExpirationYear() {
    return this.checkoutFormGroup?.get('creditCard.expirationYear')!
  }

  private reviewCartDetails() {
    this.cartService.totalQuantity.subscribe(data => {
      this.totalQuantity = data
    })

    this.cartService.totalPrice.subscribe(data => { this.totalPrice = data })
  }
}
