import { ActivatedRouteSnapshot, RouterStateSnapshot, Params} from '@angular/router';
import * as fromRouter from '@ngrx/router-store';
import { ActionReducerMap, createFeatureSelector } from "@ngrx/store";

// ngrx Router Store  - it allows to bind representation of the routes and the router state to ngrx store
// this gives us much more power when it comes to composing selectors, so for instance when we click on particular pizza
// we know we have #1 in url which corresponds to id of this pizza
// what we want to do - bind this router state to our app state so we can treat
// this as one source of truth even an url. Now what we can do is to introduce ngrx as router store
// and it will automatically bind this state to our store for us
// we are going to create a few selectors which allows to select via our store the current pizza that we are on the page
// and we will talk about how to refactor our selectors so we can make them more and neat(чистый) and organized

// this is where we will be working for the most of this video
// here we want to set up the state of what the router state will look like

// in app.module.ts we have line:
// StoreModule.forRoot({}, {metaReducers}) - empty object in first argument means that we are initializing
// our root of the state of app however we not actually using any reducers so this is the great place
// of our app module where we can keep track of the router state which allows us using in then feature modules
// such as products module. We can always know where we are up appoint in time

export interface RouterStateUrl{
  url: string;
  queryParams: Params;
  params: Params;
}
export interface State{
  // RouterReducerState is going to actually be comforming to object RouterStateUrl
  // so we only going to supply url, query params, params
  routerReducer: fromRouter.RouterReducerState<RouterStateUrl>
}

export const reducers: ActionReducerMap<State> = {
  routerReducer: fromRouter.routerReducer
};

// much like in other reducers we also want to create selectors
// so we an ask for this particular piece of state

// this actually allows us to then add this getRouterState to another selector inside of
// our products folder
export const getRouterState = createFeatureSelector<fromRouter.RouterReducerState<RouterStateUrl>>('routerReducer');

// Custom serializer is essentially passed to router state,
// and what we can essentially do - is take some of the properties of the router snapshot
// and we can bind those to the store. So when you for instance inject smth like ActivatedRoute
// you can obtain a snapshot which is what a router state looks like at that point in time

// when we build our own app it might be that we ajust(настроить) custom serializer to give you your
// own properties that you need for a specific usecase
//
export class CustomSerializer
  implements fromRouter.RouterStateSerializer<RouterStateUrl>{
  serialize(routerState: RouterStateSnapshot): RouterStateUrl{

    //const url = routerState.url - destructuring
    const { url } = routerState;
    const { queryParams } = routerState.root;

    // the way the router actually works is it is a state tree of itself
    // It means that we have to actually traverse the state tree

    let state: ActivatedRouteSnapshot = routerState.root;

    // this is not the state tree to do with ngrx, this is the state tree
    // of Angular's router. And we essentially hijacking (похищать) it and taking
    // properties and binding that to our ngrx store

    // firstChild - we have child roots, for instance we have /products/1 which
    // means we need to iterate few times to be able to get that
    // route param
    while(state.firstChild){
      state = state.firstChild;
    }
    // const params = state.params;
    const { params } = state;
    // this object is going to be bound to our state tree
    // Now the RouterStore projects which is part of ngrx project will actually listen
    // to Angular's routing events any time you navigate somewhere or angular navigates somewhere
    // or smth changes in url this whole function is going to be called which means that we get new state
    // representation of where we are in app in all times
    return { url, queryParams, params };
  }
}
