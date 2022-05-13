import { Injectable } from '@angular/core';
import * as signalR from "@aspnet/signalr";  // or from "@microsoft/signalr" if you are using a new library
import { Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {OrderService} from  'app/services/oder-service';
@Injectable()
export class SignalIRService {

    public data:string
    private hubConnection: signalR.HubConnection
    private connectionURL;
    public connectionId : string;
    constructor(@Inject('APP_URL') appURL: string,  private route: ActivatedRoute,private router: Router, private orderService:OrderService)
    {
     this.connectionURL=appURL+"Notification";
        
    }
    public async  startConnection () 
    {
      console.log("startConnection");
        this.hubConnection = new signalR.HubConnectionBuilder()
                            .withUrl(this.connectionURL)
                            .build();
     await this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .then(async () =>await this.getConnectionId())
      .catch(err => console.log('Error while starting connection: ' + err))
      this.hubConnection.serverTimeoutInMilliseconds = 1000000;
   }
  

   public  async getConnectionId ()  {
    await this.hubConnection.invoke('getconnectionid').then(
      (data) => {
        console.log(data);
          this.connectionId = data;
        }
    ); 
  }


  public addNotificationListener = () => {
    console.log("ConnectionID: "+this.connectionId);
    this.hubConnection.on('notificationdata', (data) => {
      this.data = data;
      console.log(data);
      let resp=this.orderService.CreateOrderAfterPayment();
      this.orderService.GetOrdersForUser();
      let value=this.router.navigate(['../Success']);

    });
  }
}