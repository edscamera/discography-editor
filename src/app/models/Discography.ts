export interface Discography {
    LastUpdated: string;
    Version: number;
    Songs: Song[];
    Albums: Album[];
}

export interface Song {
    ID: number;
    Title: string;
}

export interface Album {
    ID: number;
    Title: string;
    SongIDs: number[];
}
