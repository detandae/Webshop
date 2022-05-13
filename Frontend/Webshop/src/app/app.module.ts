import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule,Routes} from '@angular/router';
import {HashLocationStrategy, Location, LocationStrategy} from '@angular/common';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { ProductViewComponent } from './product-view/product-view.component';
import { ProductViewGridComponent } from './product-view-grid/product-view-grid.component';
import { ProductComponent } from './product/product.component';
import {DataManagerService} from './services/data-manager';
import { CartService } from 'app/services/cart-service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { Ng5SliderModule } from 'ng5-slider';
import {OnlyNumber} from './tools/OnlyNumber';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ThankyouComponent } from './thankyou/thankyou.component';
import { SigninComponent } from './signin/signin.component';
import { RegisterComponent } from './register/register.component';
import { UserService } from './services/user-service';
import { OrderService } from './services/oder-service';
import {AppConfig}from './settings/settings';
import { HttpClientModule } from '@angular/common/http';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import {Observable} from 'rxjs';
import { SuccessComponent } from './success/success.component';
import { FailureComponent } from './failure/failure.component';
import {SignalIRService} from  'app/services/signalIR-service';
import { PendigTransactionComponent } from './pendig-transaction/pendig-transaction.component';
import { PreviousOrdersComponent } from './previous-orders/previous-orders.component';
import { ProductEditorComponent } from './product-editor/product-editor.component';
import { ProductEditorListComponent } from './product-editor-list/product-editor-list.component';
import { QuestionDialogWindowComponent } from './question-dialog-window/question-dialog-window.component';
import { MatCardModule, MatButtonModule } from '@angular/material'
import {MatDialog, MatDialogRef,MatDialogModule} from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainPageComponent } from './main-page/main-page.component';
import * as $ from "jquery";

const routes: Routes = [
   // basic routes
   { path: '', redirectTo: 'shop', pathMatch: 'full' },
   { path: 'home', component: MainPageComponent },
   { path: 'shop', component: HomeComponent },
   { path: 'contact', component: ContactComponent },
   { path: 'product/:id', component: ProductComponent },
   { path: 'ShoppingCart', component: CartComponent },
   { path: 'Checkout', component: CheckoutComponent },
   { path: 'ThankYou', component: ThankyouComponent },
   { path: 'SignIn', component: SigninComponent },
   { path: 'Register', component: RegisterComponent },
   { path: 'Success', component: SuccessComponent },
   { path: 'Failure', component: FailureComponent },
   { path: 'PendingTransaction', component: PendigTransactionComponent },
   { path: 'PreviousOrders', component: PreviousOrdersComponent },
   { path: 'ProductEditor', component: ProductEditorComponent },
   { path: 'ProductEditorList', component: ProductEditorListComponent },
   { path: 'mainpage', component: MainPageComponent },
   
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ContactComponent,
    ProductViewComponent,
    ProductViewGridComponent,
    ProductComponent,
    SidebarComponent,
    OnlyNumber,
    CartComponent,
    CheckoutComponent,
    ThankyouComponent,
    SigninComponent,
    RegisterComponent,
    NavBarComponent,
    SuccessComponent,
    FailureComponent,
    PendigTransactionComponent,
    PreviousOrdersComponent,
    ProductEditorComponent,
    ProductEditorListComponent,
    QuestionDialogWindowComponent,
    MainPageComponent,
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    Ng5SliderModule,
    MatCardModule,
    MatDialogModule,
    MatButtonModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
  ],
  entryComponents: [
    QuestionDialogWindowComponent,
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: 'APP_URL', useValue: 'https://localhost:8080/' },
    { provide: 'PRODUCT_URL', useValue: 'api/Product/Filter' },
    { provide: 'REGISTER_URL', useValue: 'api/User/register' },
    { provide: 'AUTHENTICATE_URL', useValue: 'api/User/authenticate' },
    { provide: 'SAVE_PRODUCT_TO_CART_URL', useValue: 'api/ProductInCart' },
    { provide: 'GET_PRODUCTS_IN_CART', useValue: 'api/ProductInCart/GetUserCart' },
    { provide: 'DELETE_PRODUCTS_IN_CART', useValue: 'api/ProductInCart/DeleteProductInCart' },
    { provide: 'GET_USER_BY_NAME', useValue: 'api/User/GetUserByName' },
    { provide: 'CREATE_ORDER', useValue: 'api/Order/CreateOrder' },
    { provide: 'CREATE_PAYMENT', useValue: 'api/Order/CreatePayment' },
    { provide: 'UPDATE_PRODUCT_IN_CART', useValue: 'api/ProductInCart/UpdateProductInCart' },
    { provide: 'GET_ORDERS_FOR_USER', useValue: 'api/Order/GetOrdersForUser' },
    { provide: 'SUCCESS', useValue: 'api/Order/Success' },
    { provide: 'FAILURE', useValue: 'api/Order/Failure' },
    { provide: 'ADD_PRODUCT', useValue: 'api/Product/AddProduct' },
    { provide: 'UPLOAD_PRODUCT_IMAGE', useValue: 'api/Product/UploadProductImage' },
    { provide: 'GET_CATEGORYS', useValue: 'api/Product/categorys' },
    { provide: 'GET_PRODUCTS', useValue: 'api/Product/Products' },
    { provide: 'DELETE_PRODUCT', useValue: 'api/Product/DeleteProduct' },
    { provide: 'DELETE_PRODUCTS', useValue: 'api/Product/DeleteProducts' },
    { provide: 'DELETE_CATEGORY', useValue: 'api/Product/DeleteCategory' },
    { provide: 'ADD_CATEGORY', useValue: 'api/Product/AddCategory' },
    { provide: 'GET_HIGHLIGHTED_PRODUCTS', useValue: 'api/Product/GetHighlightedProducts' },
    { provide: 'GET_LATEST_PRODUCTS', useValue: 'api/Product/GetLatestProducts' },
    { provide: 'GET_ACTION_PRODUCTS', useValue: 'api/Product/GetActionProducts' },
    { provide: 'GET_RELATED_PRODUCTS', useValue: 'api/Product/GetRelatedProducts' },
    DataManagerService,
    CartService,
    OrderService,
    UserService,
    AppConfig,
    SignalIRService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
