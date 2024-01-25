import firebase from "firebase/compat/app";


export interface Country {
    "id": number,
    "name": string,
    "iso2": string,
    "iso3"?: string,
    "emoji"?: string,
    "emojiU"?: string
    "native"?: string,
    "capital"?: string,
    "currency"?: string,
    "phonecode"?: string,
}

export interface State {
    "id": number,
    "name": string,
    "iso2": string
    "country_id"?: number,
    "country_code"?: string,
}

export interface City {
    "id": number,
    "name": string
}

import Timestamp = firebase.firestore.Timestamp;

export { Timestamp };