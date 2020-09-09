import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Movie } from '../models/movie';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private movieApi: string;
  constructor(
    private http: HttpClient
  )  {
    this.movieApi = `${environment.apiUrl}api/v1/movies`;
  }

  getAllMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.movieApi}/index`);
  }


}
