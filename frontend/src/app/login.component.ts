import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div>
      <h2>Connexion</h2>
      <form (submit)="onSubmit()">
        <label>Username: <input [(ngModel)]="username" name="username"/></label><br/>
        <label>Password: <input type="password" [(ngModel)]="password" name="password"/></label><br/>
        <button type="submit">Se connecter</button>
      </form>
      <div *ngIf="message">{{message}}</div>
    </div>
  `
})
export class LoginComponent {
  username = '';
  password = '';
  message = '';

  constructor(private auth: AuthService) {}

  onSubmit() {
    this.auth.login(this.username, this.password).subscribe({
      next: res => this.message = 'Connecté',
      error: err => this.message = 'Erreur de connexion'
    });
  }
}
