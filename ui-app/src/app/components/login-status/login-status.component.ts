import {Component, Inject, OnInit} from '@angular/core';
import {OKTA_AUTH, OktaAuthStateService} from "@okta/okta-angular";
import {OktaAuth} from "@okta/okta-auth-js";

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {
  isAuthenticated: boolean = false;
  userFullName: string = '';
  constructor(private oktaAuthService: OktaAuthStateService,
              @Inject(OKTA_AUTH) private  oktaOAuth: OktaAuth) { }

  ngOnInit(): void {
    this.oktaAuthService.authState$.subscribe(data => {
      this.isAuthenticated = data.isAuthenticated!;
      this.getUserDetails();
    })
  }

  private getUserDetails() {
    if (this.isAuthenticated) {
      this.oktaOAuth.getUser().then((res) => this.userFullName = res.name as string)
    }
  }

  logout(): void {
    this.oktaOAuth.signOut();
  }
}
