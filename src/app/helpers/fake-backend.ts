import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
} from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { delay, mergeMap, materialize, dematerialize } from "rxjs/operators";

// array in local storage for registered users
let users = JSON.parse(localStorage.getItem("users")) || [];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;
    let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1vc2hAZG9tYWluLmNvbSIsInBhc3N3b3JkIjoxMjM0LCJhZG1pbiI6dHJ1ZX0.ItIQkSeIO94BHx5Sjl0TGUvgyAiG1nZfAV13dgiYiTs";
     //"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1vc2hAZG9tYWluLmNvbSIsInBhc3N3b3JkIjoxMjM0LCJhZG1pbiI6ZmFsc2V9.FHdniVAP9AkODrhFGx0M9sP-DTAQJCQ5yGEfklNCVa4";
      

    // wrap in delayed observable to simulate server api call
    return of(null)
      .pipe(mergeMap(handleRoute))
      .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
      .pipe(delay(500))
      .pipe(dematerialize());

    function handleRoute() {
      switch (true) {
        case url.endsWith("/api/authenticate") && method === "POST":
          return authenticate();
        case url.endsWith("/api/register") && method === "POST":
          return register();
        case url.endsWith("/api/orders") && method === "GET":
          return getOrders();
        // case url.match(/\/users\/\d+$/) && method === 'GET':
        //     return getUserById();
        // case url.match(/\/users\/\d+$/) && method === 'PUT':
        //     return updateUser();
        // case url.match(/\/users\/\d+$/) && method === 'DELETE':
        //     return deleteUser();
        default:
          // pass through any requests not handled above
          return next.handle(request);
      }
    }

    

    // route functions

    function authenticate() {
      // const { email, password } = body;
      let body = JSON.parse(request.body);
      console.log("****************", body.email);
      if (body.email === "mosh@domain.com" && body.password === "1234") {
        // connection.mockRespond(new Response(
          return ok({
            email: body.email,
            password: body.password,
            token: token
        });
        // ));
      } else {
        return ok({ status: 200 });
      }

      // const user = users.find(x => x.username === username && x.password === password);
      // if (!user) return error('Username or password is incorrect');
      // return ok({
      //     id: user.id,
      //     username: user.username,
      //     firstName: user.firstName,
      //     lastName: user.lastName,
      //     token: 'fake-jwt-token'
      // })
    }

    function register() {
      const user = body;

      if (users.find((x) => x.username === user.username)) {
        return error('Username "' + user.username + '" is already taken');
      }

      user.id = users.length ? Math.max(...users.map((x) => x.id)) + 1 : 1;
      users.push(user);
      localStorage.setItem("users", JSON.stringify(users));
      return ok();
    }

    function getOrders() {
      //
      // Fake implementation of /api/orders
      //
      if (request.headers.get("Authorization") === "Bearer " + token) {
        return ok({ status: 200, body: [1, 2, 3] });
      } else {
        return unauthorized();
      }
    }

    // function getUserById() {
    //     if (!isLoggedIn()) return unauthorized();

    //     const user = users.find(x => x.id === idFromUrl());
    //     return ok(user);
    // }

    // function updateUser() {
    //     if (!isLoggedIn()) return unauthorized();

    //     let params = body;
    //     let user = users.find(x => x.id === idFromUrl());

    //     // only update password if entered
    //     if (!params.password) {
    //         delete params.password;
    //     }

    //     // update and save user
    //     Object.assign(user, params);
    //     localStorage.setItem('users', JSON.stringify(users));

    //     return ok();
    // }

    // function deleteUser() {
    //     if (!isLoggedIn()) return unauthorized();

    //     users = users.filter(x => x.id !== idFromUrl());
    //     localStorage.setItem('users', JSON.stringify(users));
    //     return ok();
    // }

    // helper functions

    function ok(body?) {
      return of(new HttpResponse({ status: 200, body }));
    }

    function error(message) {
      return throwError({ error: { message } });
    }

    function unauthorized() {
      return throwError({ status: 401, error: { message: "Unauthorised" } });
    }

    function isLoggedIn() {
      return headers.get("Authorization") === "Bearer fake-jwt-token";
    }

    function idFromUrl() {
      const urlParts = url.split("/");
      return parseInt(urlParts[urlParts.length - 1]);
    }
  }
}

export const fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true,
};
