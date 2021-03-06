import {Pizza} from "../../models/pizza.model";
import * as fromPizzas from '../actions/pizzas.action';

export interface PizzaState{
 // data: Pizza[]; - this data structure is not going to scale or handle well in big app when we want to get things very fast
  // using objects instead of array is much better approach
  entities: {[id: number] : Pizza}
  loaded: boolean;
  loading: boolean;
}

export const  initialState: PizzaState = {
  entities: {},
  loaded: false,
  loading: false
};

export function reducer(
  state = initialState,
  action: fromPizzas.PizzasAction
): PizzaState {

  switch(action.type){
    case fromPizzas.LOAD_PIZZAS:{
      return {
        ...state,
        loading: true
      };
    }

    case fromPizzas.LOAD_PIZZAS_SUCCESS:{
     /* [{ id: 1}, {id: 2}]

     => =>
      const pizza: any = {
        1: {
          id: 1,
            name: 'Pizza',
            toppings: []
        }
      }
      const id = 1;
      pizza[id]
      */

      const pizzas = action.payload;
      const entities = pizzas.reduce(
        (entities: {[id: number]: Pizza}, pizza: Pizza) => {
          return {
            ...entities,
            [pizza.id]: pizza
          };
        }, {
        ...state.entities
      });
      return {
        ...state,
        loading: false,
        loaded: true,
        entities
      };
    }

    case fromPizzas.LOAD_PIZZAS_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false
      };
    }

    case fromPizzas.UPDATE_PIZZA_SUCCESS:
    case fromPizzas.CREATE_PIZZA_SUCCESS: {
      const pizza = action.payload;
      const entities = {
        ...state.entities,
        [pizza.id]: pizza
      };
      return {
        ...state,
        entities,

      }
    }

    case fromPizzas.REMOVE_PIZZA_SUCCESS: {
      const pizza = action.payload;
      // we can use delete keyword, but it does not feel
      // great in terms of keeping our code nice and immutable
      //https://www.bram.us/2018/01/10/javascript-removing-a-property-from-an-object-immutably-by-destructuring-it/

      // destructures pizza off the state.entities object, and collects all rest
      // props into entities
      const { [pizza.id]: removed, ...entities } = state.entities;

      return {
        ...state,
        entities
      }
    }


  }
  return state;
}
export const getPizzasEntities = (state: PizzaState) => state.entities;
export const getPizzasLoading = (state: PizzaState) => state.loading;
export const getPizzasLoaded = (state: PizzaState) => state.loaded;

