export class PromisesUtil<T>{
  processAsync(array: [any], fn: (item: any) => Promise<T>){
    let index = 0;

    return new Promise<T>((resolve, reject) => {
      let next = () =>{
        if(index<array.length){
          fn(array[index]).then(()=>{
            index++;
            next();
          }).catch(reject);
        }else{
          resolve();
        }
      };
      next();
    });
  }
}
