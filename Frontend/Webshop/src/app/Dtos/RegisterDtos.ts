import {UserModel} from '../models/user.model'

export class RegisterDtos {
    
    Username : string;
    Password:string;
    FirstName: string;
    LastName: string;
    Role: string;
    Email: string;
    Street: string;
    City: string;
    Zip: number;
    Country: string

    constructor() {
    }

    CopyDataFromUser(user:UserModel)
    {
    this.Username=user.userName;
    this.Password=user.password;
    this.FirstName=user.firstName;
    this.LastName=user.lastName;
    this.Role="User";
    this.Email=user.email;
    this.Street=user.adress.street;
    this.City=user.adress.city;
    this.Country=user.adress.country;
    this.Zip=user.adress.zip;
    }
    
  }