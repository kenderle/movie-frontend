import { ReviewService } from './../../shared/services/review.service';
import { MovieService } from './../../shared/services/movie.service';
import { UserService } from './../../shared/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Movie } from './../../shared/models/movie';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from 'src/app/shared/models/user';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-edit-review',
  templateUrl: './add-edit-review.component.html',
  styleUrls: ['./add-edit-review.component.scss']
})
export class AddEditReviewComponent implements OnInit, OnDestroy {

  form: FormGroup
  formValues: any
  submitting = false
  hasError = false
  hasAltError = false
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
    private movieSerivce: MovieService,
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
      if (data && data.id) {
        this.retrieveMovie(data.id)
      }
    })
  }

  retrieveMovie(id: number) {
    const params = { id: id }
    this.subs.add(
      this.movieSerivce.getMovieById(params).subscribe(data => {
        if (data && data.movie) {
          this.movie = data.movie
          if (this.movie.image) {
            this.movieImg = this.movie.image
          } else {
            this.movieImg = null
          }
        }
      }, error => {
        if (error) {
          console.error(error)
        }
      })
    )
  }

  setDefaultPic() {
    this.movieImg = 'assets/images/placeholder.png'
  }

  createFormControls() {
    this.hasError = false
    this.hasAltError = false
    this.formValues = {
      starRating: [null, Validators.required],
      body: ['', Validators.required, Validators.minLength(25)]
    }
  }

  createForm() {
    this.form = this.fb.group(this.formValues)
  }

  submitForm() {
    this.hasError = false
    this.submitting = true
    if (this.formValues.body.length < 25) {
      this.hasError = true
      this.submitting = false
      this.errorMsg = "Review must be at least 25 characters long."
      return
    }
    if (this.form.invalid) {
      this.hasError = true
      this.submitting = false
      return
    }
    const form = this.form.value
    const params = {
      user_id: this.currentUser.id,
      movie_id: this.movie.id,
      user_nickname: this.currentUser.nickname,
      rating: form.starRating,
      body: form.body
    }
    this.subs.add(
      this.reviewService.createReview(params).subscribe(data => {
        if (data) {
          this.submitting = false
          Swal.fire(
            {
              icon: 'success',
              title: 'You\'re a bonafide movie critic!!!',
              showConfirmButton: false,
              timer: 2000
            }
          ).then(() => {
            this.router.navigate([`./movies/${this.movie.id}/reviews`])
          })
        }
      }, error => {
        if (error) {
          console.error(error)
          this.submitting = false
          this.hasError = true
          this.errorMsg = 'Something went wrong while trying to create a review.'
        }
      })
    )
  }

  cancel() {
    this.router.navigate([`./movies/${this.movie.id}`])
  }

  ngOnDestroy() {
    this.subs.unsubscribe()
  }

}
