export interface Pet {
    id?: string,
    name: string,
    comment: string,
    human?: any,
    address?: string,
    specie: Specie,
    breed: Breed,
    gender?: string,
    birthday?: Date,
    petImage?: any,
    zone?: any,
}

interface Specie {
    specieId: string,
    name: string
}

interface Breed {
    breedId: string,
    name: string
}