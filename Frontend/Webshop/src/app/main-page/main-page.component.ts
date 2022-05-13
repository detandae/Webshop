import { Component,ViewEncapsulation, OnInit } from '@angular/core';
import { DataManagerService } from 'app/services/data-manager';
import { CategoryModel } from 'app/models/category.model';
import { ProductModel } from 'app/models/product.model';
import { ProductDictionary } from 'app/models/ProductDictionary'; 
import { Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';
//import mixitup from 'mixitup';
const mixitup = require('mixitup');
@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css',
  ],
  encapsulation: ViewEncapsulation.None 
})



export class MainPageComponent implements OnInit {

  highlightedProducts:ProductDictionary[]=[];
  latestProducts:ProductDictionary[]=[];
  actionProducts:ProductDictionary[]=[];

  malecategories:CategoryModel[]=[];
  femalecategories:CategoryModel[]=[];
  productClass:string="col-lg-3 col-sm-6 mix ";
  mixer1;
  mixer2;
  mixer3;
  appURL:string;

  constructor(private dataManager:DataManagerService, @Inject('APP_URL') appURL: string,
              private route: ActivatedRoute,private router: Router) 
  { 
    this.appURL=appURL;
  }
  setDataFilter(category:CategoryModel)
  {
    return "."+category.sex+category.category;
  }

  GetAction(product:ProductModel)
  {
    return "- "+(product.action*100).toFixed(0)+"%"; 
  }

  getRoundedPriceForProduct(product:ProductModel)
  {
    if(product.action>0)
    {
      return(product.basePrice-product.action*product.basePrice).toFixed(2)+"$";
    }
    return(product.basePrice).toFixed(2)+ "$"; 
  }

  FilterList1(category)
  {
    console.log("a");
    var filter=this.setDataFilter(category)
    console.log (filter);
    this.mixer1.filter(filter);
  }

  FilterList2(category)
  {
    console.log("a");
    var filter=this.setDataFilter(category)
    console.log (filter);
    this.mixer2.filter(filter);
  }

  FilterList3(category)
  {
    console.log("a");
    var filter=this.setDataFilter(category)
    console.log (filter);
    this.mixer3.filter(filter);
  }

  NavigateToProduct(product)
  {
    console.log(product.id);
    let value=this.router.navigate(['../product', product.id]);
    console.log(value);
  }

  private async GetHighLightedProducts()
  {
    let highlighted=await this.dataManager.GetHighlightedProducts();
    for(let key of Array.from( Object.keys(highlighted)))
    {
      let p=new ProductDictionary();
      p.category=key;
      p.products=highlighted[key];
      this.highlightedProducts.push(p);
      console.log(key);
   }
  }


  private async GetLatestProducts()
  {
    let latestProducts=await this.dataManager.GetLatestProducts();
    for(let key of Array.from( Object.keys(latestProducts)))
    {
      let p=new ProductDictionary();
      p.category=key;
      p.products=latestProducts[key];
      this.latestProducts.push(p);
      console.log(key);
   }
  }

  private async  GetActionProducts()
  {
    let actionProducts=await this.dataManager.GetActionProducts();
    for(let key of Array.from( Object.keys(actionProducts)))
    {
      let p=new ProductDictionary();
      p.category=key;
      p.products=actionProducts[key];
      this.actionProducts.push(p);
      console.log(key);
   }
  }
 

  async ngOnInit() {
    await this.GetHighLightedProducts();
    await this.GetLatestProducts();
    await this.GetActionProducts();

    let categories= await this.dataManager.GetCategorys();
    for(let i=0;i<categories.length;i++)
    {
      if(categories[i].sex=="male")
      {
        this.malecategories.push(categories[i])
        console.log(categories[i].category)
      }
      else
      {
        this.femalecategories.push(categories[i])
      }
    }
    this.InitMixer();


  }

  InitMixer() {
    if ($('#product-list1').length > 0) {
        var containerEl1 = document.querySelector('#product-list1');
        this.mixer1 = mixitup(containerEl1,
            { 
                selectors: {
                control: '[data-mixitup-control1]'
                }
            }
            );
        this.mixer1.filter('.maleJackets');

    }

    if ($('#product-list2').length > 0) {
        var containerEl2 = document.querySelector('#product-list2');
        this.mixer2 = mixitup(containerEl2,
            { 
                selectors: {
                control: '[data-mixitup-control2]'
                }
            }
            );
        this.mixer2.filter('.maleJackets');
    }

    if ($('#product-list3').length > 0) {
        var containerEl3 = document.querySelector('#product-list3');
        this.mixer3 = mixitup(containerEl3,
            { 
                selectors: {
                control: '[data-mixitup-control3]'
                }
            }
            );
        this.mixer3.filter('.maleJackets');
    }
  }
 

}
