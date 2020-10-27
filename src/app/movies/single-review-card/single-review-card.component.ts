import { UserService } from './../../shared/services/user.service';
import { Router } from '@angular/router';
import { Review } from './../../shared/models/review';
import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-single-review-card',
  templateUrl: './single-review-card.component.html',
  styleUrls: ['./single-review-card.component.scss']
})
export class SingleReviewCardComponent implements OnInit {

  @Input() review: Review
  currentUser: User
  constructor(
    private router: Router,
    private userService: UserService
  ) {
    this.currentUser = this.userService.currentUserValue
  }

  ngOnInit(): void {
  }

  routeToEditReview() {
    this.router.navigate([`reviews/${this.review.id}/edit`])
  }

}
