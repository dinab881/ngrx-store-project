/*
* When we click on pizza we obviously have all that data available
* but this kind of 2 checks that we want actually make here
* the first check is whether the item as an entity actually exists in a store
*  if it does not we want to actually navigate away because technically
*  nothing stopping smb doing smth like this localhost:3000/products/1398394823
*  and pressing Enter. So we actually traing to fetch smth from a store
*  that does not exists.(page with pizza opens but without toppings in it, but
*  we have to navigate away to /products in this case)
*  And also if we click on existed pizza for example localhost:3000/products/3
*  and refresh our app currently fails because load pizza action has not been dispatched
*  so we need to do two things one guard:
* */
import {  Injectable } from '@angular/core';
import {  CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import {  Store } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { tap, filter, take, switchMap, catchError, map } from "rxjs/operators";
import * as fromStore from '../store';

import { Pizza } from '../models/pizza.model';

@Injectable()
export class PizzaExistsGuard implements CanActivate{
  constructor(private store: Store<fromStore.ProductsState>){}

  canActivate(route: ActivatedRouteSnapshot){
    return this.checkStore().pipe(
      switchMap(() => {
        const id = parseInt(route.params.pizzaId, 10);
        return this.hasPizza(id);
      })
    )
  }

  hasPizza(id: number): Observable<boolean>{
  return this.store.select(fromStore.getPizzasEntities)
    .pipe(
      map((entities: { [key: number]: Pizza}) => !!entities[id]),
      take(1)
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
