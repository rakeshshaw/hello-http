import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { AppError } from "../common/errors/app-error";
import { BadInput } from "../common/errors/bad-input";
import { NotFoundError } from "../common/errors/not-found-error";

@Injectable({
  providedIn: "root",
})
export class DataService {
  constructor(private http: HttpClient, private url: string) {}

  getAll() {
    return this.http.get(this.url).pipe(
      map((response) => {
        const dataArray = [];
        for (let index in response) {
          console.log(response[index]);
          dataArray.push(response[index]);
        }
        return dataArray;
      }),
      catchError(this.handleError)
    );
  }

  create(resource) {
    return this.http.post(this.url, JSON.stringify(resource)).pipe(
      map((response) => response),
      catchError(this.handleError)
    );
  }

  update(resource) {
    return this.http
      .patch(this.url + "/" + resource.id, JSON.stringify({ isRead: true }))
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

  delete(id) {
    return this.http.delete(this.url + "/" + id).pipe(
      map((response) => response),
      catchError(this.handleError)
    );
  }

  private handleError(error: Response) {
    if (error.status === 400)
      // return Observable.throw(new BadInput(error.json()));
      return throwError(new BadInput(error.json()));

    if (error.status === 404)
      // return Observable.throw(new NotFoundError());
      return throwError(new NotFoundError());

    // return Observable.throw(new AppError(error));
    return throwError(new AppError(error));
  }
}
