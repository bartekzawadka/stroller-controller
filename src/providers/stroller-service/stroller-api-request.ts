import {HttpInterceptor} from "../http-interceptor/http-interceptor";

export class StrollerApiRequest<T> {

  private parameters: {
    map: boolean,
    onSuccess: (result, resolve, reject) => void,
    onError: (error, reject) => void,
    preSendValidation: (resolve, reject) => boolean,
    data: any
  };

  constructor(private getUri: ()=> Promise<string>,
              private method: string,
              private http: HttpInterceptor, ) {
    this.init();
  }

  private static rejectStrollerError(reject: (reason: any) => void, error: any) {
    if (error && error.error) {
      reject(error.error);
    } else if (error && error.message) {
      reject(error.message);
    } else if (error && error.statusText) {
      reject(error.statusText)
    } else {
      reject(error);
    }
  }

  private init(){
    this.parameters={
      map: false,
      onSuccess: (result, resolve) => {resolve(result);},
      onError: (error, reject) => {StrollerApiRequest.rejectStrollerError(reject, error);},
      preSendValidation: undefined,
      data: undefined
    }
  }

  map() {
    this.parameters.map = true;
    return this;
  }

  success(successHandler: (result, resolve, reject) => void) {
    this.parameters.onSuccess = successHandler;
    return this;
  }

  error(errorHandler: (error, reject) => void){
    this.parameters.onError = errorHandler;
    return this;
  }

  validateBeforeSend(preSendValidationHandler: (resolve, reject) => boolean){
    this.parameters.preSendValidation = preSendValidationHandler;
    return this;
  }

  data(data: any){
    this.parameters.data = data;
    return this;
  }

  execute(): Promise<T>{

    return new Promise<T>((resolve, reject)=>{

      if(this.parameters.preSendValidation){
        if(!this.parameters.preSendValidation(resolve, reject)){
          return;
        }
      }

      let me = this;

      this.getUri().then(uri=>{
        let query = this.http[this.method](uri, this.parameters.data);
        if(this.parameters.map){
          query = query.map(res=>res.json());
        }
        query.subscribe(function(data){
          me.parameters.onSuccess(data, resolve, reject);
        }, function(error){
          me.parameters.onError(error, reject);
        });
      });

    });
  }
}
