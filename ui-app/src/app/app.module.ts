import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {ProductService} from "./service/product.service";
import {RouterModule, Routes} from "@angular/router";
import {ProductListComponent} from './components/product-list/product-list.component';
import {SearchComponent} from './components/search/search.component';
import {ProductDetailsComponent} from './components/product-details/product-details.component';
import {ProductCategoryMenuComponent} from "./components/product-category-menu/product-category-menu.component";
import {NgbPaginationModule} from "@ng-bootstrap/ng-bootstrap";
import {CartStatusComponent} from './components/cart-status/cart-status.component';
import {CartDetailsComponent} from './components/cart-details/cart-details.component';
import {CheckoutComponent} from './components/checkout/checkout.component';
import {ReactiveFormsModule} from "@angular/forms";
import {LoginComponent} from './components/login/login.component';
import {LoginStatusComponent} from './components/login-status/login-status.component';
import {OKTA_CONFIG, OktaAuthModule, OktaCallbackComponent} from "@okta/okta-angular";
import appConfig from "./components/config/app-config";
import {OktaAuth} from "@okta/okta-auth-js";

const oktaConfig = appConfig.oidc;
const oktaAuth = new OktaAuth(oktaConfig);

const routes: Routes = [
  {path: 'login/callback', component: OktaCallbackComponent},
  {path: 'login', component: LoginComponent},

  {path: 'category/:id', component: ProductListComponent},
  {path: 'category', component: ProductListComponent},
  {path: 'products/:id', component: ProductDetailsComponent},
  {path: 'products', component: ProductListComponent},
  {path: 'search/:keyword', component: ProductListComponent},
  {path: 'cart-details', component: CartDetailsComponent},
  {path: 'checkout', component: CheckoutComponent},
  {path: '', redirectTo: '/products', pathMatch: 'full'},
  {path: '**', redirectTo: '/products', pathMatch: 'full'},
]

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent,
    LoginComponent,
    LoginStatusComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    NgbPaginationModule,
    ReactiveFormsModule,
    OktaAuthModule
  ],
  providers: [
    ProductService,
    {provide: OKTA_CONFIG, useValue: {oktaAuth}},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
