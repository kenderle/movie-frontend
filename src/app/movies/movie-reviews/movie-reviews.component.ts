import { MovieService } from './../../shared/services/movie.service';
import { UserService } from './../../shared/services/user.service';
import { Review } from './../../shared/models/review';
import { Movie } from './../../shared/models/movie';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/shared/models/user';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-movie-reviews',
  templateUrl: './movie-reviews.component.html',
  styleUrls: ['./movie-reviews.component.scss']
})
export class MovieReviewsComponent implements OnInit, OnDestroy {

  movie: Movie
  movieImg: string
  avgMovieRating: number
  reviews: Review[] = []
  currentUser: User
  private subs = new Subscription()

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private movieService: MovieService
  ) {
    this.currentUser = this.userService.currentUserValue
  }

  ngOnInit(): void {
    this.route.params.subscribe(movie => {
      if (movie && movie.id) {
        this.retrieveMovie(movie.id)

      }
    })
  }

  ngOnDestroy() {
    this.subs.unsubscribe()
  }

  retrieveMovie(id: number) {
    const params = { id: id }
    this.subs.add(
      this.movieService.getMovieById(params).subscribe(data => {
        if (data) {
          console.log(data)
          this.movie = new Movie(data.movie) // map the return json movie to the movie model
          this.movieImg = this.movie.image // assign the movieImg
          if (data && data.reviews && data.reviews.length) { // check if there are reviews in the return json
            this.reviews = data.reviews.map(x => new Review(x)) // if there are reviews... model them out
            this.computeTheAverageReviewRating(this.reviews)
          } else {
            this.reviews = [] // else set the reviews as empty
            this.avgMovieRating = 0.0
          }
        }
      }, error => {
        if (error) {
          console.error(error)
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
    this.router.navigate(['/reviews/' + this.movie.id + '/new'])

  }

}
