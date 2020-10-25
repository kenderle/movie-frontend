import Swal from 'sweetalert2';
import { environment } from './../../../environments/environment';
import { UserService } from './../../shared/services/user.service';
import { map } from 'rxjs/operators';
import { Review } from './../../shared/models/review';
import { Movie } from './../../shared/models/movie';
import { MovieService } from './../../shared/services/movie.service';
import { Component, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { User } from 'src/app/shared/models/user';
import { HttpClient } from '@angular/common/http';
import { HTTPOptions } from 'aws-sdk/lib/config-base';

@Component({
  selector: 'app-single-movie',
  templateUrl: './single-movie.component.html',
  styleUrls: ['./single-movie.component.scss']
})
export class SingleMovieComponent implements OnInit, OnDestroy {

  movie: Movie
  movieImg: string
  reviews: Review[]
  avgMovieRating = 0.0
  currentUser: User
  private movieApi: string
  private http: HttpClient
  private httpOptions: HTTPOptions
  private subs = new Subscription()

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private userService: UserService,
    private router: Router
  ) {
    this.currentUser = this.userService.currentUserValue
    this.movieApi = `${environment.apiUrl}api/v1/movies`
  }

  ngOnInit(): void {
    this.route.params.subscribe(movie => {
      if (movie && movie.id) {
        this.retrieveMovieById(movie.id)
      }
    })
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
    this.avgMovieRating = Math.round((totalRating / totalReviews) * 2) / 2
  }

  setDefaultPic() {
    this.movieImg = 'assets/images/placeholder.png'
  }

  routeToWriteReview() {
    this.router.navigate([`reviews/${this.movie.id}/new`])
  }

  editMovie() {
    const params = {
      title: this.movie.title,
      description: this.movie.description,
      releaseDate: this.movie.release_date,
      rating: this.movie.parental_rating,
      totalGross: this.movie.total_gross,
      duration: this.movie.duration,
      cast: this.movie.cast,
      director: this.movie.director
    }
    this.subs.add(
      this.movieService.editMovie(params).subscribe(data => {
        if (data) {
          debugger
        }
      }, error => {
        if (error) {
          console.error(error)
        }
      })
    )
  }

  deleteMovie(id: number) {
    this.subs.add(
      this.movieService.deleteMovie(id).subscribe(data => {
        if (data) {
          Swal.fire(
            {
              icon: 'success',
              title: 'You\'ve successfully deleted a movie!',
              showConfirmButton: false,
              timer: 2000
            }
          ).then(() => {
            this.router.navigate([`movies/`])
          })
        }
      }, error => {
        if (error) {
          console.error(error)
        }
      })
    )

  }

  ngOnDestroy() {
    this.subs.unsubscribe()
  }

}
