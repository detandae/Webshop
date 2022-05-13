import {UserModel} from '../models/user.model'

export class AuthenticationDtos {
    
    username : string;
    password:string;
    firstName: string;
    lastName: string;
    role: string;
    email: string;
    token:string;
    expire:string;

    constructor() {
    }

    CopyDataFromUser(user:UserModel)
    {
    this.username=user.userName;
    this.password=user.password;
    this.firstName=user.firstName;
    this.lastName=user.lastName;
    this.role="User";
    this.email=user.email;
    }
}