import { Breed } from "./breed";

export interface Specie {
    id?: string,
    name: string,
    comment?: string,
    order?: number,
    breeds: Breed[]
}