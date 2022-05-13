import { Component, OnInit } from '@angular/core';
import { forEach } from '@angular/router/src/utils/collection';
import { ProductModel } from 'app/models/product.model';
import { DataManagerService } from 'app/services/data-manager';
import { Options,LabelType } from 'ng5-slider';
import { FromEventPatternObservable } from 'rxjs/observable/FromEventPatternObservable';
import { CartService } from 'app/services/cart-service';
import {ProductFilterDtos} from '../Dtos/ProductFilterDtos'
import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  productsBeforeFilter:ProductModel[];
  maleButtonStyle:string;
  femaleButtonStyle:string;
  categoryButtonStyle:string;

  dataManagerService: DataManagerService;
  cartService:CartService;
  femaleProductTypes:string[]=[];
  maleProductTypes:string[]=[];
  sizeList={
    "S":   true,
    "M":   true,
    "L":   true,
    "XL":  true,
    "XXL": true
  };
  

  productCategoryList:string[];
  currentCategory:string;
  currentSex:string;

  minValue: number = 0;
  maxValue: number = 10000;
  options: Options = {
    floor: 0,
    ceil: 10000,
    step: 10,
    enforceStep: false,
    enforceRange: false,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return  value+'$' ;
        case LabelType.High:
          return  value+'$' ;
        case LabelType.Floor:
          return 'Min' ;
          case LabelType.Ceil:
            return 'Max' ;
      }
    }
  }


  constructor(dataManager:DataManagerService,cartService:CartService) {
    this.productsBeforeFilter=[];

    this.dataManagerService=dataManager;
    this.cartService=cartService;
    
    this.maleButtonStyle="SexStyle";
    this.femaleButtonStyle ="SexStyle";
    this.categoryButtonStyle="button";
    this.currentCategory="";
    this.productCategoryList=this.maleProductTypes;
    this.currentSex="Male";
    this.maleButtonStyle="SexStyleSelected"
    this.currentCategory= "Jackets";
    //get data from server
    let filter=this.GetFilter();
    console.log("filter: "+filter);
    this.dataManagerService.filter=filter;
    this.dataManagerService.GetProductsFromServer();
  }

  async ngOnInit() {
    await this.dataManagerService.GetCategorys();
    let categorys=this.dataManagerService.categorys
  
    console.log("nginit sidebar: ")
    if(categorys)
    {
      console.log("categorys: "+categorys.length);
      for(let i=0;i<categorys.length;i++)
      {
        if(categorys[i].sex=="male")
        {
          this.maleProductTypes.push(categorys[i].category);
          console.log(categorys[i].category)
        }
        if(categorys[i].sex=="female")
        {
          this.femaleProductTypes.push(categorys[i].category);
        }
      }
      console.log(JSON.stringify( this.maleProductTypes));
    }

  }

  GetFilter():ProductFilterDtos
  {
    let filter=new ProductFilterDtos();
    filter.ProductType=this.currentCategory;
    filter.Sex=this.currentSex;
    filter.MaxPrice=this.maxValue;
    filter.MinPrice=this.minValue;
    filter.Sizes=this.GetSizesForFilter().join(';');
    return filter;
  }

  OnMaleTextClicked()
  {
    console.log("OnMaleTextClicked");
    this.maleButtonStyle="SexStyleSelected"
    this.femaleButtonStyle="SexStyle";
    this.productCategoryList=this.maleProductTypes;
    this.currentSex="Male";

     //get data from server
    let filter=this.GetFilter();

    this.dataManagerService.filter=filter;
    this.dataManagerService.GetProductsFromServer();
  }

  OnFemaleTextClicked()
  {
    console.log("OnFemaleTextClicked");
    this.maleButtonStyle="SexStyle"
    this.femaleButtonStyle="SexStyleSelected";
    this.productCategoryList=this.femaleProductTypes;
    this.currentSex="Female";
    if(this.currentCategory=="Suits")
    {
      this.currentCategory="Jackets";
    }
    //get data from server
    let filter=this.GetFilter();
    this.dataManagerService.filter=filter;
    this.dataManagerService.GetProductsFromServer();
  }

  OnCategoryTextClicked(category:string)
  {
    console.log("category: ",category);
    this.currentCategory=category;

      //get data from server
      let filter=this.GetFilter();
      this.dataManagerService.filter=filter;
      this.dataManagerService.GetProductsFromServer();

  }
  SizeListChanged():void
  {
     //get data from server
     console.log("SizeListChanged");
     let filter=this.GetFilter();
     console.log(JSON.stringify(filter));
     this.dataManagerService.filter=filter;
     this.dataManagerService.GetProductsFromServer();
  }
  GetSizesForFilter():string[]
  {
    let sizes=[];
    if(this.sizeList.S){sizes.push('S')};
    if(this.sizeList.M){sizes.push('M')};
    if(this.sizeList.L){sizes.push('L')};
    if(this.sizeList.XL){sizes.push('XL')};
    if(this.sizeList.XXL){sizes.push('XXL')};
    return sizes;
  }

  priceFilterChanged()
  {
    //get data from server
    let filter=this.GetFilter();
    this.dataManagerService.filter=filter;
    this.dataManagerService.GetProductsFromServer();
  }

}
