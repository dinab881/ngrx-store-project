import { Injectable } from '@angular/core';

import { Effect, Actions } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';

import { map, catchError, switchMap } from 'rxjs/operators';

import * as toppingsActions from '../actions/toppings.action';
import * as fromServices from '../../services/toppings.service';

// pattern of Reducer/Action/Effect - take items from store, compose
// them with selector and bind them by passing down via async pipe
// to Angular template

@Injectable()
export class ToppingsEffects{
  constructor(
    private actions$: Actions,
    private toppingsService: fromServices.ToppingsService
  ){}

  @Effect()
  loadToppings$ = this.actions$.ofType(toppingsActions.LOAD_TOPPINGS).pipe(
    switchMap(() => {
      return this.toppingsService.getToppings().pipe(
        map(toppings => new toppingsActions.LoadToppingsSuccess(toppings)),
        catchError(error => of(new toppingsActions.LoadToppingsFail(error)))
      )
    })
  )
}
