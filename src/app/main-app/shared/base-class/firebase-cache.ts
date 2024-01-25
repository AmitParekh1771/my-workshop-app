import { AngularFirestoreCollection, AngularFirestoreDocument } from "@angular/fire/compat/firestore";
import { map } from "rxjs/operators";

export class FirebaseCache {

    tokenObj: {
        [key: string]: number
    } = { }

    setToken(id: string, milli: number) {
        this.tokenObj = JSON.parse(localStorage.getItem('CACHE_STAMP') || '{"0": 0}');
        this.tokenObj[id] = milli;
        localStorage.setItem('CACHE_STAMP', JSON.stringify(this.tokenObj));
    }

    getToken(id: string) {
        this.tokenObj = JSON.parse(localStorage.getItem('CACHE_STAMP') || '{"0": 0}');
        if(id in this.tokenObj) return this.tokenObj[id];
        return 0;
    }

    getCachedData<T>(queryDocs: AngularFirestoreCollection<T>) {
        return queryDocs.get({source: 'cache'}).pipe(
            map(docs => docs.docs.map(doc => 
                Object.assign({}, doc.data(), {id: doc.id})  
            ))
        );
    }

    getCachedDocument<T>(queryDocs: AngularFirestoreDocument<T>) {
        return queryDocs.get({source: 'cache'}).pipe(
            map(doc => Object.assign({}, doc.data(), {id: doc.id}))
        );
    }
    

}