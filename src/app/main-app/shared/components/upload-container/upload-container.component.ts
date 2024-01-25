import { UploadService } from './../../services/upload.service';
import { Component, OnInit } from '@angular/core';
import { UploadFile } from '../../models/upload-file.model';

@Component({
  selector: 'app-upload-container',
  templateUrl: './upload-container.component.html',
  styleUrls: ['./upload-container.component.css']
})
export class UploadContainerComponent implements OnInit {

  collapse = false;

  constructor(public uploadService: UploadService) { }

  ngOnInit(): void { }

  pauseOrResume(uploadFile: UploadFile, terminate: boolean) {
    if(uploadFile.isPaused && !terminate) {
      this.uploadService.resumeOrStartUpload(uploadFile.upload, uploadFile.videoUri);
      uploadFile.isPaused = false;
      return;
    }

    if(!uploadFile.isComplete && terminate)
      this.uploadService.deleteVideo(uploadFile.videoUri).subscribe();

    uploadFile.isPaused = true;
    this.uploadService.pauseUpload(uploadFile, terminate);
  
  }

  toggle(item: HTMLElement) {
    this.collapse = !this.collapse;
    item.style.height = this.collapse ? '0px' : '200px';
  }
}
