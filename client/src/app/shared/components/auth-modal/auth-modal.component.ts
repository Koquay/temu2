import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth.service';
import { AuthModel } from './auth.model';
import { ToastrService } from 'ngx-toastr';
import { timer } from 'rxjs';

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
  private toastr = inject(ToastrService)
  public verificationCode = '';
  public userVerificationCode = '';
  public confirmPassword = '';

  public signIn = () => {
    console.log(this.authData)

    this.authService.signIn(this.authData).subscribe(user => {
      this.closeModal('signInModal');
      this.authService.emitSignInSuccess();
    })
  }

  public signUp = () => {
    console.log(this.authData)

    this.authService.signUp(this.authData).subscribe(user => {
      this.closeModal('signUpModal');
    })
  }

  onSignUpClick = () => {
    this.openSignUpModal.emit();
  }

  getVerificationCode = () => {
    this.authService.getVerificationCode(this.authData).subscribe((verificationCode) => {
      console.log('verificationCode', verificationCode);
      this.verificationCode = verificationCode as string;
      this.userVerificationCode = '';
      this.toastr.info('Please enter the verification code sent to your email. Code expires in 10 minutes',
        'Verification Code');

      timer(10 * 60 * 1000).subscribe(() => {
        if (this.getCurrentModalId() === 'forgotPasswordModal') {
          this.toastr.warning('Verification code has expired. Please request a new one.', 'Code Expired');
          this.verificationCode = '';
        }
      });
    })
  }

  private getCurrentModalId = (): string | null => {
    const modalEl = document.querySelector('.modal.show') as HTMLElement | null;
    return modalEl ? modalEl.id : null;
  };


  compareVerificationCodes = () => {
    if (this.verificationCode === this.userVerificationCode) {
      this.toastr.success('Verification code matched. You can now sign up.', 'Success');
      this.verificationCode = '';
      this.userVerificationCode = '';
      this.closeModal('forgotPasswordModal');
      this.showdModal('changePasswordModal');
    }
  }

  private closeModal = (modalId: string) => {
    console.log('closeModal called')
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
      modalInstance.hide();
    }
  }

  showdModal = (modalId: string) => {
    console.log('showdModal() called')
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  public changePassword = () => {
    if (this.authData.password !== this.confirmPassword) {
      this.toastr.error('Passwords do not match', 'Error');
      return;
    }

    this.authService.changePassword(this.authData).subscribe(() => {
      this.toastr.success('Password successfully changed.', 'Change Password');
      this.closeModal('changePasswordModal');
    })
  }


}
