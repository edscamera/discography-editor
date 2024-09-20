import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Album, Discography, Song } from './models/Discography';
import { DiscographyService } from './discography.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(private discographyService: DiscographyService) {
    this.options = this.discographyService.getOptions();
  }

  public selectedSong: Song | null = null;
  public selectedAlbum: Album | null = null;
  public SelectionType = SelectionType;
  public selectedType: SelectionType = SelectionType.Song;

  public options: string[] = [];

  public discography: Discography | null = null;

  //#region Song Logic
  public addSong(): void {
    if (this.discography === null) return;
    const ID = this.getNewId(this.discography.Songs.map((s) => s.ID));
    const newSong: Song = { Title: `Song #${ID}`, ID };
    this.discography.Songs.push(newSong);
    this.discographyService.saveDiscography(this.discography);
    this.selectSong(newSong);
  }
  public selectSong(song: Song): void {
    this.selectedAlbum = null;
    this.selectedType = SelectionType.Song;
    this.selectedSong = structuredClone(song);
  }
  public saveSong(song: Song): void {
    if (this.discography === null) return;
    const index = this.discography.Songs.findIndex((s) => s.ID === song.ID);
    if (index === -1) return;
    this.discography.Songs[index] = song;
    this.discographyService.saveDiscography(this.discography);
  }
  public deleteSong(song: Song): void {
    if (this.discography === null) return;
    if (!confirm('Are you sure you want to delete this song?')) return;
    this.discography.Songs = this.discography.Songs.filter(
      (s) => s.ID !== song.ID,
    );
    this.discography.Albums.forEach((album) => {
      album.SongIDs = album.SongIDs.filter((id) => id !== song.ID);
    });
    this.discographyService.saveDiscography(this.discography);
    this.selectedSong = null;
  }
  //#endregion
  //#region Album Logic
  public selectAlbum(album: Album): void {
    this.selectedSong = null;
    this.selectedType = SelectionType.Album;
    this.selectedAlbum = structuredClone(album);
  }
  public addAlbum(): void {
    if (this.discography === null) return;
    const ID = this.getNewId(this.discography.Albums.map((a) => a.ID));
    const newAlbum: Album = {
      Title: `Album #${ID}`,
      ID,
      SongIDs: [],
      Date: '',
      Description: '',
    };
    this.discography.Albums.push(newAlbum);
    this.discographyService.saveDiscography(this.discography);
    this.selectAlbum(newAlbum);
  }
  public saveAlbum(album: Album): void {
    if (this.discography === null) return;
    const index = this.discography.Albums.findIndex((s) => s.ID === album.ID);
    if (index === -1) return;
    this.discography.Albums[index] = album;
    this.discographyService.saveDiscography(this.discography);
  }
  public deleteAlbum(album: Album): void {
    if (this.discography === null) return;
    if (!confirm('Are you sure you want to delete this album?')) return;
    this.discography.Albums = this.discography.Albums.filter(
      (s) => s.ID !== album.ID,
    );
    this.discographyService.saveDiscography(this.discography);
    this.selectedAlbum = null;
  }
  //#endregion

  public getSongById(id: number): Song | null {
    if (this.discography === null) return null;
    return this.discography.Songs.find((s) => s.ID === id) ?? null;
  }

  public addSongToAlbum(songId: string, album: Album): void {
    if (!Number.isInteger(parseInt(songId))) return;
    album.SongIDs.push(parseInt(songId));
  }

  public getAlbumsBySongId(songID: number): Album[] {
    if (this.discography === null) return [];
    return this.discography.Albums.filter((a) => a.SongIDs.includes(songID));
  }

  //#region Discography Logic
  public newDiscog(name: string): void {
    this.discography = this.discographyService.newDiscography(name);
    this.options = this.discographyService.getOptions();
  }
  public loadDiscog(name: string): void {
    this.discography = this.discographyService.getDiscography(name);
    this.options = this.discographyService.getOptions();
  }
  public deleteDiscog(): void {
    if (
      !confirm('Are you sure you want to delete this discography?') ||
      !this.discography
    )
      return;
    this.discographyService.deleteDiscography(this.discography.Name);
    this.discography = null;
    this.options = this.discographyService.getOptions();
  }
  public importDiscog(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async () => {
      if (input.files === null) return;
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result !== 'string') return;
        const data = <Discography>JSON.parse(reader.result);
        this.discographyService.importDiscography(data);
        this.options = this.discographyService.getOptions();
      };
      reader.readAsText(file);
    };
    input.click();
  }
  public exportDiscog(): void {
    if (this.discography === null) return;
    const data = JSON.stringify(this.discography);
    const a = document.createElement('a');
    const file = new Blob([data], { type: 'application/json' });
    a.href = URL.createObjectURL(file);
    a.download = `${this.discography.Name}.json`;
    a.click();
  }
  //#endregion

  public getNewId(ids: number[]): number {
    return Math.max(...ids, 0) + 1;
  }
  public openURL(url: string): void {
    window.open(url, '_blank', 'norefferer');
  }
}

enum SelectionType {
  None,
  Song,
  Album,
}
