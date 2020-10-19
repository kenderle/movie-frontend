import { MovieService } from './../shared/services/movie.service';
import { Review } from './../shared/models/review';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Movie } from '../shared/models/movie';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-movies-review-card',
  templateUrl: './movies-review-card.component.html',
  styleUrls: ['./movies-review-card.component.scss']
})
export class MoviesReviewCardComponent implements OnInit, OnChanges {

  @Input() reviews: Review[]
  @Input() movieId: number
  firstReview: Review
  reviewCount: number
  reviewCountString: string
  movie: Movie
  movieImg: string
  movieService: MovieService
  avgMovieRating: number
  private subs = new Subscription()

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges() {
    if (this.reviews && this.reviews.length) {
      this.firstReview = this.reviews[Math.floor(Math.random() * this.reviews.length)]
      this.reviewCount = this.reviews.length
      if (this.reviewCount === 1) {
        this.reviewCountString = `${this.reviewCount} review`
      } else {
        this.reviewCountString = `${this.reviewCount} reviews`
      }
    } else {
      this.reviews = null
      this.reviewCountString = null
      this.reviewCount = 0
    }
  }

  retrieveMovieById(id: number) {
    const params = {
      id: id
    }
    this.subs.add(
      this.movieService.getMovieById(params).subscribe(data => {
        if (data && data.movie && data.reviews) {
          this.movie = new Movie(data.movie)
          this.movieImg = this.movie.image
          this.reviews = data.reviews.map(x => new Review(x))
          if (this.reviews.length) {
            this.computeTheAverageReviewRating(this.reviews)
          }
        }
      }, error => {
        if (error) {
          console.log(error)
        }
      })
    )
  }

  computeTheAverageReviewRating(reviews: Review[]) {
    const totalReviews = reviews.length || 0
    let totalRating = 0
    reviews.forEach(x => {
      totalRating += x.rating
    })
    this.avgMovieRating = ( totalRating / totalReviews )
  }

  setDefaultPic() {
    this.movieImg = 'assets/images/placeholder.png'
  }

  routeToWriteReview() {

  }

  routeToAllReviews() {
    this.router.navigate(['/movies/' + this.movieId + '/reviews'])
  }

}
