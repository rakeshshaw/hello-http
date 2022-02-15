import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { AppError } from "../common/errors/app-error";
import { BadInput } from "../common/errors/bad-input";
import { NotFoundError } from "../common/errors/not-found-error";
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  currentUser: any;
  // authToken: any;

  constructor(private http: HttpClient, private jwt: JwtHelperService) {
    let token = localStorage.getItem("token");
    if (token) {
      // let jwt = new JwtHelperService();
      console.log(jwt);
      this.currentUser = jwt.decodeToken(token);
      // console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^", this.currentUser);
      // this.authToken = token;
      // console.log(this.jwt.isTokenExpired(token));
    }
  }

  logout() {
    localStorage.removeItem("token");
    this.currentUser = null;
  }

  isLoggedIn() {
    // let jwt = new JwtHelperService();
    if(localStorage.getItem("token") && this.jwt.isTokenExpired()) {
      return true;
    } else return false;
  }

  login(credentials) {
    return this.http
      .post("/api/authenticate", JSON.stringify(credentials))
      .pipe(
        map((response) => {
          if (response && response["token"]) {
            localStorage.setItem("token", response["token"]);
            // let jwt = new JwtHelperService();
            this.currentUser = this.jwt.decodeToken(
              localStorage.getItem("token")
            );
            console.log(this.currentUser);
            return true;
          } else return false;
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: Response) {
    if (error.status === 400) return throwError(new BadInput(error.json()));

    if (error.status === 404) return throwError(new NotFoundError());

    return throwError(new AppError(error));
  }
}
