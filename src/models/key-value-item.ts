/**
 * Created by barte_000 on 2017-07-13.
 */
export class  KeyValueItem<T>{
  key: string;
  value: T;

  constructor(key: string, value: T){
    this.key = key;
    this.value = value;
  }
}
