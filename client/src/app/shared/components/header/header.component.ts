import { Component, effect, EventEmitter, inject, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
// import { AuthService } from '../auth-modal/auth.service';
// import { AuthModel } from '../auth-modal/auth.model';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { AuthModel } from '../auth-modal/auth.model';
import { AuthService } from '../auth-modal/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Output() openSignInModal = new EventEmitter<void>();
  private authService = inject(AuthService);
  // private productSearchService = inject(ProductSearchService);
  public auth: AuthModel = this.authService.authSignal();
  public searchField = '';
  private searchSubject = new Subject<string>();

  ngOnInit() {
    this.handleSearch();
  }

  onSignInClick() {
    this.openSignInModal.emit();
  }

  authEffect = effect(() => {
    this.auth = this.authService.authSignal();
    console.log('HeaderComponent.auth', this.auth)
  })

  private handleSearch() {
    this.searchSubject.pipe(
      distinctUntilChanged(),
      debounceTime(600)
    ).subscribe(searchField => {
      if (searchField) {
        console.log('searchField', searchField);

        this.search(searchField)
      } else {
        // this.clearSearchbox();
      }

    });
  }

  onSearchFieldChanged(value: string) {
    this.searchSubject.next(value);
  }

  search = (searchField: string) => {
    // this.productSearchService.searchForProducts(searchField);

    // if (searchField) {
    //   this.showSearchResult = true;
    // } else {
    //   this.showSearchResult = false;
    // }
  }
}
