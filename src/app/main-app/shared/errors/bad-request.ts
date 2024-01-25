
import { AppError } from './app-error';

export class BadRequest extends AppError {
    constructor(error?: Response) {
        super(error);
    }
}