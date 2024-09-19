import { Component, OnInit } from '@angular/core';
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
export class AppComponent implements OnInit {
  constructor(private discographyService: DiscographyService) {}

  public selectedSong: Song | null = null;
  public selectedAlbum: Album | null = null;
  public SelectionType = SelectionType;
  public selectedType: SelectionType = SelectionType.Song;

  public discography: Discography | null = null;
  public ngOnInit(): void {
    this.discography = this.discographyService.getDiscography();
  }

  public addSong(): void {
    if (this.discography === null) return;
    const ID = this.getNewSongID();
    this.discography.Songs.push({ Title: `Song #${ID}`, ID });
    this.selectedSong =
      structuredClone(this.discography.Songs.find((s) => s.ID === ID)) ?? null;
    this.discographyService.saveDiscography(this.discography);
  }

  public selectSong(song: Song): void {
    this.selectedAlbum = null;
    this.selectedType = SelectionType.Song;
    this.selectedSong = structuredClone(song);
  }
  public getNewSongID(): number {
    if (this.discography === null) return 0;
    return Math.max(...this.discography.Songs.map((s) => s.ID), 0) + 1;
  }
  public getNewAlbumID(): number {
    if (this.discography === null) return 0;
    return Math.max(...this.discography.Albums.map((s) => s.ID), 0) + 1;
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
    this.discography.Albums.forEach(album => {
      album.SongIDs = album.SongIDs.filter(id => id !== song.ID);
    });
    this.discographyService.saveDiscography(this.discography);
    this.selectedSong = null;
  }

  public selectAlbum(album: Album): void {
    this.selectedSong = null;
    this.selectedType = SelectionType.Album;
    this.selectedAlbum = structuredClone(album);
  }
  public addAlbum(): void {
    if (this.discography === null) return;
    const ID = this.getNewAlbumID();
    this.discography.Albums.push({ Title: `Album #${ID}`, ID, SongIDs: [] });
    this.selectedAlbum =
      structuredClone(this.discography.Albums.find((s) => s.ID === ID)) ?? null;
    this.discographyService.saveDiscography(this.discography);
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

  public getSong(id: number): Song | null {
    if (this.discography === null) return null;
    return this.discography.Songs.find((s) => s.ID === id) ?? null;
  }

  public addSongToAlbum(songId: string, album: Album): void {
    album.SongIDs.push(parseInt(songId));
  }

  public getAlbums(songID: number): Album[] {
    if (this.discography === null) return [];
    return this.discography.Albums.filter((a) => a.SongIDs.includes(songID));
  }
}

enum SelectionType {
  None,
  Song,
  Album,
}
