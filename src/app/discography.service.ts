import { Injectable } from '@angular/core';
import { Discography } from './models/Discography';

@Injectable({
  providedIn: 'root',
})
export class DiscographyService {
  public readonly key: string = 'discography';
  constructor() {}

  public getDiscography(): Discography {
    const data = localStorage.getItem(this.key);
    if (data !== null) return <Discography>JSON.parse(data);
    return { LastUpdated: '', Version: 0, Songs: [], Albums: [], };
  }
  public saveDiscography(discography: Discography): void {
    discography.Version++;
    discography.LastUpdated = new Date().toISOString();
    localStorage.setItem(this.key, JSON.stringify(discography));
  }
}
