// pizzas state
import { createSelector } from "@ngrx/store";

import * as fromRoot from '../../../app/store';
import * as fromFeature from '../reducers/index';
import * as fromPizzas from "../reducers/pizzas.reducer";

import { Pizza } from '../../models/pizza.model';

//import { getProductsState, ProductsState } from "../reducers";

export const getPizzaState = createSelector(
  fromFeature.getProductsState,
  (state: fromFeature.ProductsState) => state.pizzas
);

export const getPizzasEntities = createSelector(getPizzaState, fromPizzas.getPizzasEntities);
export const getSelectedPizza = createSelector(
  getPizzasEntities,
  fromRoot.getRouterState,
  (entities, router): Pizza => {
    return router.state && entities[router.state.params.pizzaId]
  }
);

export const  getAllPizzas = createSelector(
  getPizzasEntities,
  (entities) => {
    // [1, 2, 3].map()
    // get array of entities

    return Object.keys(entities).map(id => entities[parseInt(id, 10)]);
  });
export const getPizzasLoaded = createSelector(getPizzaState, fromPizzas.getPizzasLoaded);
export const getPizzasLoading = createSelector(getPizzaState, fromPizzas.getPizzasLoading);

// As our app grows it is not very scalable architecture to keep everything in a single file
// so that's why we create separate folder for selectors
