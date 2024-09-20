export interface Discography {
    LastUpdated: string;
    Version: number;
    Songs: Song[];
    Albums: Album[];
    Name: string;
}

export interface Song {
    ID: number;
    Title: string;
    Date?: string;

    Description?: string;
    URL?: string;
}

export interface Album {
    ID: number;
    Title: string;
    SongIDs: number[];
    Date: string;

    Description?: string;
    URL?: string;
}
