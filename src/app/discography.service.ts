import { Injectable } from '@angular/core';
import { Discography } from './models/Discography';

@Injectable({
  providedIn: 'root',
})
export class DiscographyService {
  public readonly prefix: string = 'discography.';
  public selected: string | null = null;
  constructor() {}

  public saveDiscography(discography: Discography): void {
    discography.Version++;
    discography.LastUpdated = new Date().toISOString();
    localStorage.setItem(`${this.prefix}${this.selected}`, JSON.stringify(discography));
  }
  public getOptions(): string[] {
    return Object.keys(localStorage).filter(x => x.startsWith("discography.")).map(x => x.replace("discography.", ""));
  }
  public getDiscography(name: string): Discography | null {
    const data = localStorage.getItem(`${this.prefix}${name}`);
    if (data !== null) {
      this.selected = name;
      return <Discography>JSON.parse(data);
    }
    alert("This discography does not exist.");
    return null;
  }
  public newDiscography(name: string): Discography {
    if (localStorage.getItem(`${this.prefix}${name}`)) alert("This discography already exists.");
    const discog: Discography = { LastUpdated: '', Version: 0, Songs: [], Albums: [], Name: name };
    this.selected = name;
    this.saveDiscography(discog);
    return discog;
  }
  public deleteDiscography(name: string): void {
    localStorage.removeItem(`${this.prefix}${name}`);
  }
  public importDiscography(discog:Discography) {
    localStorage.setItem(`${this.prefix}${discog.Name}`, JSON.stringify(discog));
    alert("Discography imported.");
  }
}
