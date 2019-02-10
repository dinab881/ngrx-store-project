import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { Pizza } from '../../models/pizza.model';
import { Store } from '@ngrx/store';
import { Observable} from "rxjs/Observable";
import * as fromStore from '../../store';

@Component({
  selector: 'products',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['products.component.scss'],
  template: `
    <div class="products">
      <div class="products__new">
        <a
          class="btn btn__ok" 
          routerLink="./new">
          New Pizza
        </a>
      </div>
      <div class="products__list">
        <div *ngIf="!((pizzas$ | async)?.length)">
          No pizzas, add one to get started.
        </div>
        <pizza-item
          *ngFor="let pizza of (pizzas$ | async)"
          [pizza]="pizza">
        </pizza-item>
      </div>
    </div>
  `,
})
export class ProductsComponent implements OnInit {
  pizzas$: Observable<Pizza[]>;

  constructor(private store: Store<fromStore.ProductsState>) {}

  ngOnInit() {
    // how to remove this to make sure when we click on a particular pizza
    // it gives page refresh that we can then dispatch this action
    // inside of route guard and then return true or false based on whether
    // that action was then successful
    this.pizzas$ = this.store.select<any>(fromStore.getAllPizzas);
    //this.store.dispatch(new fromStore.LoadPizzas());
   // this.store.dispatch(new fromStore.LoadToppings());
  }
}
