import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth.service';
import { AuthModel } from './auth.model';

declare var bootstrap: any;


@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.scss'
})
export class AuthModalComponent {
  public authService = inject(AuthService);
  public authData: AuthModel = this.authService.authSignal();
  @Output() openSignUpModal = new EventEmitter<void>();

  public signIn = () => {
    console.log(this.authData)

    this.authService.signIn(this.authData).subscribe(user => {
      this.closeSignUpModal('signInModal');
    })
  }

  public signUp = () => {
    console.log(this.authData)

    this.authService.signUp(this.authData).subscribe(user => {
      this.closeSignUpModal('signUpModal');
    })
  }

  onSignUpClick() {
    this.openSignUpModal.emit();
  }

  private closeSignUpModal = (modalId: string) => {
    console.log('closeSignUpModal called')
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
      modalInstance.hide();
    }
  }
}
