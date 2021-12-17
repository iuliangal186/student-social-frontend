import {Injectable} from "@angular/core";
import {HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable()
export class UrlService{

  getBaseUrl():string{
    return environment.baseUrl;
  }

  getRegisterUrl():string{
    return this.getBaseUrl()+ environment.registerUrl;
  }
  getLoginUrl():string{
    return this.getBaseUrl()+ environment.loginUrl;
  }

  getRequestOptions() {
    return {headers: this.getScoreboardHeaders()};
  }

  private getScoreboardHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-type,Range,api_key,Authorization',
      'Access-Control-Expose-Headers': 'Content-Length,Content-Range',
      'Referrer-Policy': 'origin'
    });
  }
}
