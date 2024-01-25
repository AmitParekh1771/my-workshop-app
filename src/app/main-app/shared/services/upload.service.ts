import { AppModule } from './../../../app.module';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseApi } from '../base-class/base-api';
import { environment } from 'src/environments/environment';
import { DetailedError, Upload } from 'tus-js-client';
import { map, switchMap, shareReplay } from 'rxjs/operators';
import { UploadFile } from '../models/upload-file.model';

@Injectable({
  providedIn: AppModule
})
export class UploadService extends BaseApi {

  constructor(http: HttpClient) { 
    super(http)
  }

  folderUri: string = '/users/1234/projects/1234';

  change$ = new Subject<{
    uri: string,
    action: 'added' | 'removed' | 'refreshed'
  }>();

  uploads$ = new Subject<UploadFile[]>();

  uploads: UploadFile[] = [];

  vimeoHeaders = new HttpHeaders()
  .set('Authorization', `Bearer ${environment.vimeoToken}`)
  .set('Content-Type', 'application/json')
  .set('Accept', 'application/vnd.vimeo.*+json;version=3.4');

  createVideo(video: File, folderUri: string): Observable<any> {
    const url = `https://api.vimeo.com/me/videos`;
    const body = {
      name: video.name,
      upload: {
        approach: 'tus',
        size: video.size
      }
    };
    
    return this.post<any, any>(url, body, {headers: this.vimeoHeaders}).pipe(
      switchMap(res => {
        let upload = this.createUpload(video, res.upload.upload_link);
        this.resumeOrStartUpload(upload, res.uri)

        return this.update<null, any>(`https://api.vimeo.com${folderUri}${res.uri}`, null, {headers: this.vimeoHeaders}).pipe(map(() => {
          this.change$.next({
            uri: res.uri,
            action: 'added'
          });
          return res;
        }));
      })
    );
  }

  getVideo(videoUri: string) {
    const url = `https://api.vimeo.com${videoUri}`;
    return this.get<any>(url, {headers: this.vimeoHeaders});
  }

  private _allVideos: {
    [key: string]: Observable<any>
  } = { };

  getAllVideos(folderUri: string) {
    if(folderUri in this._allVideos) return this._allVideos[folderUri];
    this._allVideos[folderUri] = new BehaviorSubject<void>(undefined);

    const url = `https://api.vimeo.com${folderUri}/videos`;
    return this._allVideos[folderUri] = this.get<any>(url, {headers: this.vimeoHeaders}).pipe(
      shareReplay(1)
    );
  }

  deleteVideo(videoUri: string): Observable<any> {
    const url = `https://api.vimeo.com${videoUri}`;
    return this.delete<any>(url, {headers: this.vimeoHeaders}).pipe(map(() => {
      this.change$.next({
        uri: videoUri,
        action: 'removed'
      });
      return videoUri;
    }));
  }

  createFolder(name: string): Observable<string> {
    const url = "https://api.vimeo.com/me/projects";

    const body = { name };

    return this.post<any, any>(url, body, {headers: this.vimeoHeaders}).pipe(
      map(res => this.folderUri = res.uri || "/users/1234/projects/1234")
    );
  }

  deleteFolder(folderUri: string) {
    const url = `https://api.vimeo.com${folderUri}?should_delete_clips=true`;
    return this.delete<any>(url, {headers: this.vimeoHeaders});
  }

  createUpload(
    file: File,
    url: string
  ): Upload { 
    return new Upload(file, {
      uploadUrl: url,
      metadata: {
        name: file.name,
        type: file.type,
        size: `${file.size}`
      },
      removeFingerprintOnSuccess: true,
      storeFingerprintForResuming: true,
      chunkSize: 5242880,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      onShouldRetry: (error, retryAttempt, option) => {
        const errResponse = (error as DetailedError).originalResponse;
        const status = errResponse ? errResponse.getStatus() : 0;
        if(status == 403) return false;
        return true;
      }
    });
  }

  resumeOrStartUpload(upload: Upload, videoUri: string) {
    const index = this.uploads.findIndex(upload => upload.videoUri == videoUri);

    upload.findPreviousUploads()
      .then(previousUploads => {
        if(previousUploads.length)
          upload.resumeFromPreviousUpload(previousUploads[0]);
        
        if(index == -1) {
          this.uploads.push(new UploadFile(upload, videoUri));
          this.uploads$.next(this.uploads);  
        }
        
        upload.start();
      });
  }

  pauseUpload(uploadFile: UploadFile, terminate: boolean) {
    const index = this.uploads.findIndex(upload => uploadFile.videoUri == upload.videoUri);

    if(!uploadFile.isComplete)
      uploadFile.upload.abort(terminate);

    if(terminate) {
      this.uploads.splice(index, 1);
      this.uploads$.next(this.uploads);
    }
    
  }


}
