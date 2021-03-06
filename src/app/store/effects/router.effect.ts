import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {Location} from '@angular/common';
import { Effect, Actions } from '@ngrx/effects';
import * as RouterActions from '../actions/router.action';

import { tap, map } from 'rxjs/operators';

@Injectable()
export class RouterEffects{
  constructor(
    private action$: Actions,
    private router: Router,
    private location: Location
  ){}

  // the difference compare with prior effects we created
  // we do not want to actually dispatch an action we just want to
  // handle this effect of navigating; we do not want to return an action
  @Effect({ dispatch: false})
  navigate$ = this.action$.
    ofType(RouterActions.GO)
    .pipe(
      map((action: RouterActions.Go) => action.payload),
      tap(({path, query: queryParams, extras}) => {
        // instead of injecting this across multiple components or potentially services
        // or callbacks elsewhere in app everything is just handled in one place
        this.router.navigate(path, {queryParams, ...extras})
      })
    );

  @Effect({ dispatch: false})
  navigateBack$ = this.action$.
  ofType(RouterActions.BACK)
    .pipe(
      tap(() => {this.location.back();})
    );

  @Effect({ dispatch: false})
  navigateForward$ = this.action$.
  ofType(RouterActions.FORWARD)
    .pipe(
      tap(() => {this.location.forward();})
    );
}
