import { Injectable } from '@angular/core';
import {ProductInCart} from '../models/productInCart.model'
import {ProductInCartRequestDtos} from 'app/Dtos/ProductInCartRequestDtos';
import {UserService} from  'app/services/user-service';
import { ProductInCartDtos } from 'app/Dtos/ProductInCartDtos';
import { HttpClient,HttpResponse,HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs/observable/of';
import { Inject } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import {Observable} from 'rxjs';
import { UserDtos } from 'app/Dtos/UserDtos';
import { ProductModel } from 'app/models/product.model';
import { TransitiveCompileNgModuleMetadata } from '@angular/compiler';

@Injectable()
export class CartService {

    productsInCart : ProductInCart[]=[];
    isSignedIn:boolean
    userService:UserService
    private subscription: any;
    appURL:string;
    SaveProductToCartURL:string;
    GetProductsInCartURL:string;
    UpdateProductInCartURL:string
    DeleteProductInCartURL:string;
    http:HttpClient;

    constructor(userService:UserService,http:HttpClient,@Inject('APP_URL') appURL: string, @Inject('SAVE_PRODUCT_TO_CART_URL') SaveProductToCartURL: string,
                @Inject('GET_PRODUCTS_IN_CART') GetProductsInCartURL: string, @Inject('UPDATE_PRODUCT_IN_CART') UpdateProductInCartURL,
                @Inject('DELETE_PRODUCTS_IN_CART') DeleteProductInCartURL)
    {
      this.appURL=appURL;
      this.SaveProductToCartURL=SaveProductToCartURL;
      this.GetProductsInCartURL=GetProductsInCartURL;
      this.userService=userService;
      this.UpdateProductInCartURL=UpdateProductInCartURL;
      this.DeleteProductInCartURL=DeleteProductInCartURL;
      this.http=http;
      this.isSignedIn=this.userService.IsUserLoggedIn();
      this.subscription=this.userService.LogInEvent.subscribe(
        ()=>
        {
          this.isSignedIn=this.userService.IsUserLoggedIn();
       });
    }
  
    public async GetProductsInCartFromServer()
    {
      let userName=this.userService.GetCurrentUserName();
      console.log(userName);
      var reqHeader = new HttpHeaders({ 
        'Content-Type': 'application/json'
      });
      const headers=this.userService.createAuthorizationHeader(reqHeader);
      var options =  {
        headers: headers
      };
      let userDtos=new UserDtos();
      userDtos.username=userName;
      console.log(headers);
      const body = userDtos;
      let url=this.appURL+this.GetProductsInCartURL;
      const resp= await this.http.post<ProductInCart[]>(url, body,options).toPromise();
      return resp;


    }

   async addProductToCart(productInCart:ProductInCart)
    {

      this.productsInCart.push(productInCart);
      console.log("proudcts in cart size: "+ this.productsInCart.length);
      if(this.userService.IsUserLoggedIn()==true)
      {
        try{
            const data=await this.SaveProductInCartToServer(productInCart);
            console.log(data);
        }
        catch(err)
        {
          console.log(err);
        }
      }
    }

    public  async SaveProductInCartToServer(productInCart:ProductInCart)
    {
      let userName=this.userService.GetCurrentUserName();
      let productInCartRequestDtos=new ProductInCartRequestDtos();
      console.log(userName);
      productInCartRequestDtos.username=userName;
      productInCartRequestDtos.CopyFromProductInCart(productInCart);
      let header = new HttpHeaders();
      const headers=this.userService.createAuthorizationHeader(header);
      var options =  {
        headers: headers
    };
      console.log(headers);
      const body = productInCartRequestDtos;
      let url=this.appURL+this.SaveProductToCartURL;
      const resp= await this.http.post<ProductInCart>(url, body,options).toPromise();
      return resp;

    }

    public async UpdateProductInCart(productInCart:ProductInCart)
    {
        if(this.userService.IsUserLoggedIn)
        {
          try{
          const resp=await this.UpdateProductInCartInServer(productInCart);
          console.log(resp);
          }
          catch(err)
          {
            console.log(err);
          }

        }
    }

    private async  UpdateProductInCartInServer(productInCart:ProductInCart)
    {
      let userName=this.userService.GetCurrentUserName();
      let productInCartRequestDtos=new ProductInCartRequestDtos();
      console.log(userName);
      productInCartRequestDtos.username=userName;
      productInCartRequestDtos.CopyFromProductInCart(productInCart);
      let header = new HttpHeaders();
      const headers=this.userService.createAuthorizationHeader(header);
      var options =  {
        headers: headers
       };
      console.log(headers);
      const body = productInCartRequestDtos;
      let url=this.appURL+this.UpdateProductInCartURL;
      const resp= this.http.post<ProductInCart>(url, body,options).toPromise();
    }

    public async DeleteProductInCart(productInCart:ProductInCart)
    {
      if(this.userService.IsUserLoggedIn)
      {
        try
        {
          const resp=await this.DeleteProductInCartInServer(productInCart);
          console.log(resp);
        }
        catch(err)
        {
          console.log(err);
        }
      }
    }

    private async DeleteProductInCartInServer(productInCart:ProductInCart)
    {
      let userName=this.userService.GetCurrentUserName();
      let productInCartRequestDtos=new ProductInCartRequestDtos();
      console.log(userName);
      productInCartRequestDtos.username=userName;
      productInCartRequestDtos.CopyFromProductInCart(productInCart);
      let header = new HttpHeaders();
      const headers=this.userService.createAuthorizationHeader(header);
      var options =  {
        headers: headers
    };
      console.log(headers);
      const body = productInCartRequestDtos;
      let url=this.appURL+this.DeleteProductInCartURL;
      const resp=await this.http.post<ProductInCart>(url, body,options).toPromise();
    

    }

    private handleError<T>(operation = 'operation', result?: T)
    {
      return (error: any): Observable<T> => {
        // TODO: better job of transforming error for user consumption
       console.log(`${operation} failed: ${error.message}`);
    
        // Let the app keep running by returning an empty result.
      return of(result as T); 
      
      }
    }
  
    getProductsInCart():ProductInCart[] 
    {
      
      return this.productsInCart;
    }

    getProductInCart(id):ProductInCart {
         let productInCart:ProductInCart= this.productsInCart.filter(x => x.product.id == id)[0];
         console.log("get productsInCart ID"+productInCart.product.id)
        return productInCart;
    }

    clearProducts() 
    {
      this.productsInCart = [];
    }

}