import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[createRatingStars]',
  standalone: true
})
export class CreateRatingStarsDirective {
  @Input() set createRatingStars(rating:number) {
    this.generateRatingStars(rating)
  }  

  constructor(
    private elRef: ElementRef<HTMLElement>,
    private renderer:Renderer2) { }


    private generateRatingStars = (rating:number) => {

      const nativeElement: HTMLElement = this.elRef.nativeElement;
      let clonedNode;
  
      Array.from(nativeElement.childNodes).forEach(node => {
        Array.from(node.childNodes).forEach(childNode => {        
          this.renderer.removeChild(node, childNode);
        })             
      })
  
      clonedNode = nativeElement.childNodes[0].cloneNode(true);          
      const ratingSpan = this.renderer?.createElement('span');
  
      this.createStars(ratingSpan, rating, 'primary-color')
      this.createStars(ratingSpan, 5-rating, '#888898')
  
      clonedNode.appendChild(ratingSpan);
  
      this.renderer.appendChild(nativeElement, clonedNode)
    }
  
  
    private createStars = (ratingSpan:any, noOfStars:number, color:string) => {
      for(let i = 0; i < (noOfStars); i++) {
        const ratingIcon = this.renderer?.createElement('i');
        this.renderer.addClass(ratingIcon, "fa")
        this.renderer.addClass(ratingIcon, "fa-star")
  
        if(color === 'primary-color') {
          this.renderer.addClass(ratingIcon, color)  
        } else {
          this.renderer.setStyle(ratingIcon, "color", color); 
        }
            
        this.renderer?.appendChild(ratingSpan, ratingIcon);    
      
      }
    }
}
