import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent {
  // tripId: string = -1;

  constructor (private route: ActivatedRoute) {
    // this.route.params.subscribe(params => {
    //   if (params) this.tripId = params["id"];
    // })
  }

  
}
