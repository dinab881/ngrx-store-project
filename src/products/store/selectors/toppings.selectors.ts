import { createSelector } from '@ngrx/store';

import * as fromRoot from '../../../app/store';
import * as fromFeature from '../reducers/index';
import * as fromToppings from "../reducers/toppings.reducer";

// anytime we use selector getToppingsState
// in another selector we have already starting with returned object
// from that toppings slice of state
/*
* products: {
*    pizzas: {},
*    toppings: {
*      entities: {}
*    }
* }
* */


export const getToppingsState = createSelector(
  fromFeature.getProductsState,
  (state: fromFeature.ProductsState) => state.toppings
);

export const getToppingEntities = createSelector(
  getToppingsState,
  fromToppings.getToppingEntities
);

export const getSelectedToppings = createSelector(
  getToppingsState,
  fromToppings.getSelectedToppings
);
export const getAllToppings = createSelector(
  getToppingEntities,
  entities => {
    return Object.keys(entities).map(id => entities[parseInt(id, 10)])
  }
);

export const getToppingsLoaded = createSelector(
  getToppingsState,
  fromToppings.getToppingsLoaded
);

export const getToppingsLoading = createSelector(
  getToppingsState,
  fromToppings.getToppingsLoading
);

