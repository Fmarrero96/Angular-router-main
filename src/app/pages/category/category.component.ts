import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from 'src/app/services/products.service';
import { Product } from 'src/app/models/product.model';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-category',
  template: `<app-products [products]="products" (onLoadMore)="loadMore()"></app-products>`, //en vez de templateURL, va TEMPLATE solo y se puede usar cuando tenga poca logica el html
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  categoryId: string |null = null;

  constructor(
    private router:ActivatedRoute,
    private productsService: ProductsService
  ) { }

  products: Product[] = [];
  limit = 10;
  offset = 0;
  productId: string | null = null;

  ngOnInit(): void {
    this.router.paramMap.pipe(
      switchMap( params => {
        this.categoryId = params.get('id'); //debe coicidir con el nombre que hay en el app-routing
        if (this.categoryId){
          return this.productsService.getByCategory(this.categoryId, this.limit, this.offset)
        }
        return []
      })
      
    )
    .subscribe((data) => {
      this.products = data;
    });
    this.router.queryParamMap.subscribe(params => {this.productId = params.get('product')});
  }


  loadMore(): void {
    this.productsService.getAll(this.limit, this.offset)
      .subscribe(data => {
        this.products = this.products.concat(data.filter(product => product.images.length > 0));
        this.offset += this.limit;
      });
  }

}
