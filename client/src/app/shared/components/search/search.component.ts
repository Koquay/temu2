import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { ProductSearchService } from '../../../product/product-search/product-search.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  public searchField = '';
  private searchSubject = new Subject<string>();
  private productSearchService = inject(ProductSearchService);

  ngOnInit() {
    this.handleSearch();
  }

  onSearchFieldChanged(value: string) {
    this.searchSubject.next(value);
  }

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

  search = (searchField: string) => {
    this.productSearchService.searchForProducts(searchField);
  }
}
