// Route guards - to actually check whether smth is in store or not. We are going to do this because
// if we navigate to perhaps a different route and give page refresh, the data one actually
// be available much like in our container component because we can see in here
// that we are dispaching LoadPizzas, LoadToppings actions in here so what we are going to do
// is workout how remove this and make sure that when we click on particular pizza
// and give that pager refresh that we can then dispatch this action inside of route guard
// and then return true or false based on whether that action was then successful
//

// Why we are using a route guard instead of a resolver? First off, we do not need to use
// resolver because we actually using a store and secondly we can use a guard
// because it gives additional benefit of being able to control the navigation and navigate away
// or to particular view that we are trying to attempt to navigate to
// we want to create a route guard which injects our store and actually checks whether we
// have loaded pizzas or not
import {  Injectable } from '@angular/core';
import {  CanActivate } from '@angular/router';

import {  Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { tap, filter, take, switchMap, catchError } from "rxjs/operators";

// we want to dispatch an action and also use one of our selectors
// which we actually set up but we haven't really talked about yet
// but you'll see coming to effect momentarely
import * as fromStore from '../store';


@Injectable()
export class PizzasGuard implements CanActivate{
  constructor(private store: Store<fromStore.ProductsState>){}
  canActivate(): Observable<boolean>{
     return this.checkStore().pipe(
       switchMap(() => of(true)),
       catchError(() => of(false))
     );
  }
  checkStore(): Observable<boolean>{
    return this.store.select(fromStore.getPizzasLoaded)
      .pipe(
        tap(loaded => {
          if(!loaded){
            this.store.dispatch(new fromStore.LoadPizzas())
          }
        }),
        filter(loaded => loaded),
        take(1)
      )
  }
}

