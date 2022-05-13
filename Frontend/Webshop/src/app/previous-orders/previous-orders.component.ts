import { Component, OnInit } from '@angular/core';
import {UserService} from  'app/services/user-service';
import {OrderService} from  'app/services/oder-service';
import { OrderModel } from 'app/models/order.model';
import { AdressModel } from 'app/models/adress.model';
import {ProductModel} from '../models/product.model'
import { Inject } from '@angular/core';

@Component({
  selector: 'app-previous-orders',
  templateUrl: './previous-orders.component.html',
  styleUrls: ['./previous-orders.component.css']
})
export class PreviousOrdersComponent implements OnInit {

  orders:OrderModel[];
  showOrders:boolean[];
  appURL:string;
  constructor(private userService:UserService,private orderService:OrderService,
              @Inject('APP_URL') appURL: string) { 
                this.appURL=appURL

  }
  public ReturnPaymentMethod(paymentMethid:number):string
  {
      if(paymentMethid==0)
      {
          return "Cash";
      }
      if(paymentMethid==1)
      {
          return "PayPal";
      }
  }
  public SingleStringAdress(adress:AdressModel)
  {
      return  adress.country+", "+ adress.zip+" "+ adress.city+", "+ adress.street;
  }
  public buttonShowClicked(i)
  {
    console.log(i);
    this.showOrders[i]=!this.showOrders[i];
  }

  getRoundedPrice(product:ProductModel)
  {
    if(product.action>0)
    {
      return(product.basePrice-product.action*product.basePrice).toFixed(2);
    }
    return(product.basePrice).toFixed(2); 
    
  }
  public GetImageURL(product:ProductModel):string
  {
    if(product!=null)
    {
      console.log(product.imageURL);
    return this.appURL+product.imageURL;
    }
    return null;
  }

  ngOnInit() {
    if(this.userService.IsUserLoggedIn()==true)
    {
      if(this.orderService.ordersInitialized==false)
      {
        try
        {
          this.orderService.GetOrdersForUser();
          console.log("response: "+JSON.stringify(this.orderService.orders));
          this.orders=this.orderService.orders;
          console.log("response: "+JSON.stringify(this.orders));
          if(this.orders.length>0)
          {
            console.log("true");
            this.orderService.ordersInitialized=true;
            this.showOrders=new Array<boolean>(this.orders.length);
            for(let i=0;i<this.orders.length;i++)
            {
              this.showOrders[i]=false;
              console.log("time: "+this.orders[i].orderTime);
              console.log("method:" +this.ReturnPaymentMethod(this.orders[i].paymentMethod));
              console.log("adress:" +this.SingleStringAdress(this.orders[i].adress));
              console.log("productin cart:" +JSON.stringify(this.orders[i].productincarts));
            }
         }
          
        }
        catch(err)
        {
          console.log(err);
      }
    }
    else{
      this.orders=this.orderService.orders;
      if(this.orders.length>0)
      {
        this.orderService.ordersInitialized=true;
        this.showOrders=new Array<boolean>(this.orders.length);
        for(let i=0;i<this.orders.length;i++)
        {
          this.showOrders[i]=false;
        }
     }
      
    }
  }
  else
  {
  
  }
  }

}
