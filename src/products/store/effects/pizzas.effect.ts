import { Injectable } from '@angular/core';
import { Effect, Actions} from '@ngrx/effects';
import { Action } from "@ngrx/store";
import * as pizzaActions from '../actions/pizzas.action';
import * as fromServices from '../../services';
import { switchMap, map, catchError } from "rxjs/operators";
import { Observable, pipe } from "rxjs";
import { of } from 'rxjs/observable/of';


// all effects are class which contains a few properties which are happen to be observables
// our observables get called via ngrx effects and kind of in a way act like a reducer
// so this allows us to respond to different events and do different things
// The role of reducer is to deal with pure js state and immutable objects
// In this case we are going to being listening two some events which are actually dispatched
// however we are going to be dealing with observable streams. I our case we will use
// our pizza service, then go and fetch pizzas and dispatch new success action when come back from server

// import { Effect, Actions } from '@ngrx/effects';
// Actions is an observable, then we can listen to the types of action that being dispatched and
// respond to them accordingly
@Injectable()
export class PizzasEffects{

  constructor(
    private actions$: Actions,
    private pizzaService: fromServices.PizzasService
  ){  }
    // this is observable stream and we can add observables to it,
    // we can return new observables, and  Angular http client returns observables,
    // which means it fits directly into an effect absolutely perfect

    /*@Effect({ dispatch: false}) - by default effect dispatched action back in our reducer*/
   @Effect()
    loadPizzas$ = this.actions$.ofType(pizzaActions.LOAD_PIZZAS)
     // pipe simply contain a stream of pure functions instead of chaining them with prototype operator

   // when effect is executed, it must return an action
     .pipe(switchMap(() => {
       return this.pizzaService.getPizzas().pipe(
         map(pizzas => new pizzaActions.LoadPizzasSuccess(pizzas)),
         catchError(error => of(new pizzaActions.LoadPizzasFail(error)))
       )
     }));

   // this effect is listening to CREATE_PIZZA effect
   @Effect()
   createPizza$ = this.actions$.
     ofType(pizzaActions.CREATE_PIZZA)
     .pipe(
       // smth interesting here we have not actually looked at yes
       // new feature - we can actually map over this
       // we are mapping this because we are only interested in
       // payload. So this observable of actions is listening to create
       // CREATE_PIZZA and does that via the type. However we actually
       // can get give that whole action as the next item in stream
       map((action: pizzaActions.CreatePizza) => action.payload),
       switchMap(pizza => {
         return this.pizzaService.
         createPizza(pizza)
           .pipe(
             map(pizza => new pizzaActions.CreatePizzaSuccess(pizza)),
             catchError(error => of(new pizzaActions.CreatePizzaFail(error)))
           );
       })
     );


  @Effect()
  updatePizza$ = this.actions$.
  ofType(pizzaActions.UPDATE_PIZZA)
    .pipe(
      map((action: pizzaActions.UpdatePizza) => action.payload),
      switchMap(pizza => {
        return this.pizzaService.
        updatePizza(pizza)
          .pipe(
            map(pizza => new pizzaActions.UpdatePizzaSuccess(pizza)),
            catchError(error => of(new pizzaActions.UpdatePizzaFail(error)))
          );
      })
    );

  @Effect()
  removePizza$ = this.actions$.
  ofType(pizzaActions.REMOVE_PIZZA)
    .pipe(
      map((action: pizzaActions.RemovePizza) => action.payload),
      switchMap(pizza => {
        // returns an item that has been deleted
        return this.pizzaService.
        removePizza(pizza)
          .pipe(
            // we do not get enything back to the server but we know that
            // pizza is still available in our scope
            map(() => new pizzaActions.RemovePizzaSuccess(pizza)),
            catchError(error => of(new pizzaActions.RemovePizzaFail(error)))
          );
      })
    );


}
