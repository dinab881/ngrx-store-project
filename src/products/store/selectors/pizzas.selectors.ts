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
/*
* we called it selected pizza when we navigate to /1, /2 that is itself we want to say
* that is selected pizza and we know that it is selected pizza because route params
* are telling us that we are currently at that route.  so we can then going select pizza
* state neccessary bring it back from the store and render it in our app
* */
export const getSelectedPizza = createSelector(
  getPizzasEntities,
  fromRoot.getRouterState,
  // here we use router state to then lookup an entity
  // and this is the whole reason not just for performance reasons
  // that we get a bigger gain when it comes to using an entity
  // we don't have to iterate over collections, we do not have to map
  // througth them to just simply update smth, we can referece an entity
  // by looking up its id directly. it is super fast

  // so the benefit is the router state tells us the id of the pizza we
  // are on
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
