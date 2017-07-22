/**
 * Created by barte_000 on 2017-07-16.
 */
import { Injectable } from '@angular/core';
import {Http, RequestOptionsArgs, Request, Response, XHRBackend, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {Observable} from "rxjs/Observable";

@Injectable()
export class HttpInterceptor extends Http{

  constructor(backend: XHRBackend, options: RequestOptions){
    super(backend, options);
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    return super.request(url, options).catch(res => {
      return Observable.throw(res);
    });
  }

}
