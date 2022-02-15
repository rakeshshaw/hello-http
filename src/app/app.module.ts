import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { GithubFollowersComponent } from "./components/github-followers/github-followers.component";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { PostsComponent } from "./components/posts/posts.component";
import { DataService } from "./services/data.service";
import { GithubFollowersService } from "./services/github-followers.service";
import { AppErrorHandlers } from "./common/errors/app-error-handler";
import { HomeComponent } from "./components/home/home.component";
import { ArchiveComponent } from "./components/archive/archive.component";
import { NotFoundComponent } from "./components/not-found/not-found.component";
import { RouterModule } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { SignupComponent } from "./components/signup/signup.component";
import { NoAccessComponent } from "./components/no-access/no-access.component";
import { AdminComponent } from "./components/admin/admin.component";
// used to create fake backend
import { fakeBackendProvider } from "./helpers/fake-backend";
import { FormsModule } from "@angular/forms";
import { AuthGuard } from "./services/auth-guard.service";
import { AuthService } from "./services/auth.service";
import { JwtHelperService, JwtModule } from "@auth0/angular-jwt";
import { AdminAuthGuard } from "./services/admin-auth-guard.service";
import { OrderService } from "./services/order.service";
// import { JwtInterceptor, ErrorInterceptor } from './helpers/fake-backend';

@NgModule({
  declarations: [
    AppComponent,
    GithubFollowersComponent,
    PostsComponent,
    HomeComponent,
    ArchiveComponent,
    NotFoundComponent,
    LoginComponent,
    SignupComponent,
    NoAccessComponent,
    AdminComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: "", component: HomeComponent },
      { path: "admin", component: AdminComponent, canActivate: [AuthGuard, AdminAuthGuard] },
      { path: "login", component: LoginComponent },
      { path: "no-access", component: NoAccessComponent },
      { path: "archive/:year/:month", component: ArchiveComponent },
      { path: "**", component: NotFoundComponent },
    ]),
    JwtModule.forRoot({ config: { tokenGetter: tokenGetter } }),
  ],
  providers: [
    DataService,
    GithubFollowersService,
    OrderService,
    AuthService,
    AuthGuard,
    AdminAuthGuard,
    JwtHelperService,
    // { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    // provider used to create fake backend
    fakeBackendProvider,
    { provide: ErrorHandler, useClass: AppErrorHandlers },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

export function tokenGetter() {
  return localStorage.getItem("token");
}
