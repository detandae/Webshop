import { Component, OnInit } from '@angular/core';
import { DataManagerService } from 'app/services/data-manager';
import {ProductModel} from '../models/product.model'
import {ProductFilterDtos} from '../Dtos/ProductFilterDtos'

@Component({
  selector: 'app-product-view-grid',
  templateUrl: './product-view-grid.component.html',
  styleUrls: ['./product-view-grid.component.css']
})
export class ProductViewGridComponent implements OnInit {
  products:ProductModel[];
  dataManagerService: DataManagerService;
  SomeText: string;
  private subscription: any;

  private productNumber:number;
  private pageNumber:number;
  private showPagination:boolean;
  private pages:number[]=[];
  public currentPage:number;
  private filter:ProductFilterDtos;

  public buttonClass:string="btn-lg btn-outline-dark";
  public buttonClassActive:string="btn-lg btn-outline-dark active";
  
  constructor(dataManager:DataManagerService) {

    this.dataManagerService=dataManager;
    this.products=this.dataManagerService.getProductsToShow();
    this.productNumber=this.dataManagerService.productNumber;
    console.log("datamanaer someText: "+dataManager.SomeText);
    console.log("products number "+ this.products.length);
    this.SomeText=dataManager.SomeText;
  }

  ngOnInit() {
    
    this.subscription=this.dataManagerService.RefreshEvent.subscribe(
      ()=>
      {
        console.log("subscribe is called");
        this.products=this.dataManagerService.products;
        this.productNumber=this.dataManagerService.productNumber;
        if(JSON.stringify(this.filter) != JSON.stringify(this.dataManagerService.filter))
        {
          this.filter=this.dataManagerService.filter;
        this.SetPageNavigationButtons();
        }
      }
    )
  }

  SetPageNavigationButtons()
  {
    console.log("productnumber: "+this.productNumber );
    if(this.productNumber>0)
    {
      this.showPagination=true;
      this.currentPage=1;
    }
    else{
      this.showPagination=false
    }
    
    //divide with 50
    this.pageNumber=Math.ceil(this.productNumber / 50);
    console.log("pageNumber: "+this.pageNumber);

    //set pages list
    if(this.pageNumber<5)
    {
      this.RefreshPageNumberList(1,this.pageNumber);
    }
    else{
      for(let i=0;i<5;i++)
      {
        this.RefreshPageNumberList(1,5);
      }
    }
  }

    
  RefreshPageNumberList(from:number,until:number)
  {
    let pagenumber=from;
    for(let i=0;i<=(until-from);i++)
    {
      this.pages[i]=pagenumber;
      pagenumber++;
    }
  }

  OnPageButtonClicked(page)
  {
   this.currentPage=page;
   this.dataManagerService.filter.PageNumber=this.currentPage;
   this.dataManagerService.GetProductsFromServer();
   console.log(page);
  }

  OnPageNextClicked()
  {
    if(this.currentPage!=this.pageNumber)
    {
      this.currentPage++;
      this.dataManagerService.filter.PageNumber=this.currentPage;
      this.dataManagerService.GetProductsFromServer();
    }
    if(!this.pages.includes(this.currentPage))
    {
      this.RefreshPageNumberList(this.currentPage-5,this.currentPage);
    }
   
    console.log("next");
  }

  OnPagePrevClicked()
  {
    if(this.currentPage!=1)
    {
      this.currentPage--;
      this.dataManagerService.filter.PageNumber=this.currentPage;
      this.dataManagerService.GetProductsFromServer();
    }
    if(!this.pages.includes(this.currentPage))
    {
      this.RefreshPageNumberList(this.currentPage,this.currentPage+5);
    }
  
    
    console.log("prev");
  }

}
