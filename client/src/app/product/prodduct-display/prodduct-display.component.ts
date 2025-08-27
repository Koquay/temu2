import { Component } from '@angular/core';
import { ProductGalleryComponent } from '../product-gallery/product-gallery.component';

@Component({
  selector: 'app-prodduct-display',
  standalone: true,
  imports: [
    ProductGalleryComponent
  ],
  templateUrl: './prodduct-display.component.html',
  styleUrl: './prodduct-display.component.scss'
})
export class ProdductDisplayComponent {

}
