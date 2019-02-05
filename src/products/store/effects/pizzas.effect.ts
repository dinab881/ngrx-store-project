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
     }))

}
