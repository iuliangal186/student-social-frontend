import {Injectable} from "@angular/core";
import {Observable,timer} from "rxjs";

@Injectable()
export class RefreshService{
  timer: Observable<number> = timer(30000,30000);

  constructor() {
  }

  observeTimer():Observable<number>{
    return this.timer;
  }

}