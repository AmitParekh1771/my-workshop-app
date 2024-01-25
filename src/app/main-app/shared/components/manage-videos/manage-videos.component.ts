import { ContextmenuRef } from './../contextmenu-container/contextmenu-ref';
import { ContextmenuConfig } from './../contextmenu-container/contextmenu-config';
import { UploadService } from './../../services/upload.service';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import Utils from '../../utils/utility-function';
import { ContextmenuService } from '../contextmenu-container/contextmenu-container';

@Component({
  selector: 'app-manage-videos',
  templateUrl: './manage-videos.component.html',
  styleUrls: ['./manage-videos.component.css']
})
export class ManageVideosComponent implements OnInit {

  constructor(
    private uploadService: UploadService,
    private contextmenuService: ContextmenuService
  ) { }

  @Input('courseId') courseId: number;

  ngOnInit(): void {
    this.uploadService.getAllVideos(this.uploadService.folderUri)
    .subscribe(res => this.videos = res!.data);

    this.uploadService.change$.pipe(
      switchMap(res => {
        if(res.action == 'added') return this.uploadService.getVideo(res.uri).pipe(map(res => this.videos.splice(0, 0, res)));

        const index = this.videos.findIndex(video => video.uri == res.uri);
        if(res.action == 'removed') this.videos.splice(index, 1);

        if(res.action == 'refreshed') return this.uploadService.getVideo(res.uri).pipe(map(res => this.videos.splice(index, 1, res)));

        return of(null);
      }))
      .subscribe();
  }

  videos: any[] = [];

  addVideo($event: Event) {
    const file = ($event.target as HTMLInputElement).files?.item(0);
    if(!file) return;

    this.uploadService.createVideo(file, this.uploadService.folderUri).subscribe();
  }

  onContextmenu($event: MouseEvent) {
    const item = Utils.selectElement($event.target as HTMLElement, item => item.hasAttribute('data-video-uri'));

    if(!item) return;

    $event.stopImmediatePropagation();
    $event.preventDefault();

    const videoUri = item.getAttribute('data-video-uri') || '';
    const embedUrl = item.getAttribute('data-embed-url') || '';

    this.contextmenuService.open(ManageVideosContextmenuComponent, {
      clientX: $event.clientX,
      clientY: $event.clientY,
      maxWidth: '200px',
      minWidth: '150px',
      padding: '0px',
      backgroundColor: '#fff',
      data: {videoUri, embedUrl}
    });

  }

  copyToClipboard() {
    navigator.clipboard.writeText(`${this.courseId}`);
  }

}

@Component({
  selector: 'app-manage-videos-contextmenu',
  template: `
    <div class="contextmenu-block">
      <div class="contextmenu-item" (click)="refresh()">Refresh</div>
      <div class="contextmenu-item" (click)="copyToClipboard(data.videoUri)">Copy Uri</div>
      <div class="contextmenu-item" (click)="copyToClipboard(data.embedUrl)">Copy Embed url</div>
      <div class="contextmenu-item delete-bg" (click)="delete()">Delete</div>
    </div>
  `,
  styles: [`
    .contextmenu-item {
      color: #333;
      display: block;
      padding: 0.7em 1.4em;
      text-align: center;
      cursor: pointer;
    }
    .contextmenu-item:hover {
      background-color: #f6f6f6;
    }
    .delete-bg {
      color: #fff;
      background-color: #b00020;
    }
    .delete-bg:hover {
      background-color: #96001b;
    }
  `]
})
export class ManageVideosContextmenuComponent {

  constructor(
    @Inject(ContextmenuConfig)
    public data: {videoUri: string, embedUrl: string},
    @Inject(ContextmenuRef)
    private contextmenuRef: ContextmenuRef<any>,
    private uploadService: UploadService
  ) { }

  refresh() {
    this.uploadService.change$.next({
      uri: this.data.videoUri,
      action: 'refreshed'
    });
    this.close();
  }

  copyToClipboard(val: string) {
    navigator.clipboard.writeText(val);
    this.close();
  }

  delete() {
    this.uploadService.deleteVideo(this.data.videoUri).subscribe();
    this.close();
  }

  close() {
    this.contextmenuRef.close();
  }


}
