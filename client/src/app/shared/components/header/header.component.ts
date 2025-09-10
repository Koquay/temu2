import { Component, effect, EventEmitter, inject, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthModel } from '../auth-modal/auth.model';
import { AuthService } from '../auth-modal/auth.service';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    SearchComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Output() openSignInModal = new EventEmitter<void>();
  private authService = inject(AuthService);
  public auth: AuthModel = this.authService.authSignal();
  public searchField = '';


  onSignInClick() {
    this.openSignInModal.emit();
  }

  onSignOutClick = () => {
    this.authService.signOut();
  }

  authEffect = effect(() => {
    this.auth = this.authService.authSignal();
    console.log('HeaderComponent.auth', this.auth)
  })


}
