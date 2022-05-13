import { Injectable } from '@angular/core';
import {UserModel} from '../models/user.model'
import {RegisterDtos} from '../Dtos/RegisterDtos'
import {UserDtos} from '../Dtos/UserDtos'
import {AuthenticationDtos} from '../Dtos/AuthenticationDtos'
import { HttpClient,HttpResponse,HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs';
import { of } from 'rxjs/observable/of';
import { Inject } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import {EventEmitter} from '@angular/core';
import { getCurrentDebugContext } from '@angular/core/src/view/services';
import { ErrorStatus } from 'app/Dtos/ErrorStatus';

@Injectable()
export class UserService {

    user:UserModel;
    usernameValidationRegex:RegExp=new RegExp("^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$");
    //at least 1 uppercase and one number
    passwordValidationRegex:RegExp=new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$");
    usernameValidated:boolean=false;
    passwordValidated:boolean=false;
    http:HttpClient;
    appURL:string;
    registerURl:string;
    authenticateURL:string;
    errorStatus:ErrorStatus;
    adminSignedIn:boolean=false;

    authenticationToken:string;
    authenticationExpire:string;
    GetUserByName:string;
    LogInEvent: EventEmitter<void> = new EventEmitter<void>();

    constructor(http:HttpClient,@Inject('APP_URL') appURL: string, @Inject('REGISTER_URL') registerURL: string,
                @Inject('AUTHENTICATE_URL') authenticateURL: string, @Inject('GET_USER_BY_NAME') GetUserByName: string)
    {
    this.user=new UserModel(); 
    this.appURL=appURL;
    this.http=http;
    this.registerURl=registerURL;
    this.authenticateURL=authenticateURL;
    this.GetUserByName=GetUserByName;
    this.GetCurrentUser();
    }

    async ResgisterUser()
    {
        let registerDtos=new RegisterDtos();
        registerDtos.CopyDataFromUser(this.user);
        const body = registerDtos;
        let url=this.appURL+this.registerURl; //szerver API URL kódja
        const response=await this.http.post<RegisterDtos>(url, body).toPromise();
        return response;
    }

    async AuthenticateUser(username:string,password:string)
    {

        const headers = { 'Authorization': 'Bearer my-token'}
        let autDtos=new AuthenticationDtos();
        autDtos.CopyDataFromUser(this.user);
        autDtos.username=username;
        autDtos.password=password;
        const body = autDtos;
        let url=this.appURL+this.authenticateURL;
        try{
        const response= await this.http.post<AuthenticationDtos>(url, body).toPromise();
        this.errorStatus= new ErrorStatus()
        if(response.role=="Admin")
        {
          this.adminSignedIn=true;
        }
        else
        {
          this.adminSignedIn=false;
        }
        this.errorStatus.status=null;
        return response;
        }
        catch(err)
        {
          this.errorStatus= new ErrorStatus()
          this.errorStatus.status="AuthenticationError";
        }
    }

     public async  GetCurrentUser()
    {
      if(this.IsUserLoggedIn())
      {
        let username=this.GetCurrentUserName();
        let userDto=new UserDtos();
        try{
        const data=await this.GetUserByNameFromServer(username);
        this.user.userName=username
        this.user.email=data.email;
        this.user.firstName=data.firstName;
        this.user.lastName=data.lastName;
        this.user.adress=data.adress;
        this.user.role=data.role;
        this.user.adress=data.adress;
        }
        catch(err)
        {
          console.log(err);
        }

    }
  }

    private async GetUserByNameFromServer(username:string)
    {
      let userDto=new UserDtos();
      userDto.username=username;
      let header = new HttpHeaders();
      const headers=this.createAuthorizationHeader(header);
      var options =  {
        headers: headers
     };
      const body = userDto;
      let url=this.appURL+this.GetUserByName;
      const response= this.http.post<UserDtos>(url, body,options).toPromise();
      return response;

    }

    GetCurrentUserName():string
    {
      if(this.user.userName!=null)
      {
        console.log(this.user.userName)
        return this.user.userName;
      }
      else
      {
      let username= localStorage.getItem("Username");
        return username;
      }
    }
    

    public SaveAuthorizationData(authenticationToken,authenticationExpire) {
    
      localStorage.setItem('authenticationToken', authenticationToken);
      localStorage.setItem("authenticationExpire", authenticationExpire);
      localStorage.setItem("Username", this.user.userName);
      this.LogInEvent.emit();
    }          

    public createAuthorizationHeader(headers: HttpHeaders) {
        let autToken=this.GetAuthorizationToken();
        headers=headers.append('Authorization', 'Bearer ' +autToken);
        return headers;   
    }

    public GetAuthorizationToken()
    {
      return localStorage.getItem("authenticationToken");
    }

    public Logout() {
      localStorage.removeItem("authenticationToken");
      localStorage.removeItem("authenticationExpire");
      localStorage.removeItem("Username");
      this.LogInEvent.emit();
  }
    
    public IsUserLoggedIn()
    {

      let expireDateString= localStorage.getItem("authenticationExpire");
      if(expireDateString==null){
        console.log("user signed in false");
        return false;}
      let expireDate =Date.parse(expireDateString);
      let curentDate=Date.now();
      if(expireDate-curentDate>0)
      {
        return  true;
      }
      else{
        false;
      }
    }

    validateUserName(userName:string):boolean
    {
      let validated=this.usernameValidationRegex.test(userName);
      return validated;
    }

    validatePassword(password:string):boolean
    {
      console.log(password)
      let validated=this.passwordValidationRegex.test(password);
      return validated;
    }
}