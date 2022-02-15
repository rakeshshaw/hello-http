import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { AppError } from "../common/errors/app-error";
import { BadInput } from "../common/errors/bad-input";
import { NotFoundError } from "../common/errors/not-found-error";

@Injectable({
  providedIn: "root",
})
export class OrderService {
  constructor(private http: HttpClient) {}

  getOrders() {
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
    });

    let token = localStorage.getItem("token");
    headers.append("Authorization", "Bearer " + token);

    let options = {
      headers: headers,
    };
    return this.http.get("/api/orders", options).pipe(
      map((response) => {
        // console.log(response['body']);
        const dataArray = response['body'];
        return dataArray;
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
