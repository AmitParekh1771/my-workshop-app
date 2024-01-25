import { Item } from './../../models/workshop.model';

import { Component, forwardRef, Input, OnInit } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { FormGroup, FormGroupDirective, NG_VALUE_ACCESSOR } from "@angular/forms";
import { finalize } from "rxjs/operators";
import { SelectItem } from "../../models/select-item.model";
import { UploadService } from "../../services/upload.service";


@Component({
    selector: 'app-workshop-meta',
    templateUrl: './workshop-meta.component.html',
    styleUrls: ['./workshop-meta.component.css'],
    providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => WorkshopMetaComponent),
        multi: true
      }
    ]
})
export class WorkshopMetaComponent 
implements OnInit {
    constructor(
        private uploadService: UploadService,
        private storage: AngularFireStorage,
        private rootFormGroup: FormGroupDirective
    ) { }

    ngOnInit(): void {
        this.metaData = this.rootFormGroup.control.get(this.formGroupName) as FormGroup;    
    }
    
    showMetaEditContainer = false;

    tagList: SelectItem[] = [
        {id: 1, name: "POPULAR"},
        {id: 2, name: "BEST SELLER"},
        {id: 3, name: "TRENDING"}
    ];

    metaData: FormGroup;

    @Input('courseId') courseId: number;

    @Input('formGroupName') formGroupName: string;

    uploadImage(file: File) {
        if(!file) return;

        const previousImage = this.metaData.get('coverImage')?.value as (Item | null);
        if(previousImage && previousImage.uri) {
            this.storage.refFromURL(previousImage.uri).delete().subscribe();
        }

        const path = `${this.courseId}/${file.name}`;

        this.storage.upload(path, file).snapshotChanges().pipe(
            finalize(() => {
                this.storage.ref(path).getDownloadURL()
                .subscribe(url => {
                    if(!url) return;
                    this.metaData.get('coverImage')?.setValue({
                        title: file.name,
                        uri: url,
                        embedUrl: url,
                        duration: 0
                    });
                    this.showMetaEditContainer = false;
                })
            })
        )
        .subscribe()
    }

    uploadVideo(file: File) {
        this.uploadService.createVideo(file, this.uploadService.folderUri)
        .subscribe(this.setCoverVideo.bind(this));
    }

    getVideo(videoUri: string) {
        this.uploadService.getVideo(videoUri)
        .subscribe(this.setCoverVideo.bind(this));
    }

    private setCoverVideo(res: any) {
        if(!res) return;

        this.metaData.get('coverVideo')?.setValue({
            title: res.name,
            uri: res.uri,
            embedUrl: res.player_embed_url,
            duration: res.duration
        });
    }

    
}
