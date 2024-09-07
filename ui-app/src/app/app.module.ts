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

const routes: Routes = [
  {path: 'category/:id', component: ProductListComponent},
  {path: 'category', component: ProductListComponent},
  {path: 'products/:id', component: ProductDetailsComponent},
  {path: 'products', component: ProductListComponent},
  {path: 'search/:keyword', component: ProductListComponent},
  {path: '', redirectTo: '/products', pathMatch: 'full'},
  {path: '**', redirectTo: '/products', pathMatch: 'full'},
]

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule
  ],
  providers: [ProductService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
