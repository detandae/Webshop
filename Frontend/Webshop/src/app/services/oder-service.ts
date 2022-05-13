import { Injectable } from '@angular/core';
import {ProductInCart} from '../models/productInCart.model'
import {ProductInCartRequestDtos} from 'app/Dtos/ProductInCartRequestDtos';
import {UserService} from  'app/services/user-service';
import { Inject } from '@angular/core';
import {Router}  from '@angular/router';
import { HttpClient,HttpResponse,HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs/observable/of';
import {Observable} from 'rxjs';
import { OrderDtos } from 'app/Dtos/OrderDtos';
import { ErrorStatus } from 'app/Dtos/ErrorStatus';
import { CartService } from 'app/services/cart-service';
import { PaymentDtos } from 'app/Dtos/PaymentDtos';
import {OrderModel} from '../models/order.model';
import { UserDtos } from 'app/Dtos/UserDtos';



@Injectable()
export class OrderService {
    orders:OrderModel[]=[];
    ordersInitialized:boolean=false;
    curentOder:OrderDtos;
    public errorMessage:string
    appURL:string;
    creatOrderURL:string;
    createPaymentURL:string;
    previousOrdersURL:string;
    constructor(private http:HttpClient,private router: Router, private userService:UserService, private cartService:CartService,
                @Inject('APP_URL') appURL: string,   @Inject('GET_ORDERS_FOR_USER') previousOrdersURL,
                @Inject('CREATE_ORDER') creatOrderURL: string,   @Inject('CREATE_PAYMENT') createPaymentURL: string )
    {
        this.appURL=appURL;
        this.creatOrderURL=creatOrderURL;
        this.createPaymentURL=createPaymentURL;
        this.previousOrdersURL=previousOrdersURL;
    }
    async RegisterUser(order:OrderDtos)
    {
        if(this.userService.IsUserLoggedIn()==false)
        {
            this.userService.user=order.user;
            try{
                console.log("Register");
                const RegisterResp=await this.userService.ResgisterUser();
            }
            catch(err)
            {
                console.log("error");
                console.log(err);
                if(err.status=400)
                {
                    let errorstatus= new ErrorStatus()
                    errorstatus.status="RegisterError";
                    return errorstatus;
                }
            }
            try{
                const AutResp=await this.userService.AuthenticateUser(order.user.userName,order.user.password);
                if(AutResp)
                {
                this.userService.SaveAuthorizationData(AutResp.token,AutResp.expire);
                }
                
                for(let i=0;i<this.cartService.productsInCart.length;i++)
                {
                  
                   const resp=await this.cartService.SaveProductInCartToServer(this.cartService.productsInCart[i]);
                   this.cartService.productsInCart[i].id=resp.id;
                }
                order.productincarts=this.cartService.productsInCart;
            }
            catch(err)
            {
                console.log("error");
                console.log(err);
                if(err.status=400)
                {
                    let errorstatus= new ErrorStatus()
                    errorstatus.status="SomeError";
                    return errorstatus;
                }
            }
        }
        let errorstatus= new ErrorStatus()
        errorstatus.status="Empty";
        return errorstatus;
        
    }

    async CreateOrderAfterPayment()
    {
        try{
            if(this.curentOder!=null)
            {
            const resp=await this.SaveOrderInInServer(this.curentOder);
            let errorstatus= new ErrorStatus()
            errorstatus.status="OK";
            return errorstatus;
            }
        }
        catch(err){
            console.log(err);
            let errorstatus= new ErrorStatus()
            errorstatus.status="Ordererror";
            return errorstatus;
        }
    }

    async CreateOrder(order:OrderDtos)
    {
        console.log(order.adress.street);
        console.log(order.adress.city);
        console.log(order.adress.zip);
        for(let i=0;i> order.productincarts.length;i++)
        {
            console.log(order.productincarts[i].id);
        }
        if(this.userService.IsUserLoggedIn()==true)
        {
            console.log("User logged in");
            try{
            const resp=await this.SaveOrderInInServer(order);
            }
            catch(err){
                console.log(err);
                let errorstatus= new ErrorStatus()
                errorstatus.status="Ordererror";
                return errorstatus;
            }
        }
        else
        {
            this.userService.user=order.user;
            try{
                console.log("Register");
                const RegisterResp=await this.userService.ResgisterUser();
            }
            catch(err)
            {
                console.log("error");
                console.log(err);
                if(err.status=400)
                {
                    let errorstatus= new ErrorStatus()
                    errorstatus.status="RegisterError";
                    return errorstatus;
                }
            }
            try{
                const AutResp=await this.userService.AuthenticateUser(order.user.userName,order.user.password);
                if(AutResp)
                {
                this.userService.SaveAuthorizationData(AutResp.token,AutResp.expire);
                }
                
                for(let i=0;i<this.cartService.productsInCart.length;i++)
                {
                  
                   const resp=await this.cartService.SaveProductInCartToServer(this.cartService.productsInCart[i]);
                   this.cartService.productsInCart[i].id=resp.id;
                }
                order.productincarts=this.cartService.productsInCart;
              
                const orderResp=await this.SaveOrderInInServer(order);
            }
            catch(err)
            {
                console.log("error");
                console.log(err);
                if(err.status=400)
                {
                    let errorstatus= new ErrorStatus()
                    errorstatus.status="SomeError";
                    return errorstatus;
                }
            }
      
        }
        let errorstatus= new ErrorStatus()
        errorstatus.status="OK";
        return errorstatus;
    }
    public  async CreatePayment(paymentDtos)
    {
        try
        {
            console.log("paymentDtos.connectionId: "+ paymentDtos.connectionId);
            const PaymentResp= await  this.CreatePaymentInServer(paymentDtos);
            let link=PaymentResp.link;
            console.log(link);
            window.open( link, "_blank");

        }
        catch(err)
        {
            console.log(err);
        }
    }

    public async GetOrdersForUser()
    {
        if(this.userService.IsUserLoggedIn())
        {
          let username=this.userService.GetCurrentUserName();
          let userDto=new UserDtos();
          userDto.username=username;
          try{
            this.orders=await this.GetOrdersForUserFromServer(userDto);
            }
            catch(err){
                console.log(err);
            }
        }
          
    }

    private async GetOrdersForUserFromServer(userDto:UserDtos)
    {
        let header = new HttpHeaders();
        const headers=this.userService.createAuthorizationHeader(header);
        var options =  {
          headers: headers
        };
        console.log(headers);
        const body = userDto;
        let url=this.appURL+this.previousOrdersURL;
        const resp=await this.http.post<OrderModel[]>(url, body,options).toPromise();
        return resp;
    }


    private async SaveOrderInInServer(order:OrderDtos)
    {
      let header = new HttpHeaders();
      const headers=this.userService.createAuthorizationHeader(header);
      var options =  {
        headers: headers
    };
      console.log(headers);
      const body = order;
      let url=this.appURL+this.creatOrderURL;
      const resp=await this.http.post<OrderDtos>(url, body,options).toPromise();
      return resp;

    }


    private async CreatePaymentInServer(paymentDtos:PaymentDtos)
    {
        
        console.log(paymentDtos.totalPrice);
        console.log(paymentDtos.connectionId);
        console.log(JSON.stringify(paymentDtos));
        let header = new HttpHeaders();
        const headers=this.userService.createAuthorizationHeader(header);
        var options =  {
          headers: headers
         };
        console.log(headers);
        const body = paymentDtos;
        let url=this.appURL+this.createPaymentURL;
        const resp=await this.http.post<any>(url, body).toPromise();
        return resp;
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
}