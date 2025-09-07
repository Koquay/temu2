import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppService } from './app.service';
import { HeaderComponent } from './shared/components/header/header.component';
import { AuthModalComponent } from './shared/components/auth-modal/auth-modal.component';
import { BreadcrumbsComponent } from './shared/components/breadcrumbs/breadcrumbs.component';

declare var bootstrap: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    AuthModalComponent,
    BreadcrumbsComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  title = 'client';
  private appService = inject(AppService);

  constructor() {
    this.appService.restoreStateFromLocalStorage();
  }

  showSignInModal() {
    console.log('AppComponent.showSignInModal() called')
    const modalElement = document.getElementById('signInModal');
    console.log('AppComponent.modalElement', modalElement)
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
}
