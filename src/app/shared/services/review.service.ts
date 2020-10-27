import { Review } from './../models/review';
import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private reviewApi: string

  constructor(
    private http: HttpClient
  ) {
    this.reviewApi = `${environment.apiUrl}api/v1/reviews`
  }

  getAllReviews() {
    return this.http.get<any>(`${this.reviewApi}/index`)
  }

  getReviewById(params): Observable<Review> {
    return this.http.get<Review>(`${this.reviewApi}/show?id=${params.id}`)
  }

  createReview(params) {
    return this.http.post<any>(`${this.reviewApi}/create`, params)
  }

  updateReview(params) {
    return this.http.patch<any>(`${this.reviewApi}/update`, params)
  }

  deleteReview(params) {
    return this.http.delete<any>(`${this.reviewApi}/${params.id}`)
  }
}
