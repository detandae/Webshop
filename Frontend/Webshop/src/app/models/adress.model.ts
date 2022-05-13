
export class AdressModel {
    
    street : string;
    city:string;
    zip: number;
    country: string;


    constructor( )
     {

     }

     CopyFromObject( adress: any) {
        this.street=adress.street;
        this.city = adress.city;
        this.zip=adress.zip;
        this.country=adress.country;
    }
    toSingeString()
    {
        return  this.country+", "+ this.zip+" "+ this.city+", "+ this.street;
    }
}