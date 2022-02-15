import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { DataService } from "./data.service";

@Injectable({
  providedIn: "root",
})
export class GithubFollowersService extends DataService {
  constructor(http: HttpClient) {
    super(http, "https://api.github.com/users/mosh-hamedani/followers");
  }
}
