import { Action } from '@ngrx/store';

import { Pizza } from '../../models/pizza.model';

// load pizzas
export const LOAD_PIZZAS = '[Products] Load Pizzas';
export const LOAD_PIZZAS_FAIL = '[Products] Load Pizzas Fail';
export const LOAD_PIZZAS_SUCCESS = '[Products] Load Pizzas Success';

// action creators
export class LoadPizzas implements Action {
  readonly type = LOAD_PIZZAS;
}

export class LoadPizzasFail implements Action {
  readonly type = LOAD_PIZZAS_FAIL;
  constructor(public payload: any) {}
}

export class LoadPizzasSuccess implements Action {
  readonly type = LOAD_PIZZAS_SUCCESS;
  constructor(public payload: Pizza[]) {}
}

// create pizza
export const CREATE_PIZZA = '[Products] Create Pizza';
export const CREATE_PIZZA_FAIL = '[Products] Create Pizza Fail';
export const CREATE_PIZZA_SUCCESS = '[Products] Create Pizza Success';

export class CreatePizza implements Action {
  readonly type =  CREATE_PIZZA;
  // here we do actually want a constructor we do not use
  // a constructor when we are loading however we want to pass payload
  // from our form to the server which I can then save and add unique id
  // for us and then we can pass it back in success action

  // that is what we going to be sending back through this create pizza action
  constructor(public payload: Pizza){}
}
export class CreatePizzaFail implements Action {
  readonly type =  CREATE_PIZZA_FAIL;
  constructor(public payload: any){}
}

export class CreatePizzaSuccess implements Action {
  readonly type =  CREATE_PIZZA_SUCCESS;
  // pass pizza back from server
  constructor(public payload: Pizza){}
}



// action types
export type PizzasAction =
  | LoadPizzas
  | LoadPizzasFail
  | LoadPizzasSuccess
  | CreatePizza
  | CreatePizzaFail
  | CreatePizzaSuccess;
