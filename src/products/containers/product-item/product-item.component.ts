import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as fromStore from '../../store';
import { Pizza } from '../../models/pizza.model';
import { Topping } from '../../models/topping.model';
import { Store } from "@ngrx/store";
import { tap } from "rxjs/operators";
// import { ToppingsService } from '../../services/toppings.service';
// import { Router, ActivatedRoute } from '@angular/router';
// import { PizzasService } from '../../services/pizzas.service';
@Component({
  selector: 'product-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['product-item.component.scss'],
  template: `
    <div 
      class="product-item">
      <pizza-form
        [pizza]="pizza$ | async"
        [toppings]="toppings$ | async"
        (selected)="onSelect($event)"
        (create)="onCreate($event)"
        (update)="onUpdate($event)"
        (remove)="onRemove($event)">
        <pizza-display
          [pizza]="visualise$ | async">
        </pizza-display>
      </pizza-form>
    </div>
  `,
})
export class ProductItemComponent implements OnInit {
  // Container component receives its input via observable
  // from the store so this initiating top-level data-flow
  // If we want to Output in container component we use dispatch
  // not Output. And Inputs via store.select and outputs via store.dispatch
  // So you can change of thinking in this pattern, in this approach
  pizza$: Observable<Pizza>;
  // when we select topping pizza from returns array of ids
  // we are going to keep that selected ids inside of our state tree
  // in toppings state and then we are going to use selector
  // that cleverly merges changes so we can visualize what toppings
  // a user clicked here
  visualise$: Observable<Pizza>;
  toppings$: Observable<Topping[]>;

  constructor(
     private store: Store<fromStore.ProductsState>
    /*private pizzaService: PizzasService,
    private toppingsService: ToppingsService*/
  ) {}

  ngOnInit() {
    // when we go to pizza page we see that on first page load
    // name of pizza is filled from pizzaId, but there are no toppings
    // (because they are got from DB).
    // When we refresh a page, the name disappears. this is because
    // there are no any guards, which protect this routes
    // and make sures that those pizza exists in a store before we are
    // trying to access them. Later we will set up a route guard which will
    // actually check whether pizza's entity do exists in a store

    // You may remember early we looked at loaded and loading properties
    // loaded property we set to true when our pizza being loaded
    // That's how we will know when we use route guard in future
    // whether smth has being loaded. Otherwise we are going to dispatch
    // an action to make sure we protect this route so we could view
    // pizza if it exists. We see pizza info on first page load because in the previous view they do exists
    // in the store
    this.pizza$ = this.store.select(fromStore.getSelectedPizza).pipe(
      tap((pizza: Pizza = null) => {
        // products/1,  products/2 - uses Router state
        // products/new - we use the same component if we create new pizza
        // we want empty the state of visualized topping
        const pizzaExists = !!(pizza && pizza.toppings);
        // if we create a new pizza then we dispatch and clear the previous state
        const toppings = pizzaExists ? pizza.toppings.map( topping => topping.id ) : [];
        this.store.dispatch(new fromStore.VisualiseToppings(toppings));
      })
    );
    this.toppings$ = this.store.select(fromStore.getAllToppings);
    this.visualise$ = this.store.select(fromStore.getPizzaVisualised);
    /*this.pizzaService.getPizzas().subscribe(pizzas => {
      const param = this.route.snapshot.params.id;
      let pizza;
      if (param === 'new') {
        pizza = {};
      } else {
        pizza = pizzas.find(pizza => pizza.id == parseInt(param, 10));
      }
      this.pizza = pizza;
      this.toppingsService.getToppings().subscribe(toppings => {
        this.toppings = toppings;
        console.log('OnInit productItem: toppings from service-------------------', toppings);
        this.onSelect(toppings.map(topping => topping.id));
      });
    });*/
  }

  onSelect(event: number[]) {
    //console.log('OnSelect:::', event);

    this.store.dispatch(new fromStore.VisualiseToppings(event));
    /*let toppings;
    console.log('toppings', this.toppings );
    if (this.toppings && this.toppings.length) {

      toppings = event.map(id =>
        this.toppings.find(topping => topping.id === id)
      );
      console.log('yes this.toppings', toppings );

    } else {

      toppings = this.pizza.toppings;
      console.log('no this.toppings', toppings );
    }
    console.log('toppings current',toppings);
    this.visualise = { ...this.pizza, toppings };*/
  }

  onCreate(event: Pizza) {
    this.store.dispatch(new fromStore.CreatePizza(event));
    /*this.pizzaService.createPizza(event).subscribe(pizza => {
      this.router.navigate([`/products/${pizza.id}`]);
    });*/
  }

  onUpdate(event: Pizza) {
    this.store.dispatch(new fromStore.UpdatePizza(event));
    /*this.pizzaService.updatePizza(event).subscribe(() => {
      this.router.navigate([`/products`]);
    });*/
  }

  onRemove(event: Pizza) {
    const remove = window.confirm('Are you sure?');
    if (remove) {
      this.store.dispatch(new fromStore.RemovePizza(event));
      /*this.pizzaService.removePizza(event).subscribe(() => {
        this.router.navigate([`/products`]);
      });*/
    }
  }
}
