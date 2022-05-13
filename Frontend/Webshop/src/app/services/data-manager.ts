import { Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import {ProductModel} from '../models/product.model'
import {CategoryModel} from '../models/category.model'
import {EventEmitter} from '@angular/core';
import {ProductFilterDtos} from '../Dtos/ProductFilterDtos'
import {Observable} from 'rxjs';
import {UserService} from  'app/services/user-service';
import { HttpClient,HttpResponse,HttpHeaders } from '@angular/common/http';
import { ErrorStatus } from 'app/Dtos/ErrorStatus';
import { ProductDictionary } from 'app/models/ProductDictionary'; 
@Injectable()
export class DataManagerService {
    products : ProductModel[];
    categorys: CategoryModel[];
    productsToShow =[];
    SomeText: string;
    productNumber:number=0;
    currentproduct:ProductModel;
    filter:ProductFilterDtos;
    private http:HttpClient;
    private uploadImageURL;
    private productURL;
    private appURL;
    private addProductURL;
    private categorysURL;
    private getProductsURL;
    private deleteProductURL;
    private deleteProductsURL;
    private deleteCategoryURL;
    private addCategoryURL;
    private getHighlightedProductsURL;
    private getLatestProductsURL;
    private getActionProductsURL;
    private getRelatedProductsURL;
    RefreshEvent: EventEmitter<void> = new EventEmitter<void>();
    ProductAdded: EventEmitter<void> = new EventEmitter<void>();


    constructor( private userService:UserService,http:HttpClient,@Inject('PRODUCT_URL') productURL: string,
                @Inject('APP_URL') appURL: string,@Inject('ADD_PRODUCT') addProductURL,@Inject('UPLOAD_PRODUCT_IMAGE') uploadImageURL,
                @Inject('GET_CATEGORYS') categorysURL,@Inject('GET_PRODUCTS') getProductsURL: string,
                @Inject('DELETE_PRODUCT') deleteProductURL,@Inject('DELETE_PRODUCTS') deleteProductsURL: string,
                @Inject('DELETE_CATEGORY') deleteCategoryURL,@Inject('ADD_CATEGORY') addCategoryURL: string,
                @Inject('GET_HIGHLIGHTED_PRODUCTS') getHighlightedProductsURL,@Inject('GET_LATEST_PRODUCTS') getLatestProductsURL: string,
                @Inject('GET_ACTION_PRODUCTS') getActionProductsURL,  @Inject('GET_RELATED_PRODUCTS') getRelatedProductsURL )
    {
      this.products=[];
      this.http=http;
      this.productURL=productURL;
      this.appURL=appURL;
      this.productsToShow=this.products;
      this.addProductURL=addProductURL;
      this.uploadImageURL=uploadImageURL;
      this.categorysURL=categorysURL;
      this.getProductsURL=getProductsURL;
      this.deleteProductURL=deleteProductURL
      this.deleteProductsURL=deleteProductsURL;
      this.deleteCategoryURL=deleteCategoryURL;
      this.addCategoryURL=addCategoryURL;
      this.getHighlightedProductsURL=getHighlightedProductsURL;
      this.getLatestProductsURL=getLatestProductsURL;
      this.getActionProductsURL=getActionProductsURL;
      this.getRelatedProductsURL=getRelatedProductsURL;
    }

    async GetRelatedProducts(category:CategoryModel):Promise<ProductModel[]>
    {
      let resp =await this.GetRelatedProductsFromServer(category);
      return resp;
    }

    async GetRelatedProductsFromServer(category:CategoryModel)
    {
      let header = new HttpHeaders();
      let url=this.appURL+this.getRelatedProductsURL;
      console.log(url);
      let body=category
      const resp=await this.http.post<ProductModel[]>(url, body).toPromise();
      return resp;

    }

    async GetActionProducts():Promise<Map<String, ProductModel[]>>
    {
      console.log("get products")
      let products=await this.GetActionProductsFromServer();
      console.log(JSON.stringify(products));
      return products;
    }

    private async GetActionProductsFromServer()
    {
      let url=this.appURL+this.getActionProductsURL;
      console.log(url);
      const resp=await this.http.get<Map<String, ProductModel[]>>(url).toPromise();
      return resp;
    }

    async GetLatestProducts():Promise<Map<String, ProductModel[]>>
    {
      console.log("get products")
      let products=await this.GetLatestProductsFormServer();
      console.log(JSON.stringify(products));
      return products;
    }

    private async GetLatestProductsFormServer()
    {
      let url=this.appURL+this.getLatestProductsURL;
      console.log(url);
      const resp=await this.http.get<Map<String, ProductModel[]>>(url).toPromise();
      return resp;
    }


    async GetHighlightedProducts():Promise<Map<String, ProductModel[]>>
    {
      let products=await this.GetHighlightedProductsFormServer();
      return products;
    }

    private async GetHighlightedProductsFormServer()
    {
      let url=this.appURL+this.getHighlightedProductsURL;
      console.log(url);
      const resp=await this.http.get<Map<String, ProductModel[]>>(url).toPromise();
      return resp;
    }

    public async AddCategory(category:CategoryModel):Promise<ErrorStatus>
    {
      try{
      let resp=await this.AddCategoryToServer(category);
      let errorstatus= new ErrorStatus()
      errorstatus.status="OK";
      return errorstatus;
      }
      catch(err)
      {
        if(err.status=400)
        {
            let errorstatus= new ErrorStatus()
            errorstatus.status="CategoryAlreadyExists";
            return errorstatus;
        }
      }
    }

    private async AddCategoryToServer(category:CategoryModel)
    {
      let header = new HttpHeaders();
      const headers=this.userService.createAuthorizationHeader(header);
      var options =  {
        headers: headers
      };
      console.log(headers);
      let url=this.appURL+this.addCategoryURL;
      console.log(url);
      let body=category
      const resp=await this.http.post<any>(url, body,options).toPromise();
      return resp;
    }

    public async DeleteCategory(category:CategoryModel[])
    {
      let resp=this.DeleteCategoryFromServer(category);
    }

    private async DeleteCategoryFromServer(category:CategoryModel[])
    {
      let header = new HttpHeaders();
      const headers=this.userService.createAuthorizationHeader(header);
      var options =  {
        headers: headers
      };
      console.log(headers);
      let url=this.appURL+this.deleteCategoryURL;
      console.log(url);
      let body=category
      const resp=await this.http.post<any>(url, body,options).toPromise();
      return resp;
    }

    public async DeleteProducts(products:ProductModel[])
    {
      let resp=this.DeleteProductsFormServer(products);
    }

    private async DeleteProductsFormServer(products:ProductModel[])
    {
      let header = new HttpHeaders();
      const headers=this.userService.createAuthorizationHeader(header);
      var options =  {
        headers: headers
      };
      console.log(headers);
      let url=this.appURL+this.deleteProductsURL;
      console.log(url);
      let body=products
      const resp=await this.http.post<ProductModel>(url, body,options).toPromise();
      return resp;
    }

    public async DeleteProduct(product:ProductModel)
    {
      let resp=this.DeleteProductFormServer(product);
    }
    private async DeleteProductFormServer(product:ProductModel)
    {
      let header = new HttpHeaders();
      const headers=this.userService.createAuthorizationHeader(header);
      var options =  {
        headers: headers
      };
      console.log(headers);
      let url=this.appURL+this.deleteProductURL;
      console.log(url);
      let body=product
      const resp=await this.http.post<ProductModel>(url, body,options).toPromise();
      return resp;
    }

    async GetProductsForAdmin():Promise<ProductModel[]>
    {
      console.log("get products")
      let products=await this.GetProductsForAdminFormServer();
      console.log(JSON.stringify(products));
      return products;

    }

    private async GetProductsForAdminFormServer()
    {
      let header = new HttpHeaders();
      const headers=this.userService.createAuthorizationHeader(header);
      var options =  {
        headers: headers
      };
      console.log(headers);
      let url=this.appURL+this.getProductsURL;
      console.log(url);
      const resp=await this.http.get<ProductModel[]>(url).toPromise();
      return resp;
    }

    async GetCategorys():Promise<CategoryModel[]>
    {
      let categorys=await this.GetCategorysFromServer();
      this.categorys=categorys;
       console.log("categorys: "+JSON.stringify(this.categorys));
       return categorys;
    }

    private async GetCategorysFromServer()
    {
      let url=this.appURL+this.categorysURL
      console.log("get categorys:"+url);
      const resp=await this.http.get<CategoryModel[]>(url).toPromise();
      return resp;;
    }

    async GetProductsFromServer( )
    {
      const body = this.filter;
      let url=this.appURL+this.productURL;
      try
      {
        const data= await this.http.post<any>(url, body).toPromise();
        this.productNumber=data.length;
        console.log(this.productNumber);
        this.products=data.products;
        this.RefreshProductList();
      }
      catch(err)
      {
        console.log(err);
      }
    }
  
    getProducts():ProductModel[] 
    {
      return this.products;
    }

    async getProduct(id:string) {
      console.log('id: '+id);
      let url=this.appURL+'api/Product/'+id;
      console.log("get product:"+url);
      const resp=await this.http.get<ProductModel>(url).toPromise();
      return resp;;
    }
    async UploadProduct(product:ProductModel,image)
    {
      let resp= await this.SaveProductOnServer(product);
      let id=resp.id;
      console.log(id.toString());
      const formData = new FormData();
      formData.append('id', id.toString());
      formData.append('image', image) // your form id value);
      console.log("Send Image");
      let resp2= await this.SaveImageOnServer(formData);
      console.log(JSON.stringify(resp2));
      this.ProductAdded.emit();
     //console.log(JSON.stringify(resp));
    }
    async SaveImageOnServer(formData:FormData)
    {
      let header = new HttpHeaders();
      const headers=this.userService.createAuthorizationHeader(header);
      headers.append('enctype', 'multipart/form-data');
      var options =  {
        headers: headers
      };
      console.log(headers);
      const body = formData;
      let url=this.appURL+this.uploadImageURL;
      const resp=await this.http.post<any>(url, body,options).toPromise();
      return resp;
    }

    async SaveProductOnServer(product:ProductModel)
    {
      let header = new HttpHeaders();
      const headers=this.userService.createAuthorizationHeader(header);
      
      var options =  {
        headers: headers
      };
      console.log(headers);
      const body = product;
      let url=this.appURL+this.addProductURL;
      const resp=await this.http.post<ProductModel>(url, body,options).toPromise();
      return resp;
    }

    clearProducts() 
    {
      this.products = [];
    }

    getProductsToShow():ProductModel[]
    {
      return this.productsToShow;
    }

    setProductToShow(products:ProductModel[])
    {
      this.productsToShow=products;
      console.log("  this.productsToShow: "+  this.productsToShow.length);
      this.RefreshProductList();
    }

    RefreshProductList()
    {
      console.log("refresh product list");
      this.RefreshEvent.emit();
    }

}