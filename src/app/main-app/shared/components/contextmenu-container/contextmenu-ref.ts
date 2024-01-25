import { Subject } from "rxjs";

export class ContextmenuRef<T> {
    private readonly _change$ = new Subject<T>();
    change$ = this._change$.asObservable();

    emit(val: T) {
        this._change$.next(val);
    }

    private readonly _close$ = new Subject<boolean>();
    close$ = this._close$.asObservable();

    close() {
        this._close$.next(true);
    }
}