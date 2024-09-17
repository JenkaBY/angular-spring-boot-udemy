import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CheckoutFormService} from "../../service/checkout-form.service";
import {Country} from "../../common/country";
import {State} from "../../common/state";
import {CustomFormValidators} from "../../validators/custom-form-validators";
import {CartService} from "../../service/cart.service";
import {CheckoutService} from "../../service/checkout.service";
import {Router} from "@angular/router";
import {Order} from "../../common/order";
import {OrderItem} from "../../common/order-item";
import {Address} from "../../common/address";
import {Customer} from "../../common/customer";
import {Purchase} from "../../common/purchase";
import {environment} from "../../../environments/environment";
import {PaymentInfo} from "../../common/payment-info";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  isSubmitBtnDisabled = false;
  checkoutFormGroup?: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;
  creditCardMonths?: number[] = []
  creditCardYears?: number[] = []
  countries: Country[] = [];
  shippingStates: State[] = [];
  billingStates: State[] = [];

  storage: Storage = sessionStorage;

  stripe = Stripe(environment.stripePublishableKey)
  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any = "";


  constructor(private formBuilder: FormBuilder,
              private checkoutFormService: CheckoutFormService,
              private cartService: CartService,
              private checkoutService: CheckoutService,
              private route: Router,) {

  }

  ngOnInit(): void {
    this.setupStripePaymentForm();
    const email = JSON.parse(this.storage.getItem('userEmail') as string) || '';

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',
          [Validators.required, Validators.minLength(2), CustomFormValidators.notOnlyWhitespace]),
        lastName: new FormControl('',
          [Validators.required, Validators.minLength(2), CustomFormValidators.notOnlyWhitespace]),
        email: new FormControl(email,
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
      })
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

    if (this.checkoutFormGroup!.invalid) {
      this.checkoutFormGroup?.markAllAsTouched();
      return;
    }
    this.isSubmitBtnDisabled = true;

    this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe(
      (intentResponse) => {
        const purchase = this.collectPurchase();
        this.paymentInfo.amount = Math.round(this.totalPrice * 100);
        this.paymentInfo.currency = 'USD';
        this.paymentInfo.receiptEmail = purchase.customer.email;
          this.stripe.confirmCardPayment(intentResponse.client_secret, {
            payment_method: {
              card: this.cardElement,
              billing_details: {
                email: purchase.customer.email,
                name: `${purchase.customer.firstName} ${purchase.customer.lastName}`,
                address: {
                  line1: purchase.billingAddress.street,
                  city: purchase.billingAddress.city,
                  state: purchase.billingAddress.state,
                  postal_code: purchase.billingAddress.zipCode,
                  country: this.billingAddressCountry.value.code
                }
              }
            },

          },
          {
            handleActions: false
          }).then((result: any) => {
          if (result.error) {
            alert(`There was an error ${result.error.message}`);
            this.isSubmitBtnDisabled = false;
            return
          }
          {
            this.placeOrder();

          }
        })
      }
    )
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

  private reviewCartDetails() {
    this.cartService.totalQuantity.subscribe(data => {
      this.totalQuantity = data
    })

    this.cartService.totalPrice.subscribe(data => {
      this.totalPrice = data
    })
  }

  private collectPurchase(): Purchase {
    const order = new Order(this.totalQuantity, this.totalPrice);
    const orderItems: OrderItem[] = this.cartService.cartItems.map(item => new OrderItem(item));
    const shippingAddress = this.extractAddress('shippingAddress');
    const billingAddress = this.extractAddress('billingAddress');
    const customer: Customer = this.checkoutFormGroup?.controls['customer'].value;

    return new Purchase(
      customer, shippingAddress, billingAddress, order, orderItems,
    )
  }

  private placeOrder() {
    const purchase = this.collectPurchase();

    console.log(`purchase: ${JSON.stringify(purchase)}`)

    this.checkoutService.placeOrder(purchase).subscribe({
      next: data => {
        alert(`Your order has been received. Order trackingNumber ${data.orderTrackingNumber}`)

        this.resetCart();
        this.isSubmitBtnDisabled = false;
      },
      error: response => {
        alert(`There was an error: ${response.message}`);
        this.isSubmitBtnDisabled = false;
      },
    });
  }


  private extractAddress(formGroupName: string): Address {
    const address: Address = this.checkoutFormGroup?.controls[formGroupName].value as Address;
    const state: State = JSON.parse(JSON.stringify(address.state));
    const country: Country = JSON.parse(JSON.stringify(address.country));
    address.state = state.name
    address.country = country.name
    return address;
  }

  private resetCart() {
    this.checkoutFormGroup?.reset();
    this.cartService.resetCart();

    this.route.navigate(['/products'])
  }

  private setupStripePaymentForm() {
    const elements = this.stripe.elements();

    this.cardElement = elements.create('card', {hidePostalCode: true});

    this.cardElement.mount('#card-element');

    this.cardElement.on('change', (event: any) => {

      this.displayError = document.getElementById('card-errors');

      if (event.complete) {
        this.displayError.textContent = '';
      } else if (event.error) {
        this.displayError.textContent = event.error.message;
      }
    })
  }
}
