export interface ILike{
    likerId:string;
    likedUserId:string;
  }
  //dumy
 export interface ILikeProfile {
    id:string;
    name: string;
    dateOfBirth: string;
    place: string;
    profilePhotos: string[];
  }

  export interface ILikeProfiles {
    id: string;
    name: string;
    image: string[];
    age: string | number | Date;
    place: string;
  }
  
  export interface IMatchProfile {
    id: string;
    name: string;
    image: string[];
    age: string | number | Date;
    place: string;
  }
  
  
  export interface ILikesCount{
    count: number
  }

 export interface ILikeResponse {
    match: boolean;
    message: string;
  }