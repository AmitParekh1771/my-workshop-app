import { Upload, DetailedError } from 'tus-js-client';


export class UploadFile {
    upload: Upload;
    videoUri: string;
    bytesSent: number = 0;
    bytesTotal: number = 0;
    errMessage: string = '';
    isPaused: boolean = false;
    isComplete: boolean = false;

    constructor(upload: Upload, videoUri: string) {
        this.upload = upload;
        this.videoUri = videoUri;
        this.upload.options.onProgress = (bytesSent: number, bytesTotal: number) => {
            this.bytesSent = bytesSent;
            this.bytesTotal = bytesTotal;
        }
        this.upload.options.onSuccess = () => {
            this.isComplete = true;
        }
        this.upload.options.onError = (err: Error | DetailedError) => {
            this.isPaused = true;
            this.errMessage = err.message;
        }
    }
}