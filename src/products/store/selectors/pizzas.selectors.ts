// pizzas state
import { createSelector } from "@ngrx/store";

import * as fromRoot from '../../../app/store';
import * as fromFeature from '../reducers/index';
import * as fromPizzas from "../reducers/pizzas.reducer";
import * as fromToppings from './toppings.selectors';

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
  // throught them to just simply update smth, we can referece an entity
  // by looking up its id directly. it is super fast

  // so the benefit is the router state tells us the id of the pizza we
  // are on

  // selectors make it really nice really easy. I want to get used for them
  // is absolutely fantastic in how we can actually compose state via different states around
  // our app. So we are using getPizzasEntities (featureState) in our products module
  // and here we are using route state (1,2 arguments). We are asking for the state of the router
  // and then composing new state to be returned to our app based of this
  (entities, router): Pizza => {
    return router.state && entities[router.state.params.pizzaId];
  }
);

export const getPizzaVisualised = createSelector(
  getSelectedPizza,
  fromToppings.getToppingEntities,
  fromToppings.getSelectedToppings,
  (pizza, toppingEntities, selectedToppings) => {
    const toppings = selectedToppings.map(id => toppingEntities[id]);
    return { ...pizza, toppings }
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
