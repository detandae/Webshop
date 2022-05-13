import { Component, OnInit } from '@angular/core';
import {UserService} from  'app/services/user-service';
import { Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  isSignedIn:boolean
  isSignedInAdmin: boolean
  userService:UserService
  private subscription: any;
  constructor(userService:UserService)
    {
      this.userService=userService;
      this.isSignedIn=this.userService.IsUserLoggedIn();
    }

    ngOnInit() {
    
      this.subscription=this.userService.LogInEvent.subscribe(
        ()=>
        {
          this.isSignedIn=this.userService.IsUserLoggedIn();
          this.isSignedInAdmin=this.userService.adminSignedIn;
          console.log(this.isSignedIn);
       });
    }
      
    
  OnLogOutClicked(category)
  {
    this.userService.Logout();

  }

}
