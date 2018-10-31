import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Hero } from './hero';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { };

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  };

  private heroesUrl = 'api/heroes';

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log('Got All The Heroes!')),
        catchError(this.handleError('getHeroes', []))
      );
  };

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url)
      .pipe(
        tap(_ => this.log(`Got The Hero At ID #${id}`)),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
  };

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, httpOptions)
      .pipe(
        tap(_ => this.log(`Updated Hero With ID #${hero.id}`)),
        catchError(this.handleError<any>(`updateHero`))
      );
  };

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, httpOptions)
      .pipe(
        tap(_ => this.log(`Added Hero with ID #${hero.id}`)),
        catchError(this.handleError<Hero>(`addHero`))
      );
  };

  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, httpOptions)
      .pipe(
        tap(_ => this.log(`Deleted Hero with ID #${id}`)),
        catchError(this.handleError<Hero>(`deleteHero`))
      );
  };

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`OPERATION: ${operation}. ||| STATUS TEXT: ${error.statusText}`);
      return of(result as T);
    };
  };

  

};
