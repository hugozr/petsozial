export interface Pet {
    id?: string,
    name: string,
    comment: string,
    human?: string,
    address?: string,
    specie: Specie,
    breed: Breed,
    sex?: string,
    birthday?: Date,
}

interface Specie {
    specieId: string,
    name: string
}

interface Breed {
    breedId: string,
    name: string
}