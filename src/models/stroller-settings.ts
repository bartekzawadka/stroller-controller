

import {KeyValueItem} from "./key-value-item";

export class StrollerSettings{
  direction: string;
  stepAngle: number;
  directions: Array<KeyValueItem<string>>;
  cameras: Array<KeyValueItem<string>>;
  camera: string;
}
