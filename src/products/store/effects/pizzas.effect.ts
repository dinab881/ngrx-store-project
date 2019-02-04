import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from "@ngrx/store";
import * as pizzaActions from './actions/pizzas.action';

@Injectable()
export class PizzasEffect{
  constructor(private actions$: Action){
   loadPizzas$ = this.actions$.ofType(pizzaActions.LOAD_PIZZAS())
  }
}
