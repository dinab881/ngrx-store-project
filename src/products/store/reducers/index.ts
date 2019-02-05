import {ActionReducerMap, createFeatureSelector} from "@ngrx/store";
import * as fromPizzas from './pizzas.reducer';
export interface ProductsState{
  pizzas: fromPizzas.PizzaState
}
export const reducers: ActionReducerMap<ProductsState> = {
  pizzas: fromPizzas.reducer
};
export const getProductsState = createFeatureSelector<ProductsState>('products');

/*const state = {
  products: {
    pizzas: {
      data: [],
      loaded: false,
      loading: false
    }
  }
};*/

/*
* ProductsState, reducers and getProductsState lies here because inside this reducers folder
* what we actually going to do is have multiple reducers and all apart of this products feature
* module which is why it is called feature selector. So we actually want to do is start to move
* things with pizza state across to its own pizza.selectors file
* */
