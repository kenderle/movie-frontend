import { ReviewService } from './../../shared/services/review.service';
import { MovieService } from './../../shared/services/movie.service';
import { UserService } from './../../shared/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Movie } from './../../shared/models/movie';
import { Review } from './../../shared/models/review';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from 'src/app/shared/models/user';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-review',
  templateUrl: './edit-review.component.html',
  styleUrls: ['./edit-review.component.scss']
})
export class EditReviewComponent implements OnInit, OnDestroy {
  review: Review
  form: FormGroup
  formValues: any
  submitting = false
  hasError = false
  errorMsg: string
  alterrorMsg: string
  currentUser: User
  movie: Movie
  movieImg: string
  // Static Review Ratings List
  reviewRatings = [
    { id: 1, val: 1 },
    { id: 2, val: 2 },
    { id: 3, val: 3 },
    { id: 4, val: 4 },
    { id: 5, val: 5 }
  ]
  isNew = false
  isEdit = false
  private subs = new Subscription()

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private movieService: MovieService,
    private reviewService: ReviewService
  ) {
    this.currentUser = this.userService.currentUserValue
  }

  ngOnInit(): void {
    this.handleSubs()
    this.createFormControls()
    this.createForm()
  }

  handleSubs() {
    this.route.params.subscribe(data => {
      if (data && data.reviewId) {
        this.retrieveReview(data.reviewId)
      }
    })
  }

  createFormControls() {
    this.formValues = {
      starRating: [null, Validators.required],
      body: ['', Validators.required]
    }
  }

  createForm() {
    this.form = this.fb.group(this.formValues)
  }

  retrieveMovie(movieId: any) {
    const params = { id: movieId }
    this.subs.add(
      this.movieService.getMovieById(params).subscribe(data => {
        if (data) {
          this.movie = data.movie
          this.setFormValues()
        }
      }, error => {
        if (error) {
          console.error(error)
        }
      })
    )
  }

  setFormValues() {
    this.form.get('starRating').setValue(this.review.rating)
    this.form.get('body').setValue(this.review.body)
  }


  retrieveReview(reviewId: any) {
    const params = { id: reviewId }
    this.subs.add(
      this.reviewService.getReviewById(params).subscribe((data: Review) => {
        if (data) {
          this.review = data
          if (this.review.movie_id) {
            this.retrieveMovie(this.review.movie_id)
          }
        }
      }, error => {
        if (error) {
          console.error(error)
        }
      })
    )
  }

  updateReview() {
    this.submitting = true
    if (this.form.invalid || !this.currentUser || !this.movie || !this.review) {
      this.hasError = true
      this.submitting = false
      return
    }
    const form = this.form.value
    const params = {
      review_id: this.review.id,
      user_id: this.currentUser.id,
      movie_id: this.movie.id,
      user_nickname: this.currentUser.nickname,
      rating: form.starRating,
      body: form.body
    }
    this.subs.add(
      this.reviewService.updateReview(params).subscribe(data => {
        if (data) {
          this.submitting = false
          Swal.fire({
            icon: 'success',
            title: 'Your review has been successfully updated!',
            showConfirmButton: false,
            timer: 2000
          }).then(() => {
            this.router.navigate([`movies/${this.movie.id}/reviews`])
          })
        }
      }, error => {
        if (error) {
          this.hasError = true
          this.submitting = false
          console.error(error)
        }
      })
    )
  }


  setDefaultPic() {
    this.movieImg = 'assets/images/placeholder.png'
  }

  ngOnDestroy() {
    this.subs.unsubscribe()
  }


}
