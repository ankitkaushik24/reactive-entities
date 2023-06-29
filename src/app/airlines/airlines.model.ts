export interface IAirlineInfo {
  _id: string;
  name: string;
  trips: number;
  airline: {
    _id: string;
    id: number;
    name: string;
    country: string;
    logo: string;
    slogan: string;
    head_quaters: string;
    website: string;
    established: string;
    __v: number;
  }[]
}

export interface IAirlineResponse {
  totalPassengers: number;
  totalPages: number;
  data: IAirlineInfo[];
}
