export function makImagePath(id: string, format?:string){
    return `https://image.tmdb.org/t/p/${format?format:"original"}/${id}`
}

export enum Types {
    "now_playing" = "now_playing",
    "popular" = "popular",
    "top_rated" = "top_rated",
    "upcoming" = "upcoming",
}

export enum tvTypes {
    "airing_today" = "airing_today",
    "popular" = "popular",
    "on_the_air" = "on_the_air",
    "top_rated" = "top_rated",
}