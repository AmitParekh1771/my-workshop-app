import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ContextmenuConfig } from './../contextmenu-container/contextmenu-config';
import { UploadService } from './../../services/upload.service';
import { 
  AfterViewInit, 
  Component,   
  Directive, 
  DoCheck,  
  forwardRef, 
  Inject,  
  Input,  
  IterableDiffer, 
  IterableDiffers, 
  OnDestroy, 
  OnInit, 
  ViewContainerRef 
} from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { BaseControlValueAccessor } from "../../base-class/base-control-value-accessor";
import { Content, Item } from "../../models/workshop.model";
import { ContextmenuService } from '../contextmenu-container/contextmenu-container';
import { ContextmenuRef } from '../contextmenu-container/contextmenu-ref';
import Utils from '../../utils/utility-function';
import { finalize } from 'rxjs/operators';


@Directive({
  selector: '[contentEdit]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ContentEditDirective),
      multi: true
    }
  ]
})
export class ContentEditDirective 
extends BaseControlValueAccessor<Content[]> 
implements OnInit, AfterViewInit, DoCheck, OnDestroy {
  
  constructor(
    private iterableDiffers: IterableDiffers,
    private viewContainerRef: ViewContainerRef,
    private contextmenu: ContextmenuService
  ) { 
    super();
  }

  @Input('courseId') courseId: number;

  ngOnInit(): void {
    this.blockDiffer = this.iterableDiffers.find(this.blocks).create();
    this.contentItemDiffer = this.iterableDiffers.find(this.contentItems).create();
  }

  ngAfterViewInit(): void {
    this.el = this.viewContainerRef.element.nativeElement as HTMLElement;
    
    this.el.addEventListener('mousedown', this.mouseDownEvent.bind(this));
    
    window.addEventListener('mouseup', this.mouseUpEvent.bind(this));
    
    this.el.addEventListener('mousemove', this.mouseMoveEvent.bind(this));

    this.el.addEventListener('contextmenu', this.contextMenuEvent.bind(this));

    this.getAll();

    this.apply((item: HTMLDivElement) => {
      this.itemSetUp(item);
    });

    this.addSegmentAddContainer();
  }

  ngDoCheck(): void {
    this.getAll();

    let blockChange = this.blockDiffer.diff(this.blocks);
    if(blockChange) {
      blockChange.forEachAddedItem((record) => {
        this.itemSetUp(record.item);
      });
    }

    let contentItemChange = this.contentItemDiffer.diff(this.contentItems);
    if(contentItemChange) {
      contentItemChange.forEachAddedItem((record) => {
        this.itemSetUp(record.item);
      });
    } 
  }

  ngOnDestroy(): void {
    this.el.removeEventListener('mousedown', this.mouseDownEvent.bind(this));
    
    window.removeEventListener('mouseup', this.mouseUpEvent.bind(this));
    
    this.el.removeEventListener('mousemove', this.mouseMoveEvent.bind(this));

    this.el.removeEventListener('contextmenu', this.contextMenuEvent.bind(this));

    this.addSegmentDiv.removeEventListener('click', this.pushSegment.bind(this));
  }

  el: HTMLElement;

  addSegmentDiv: HTMLElement;

  blockDiffer: IterableDiffer<HTMLDivElement>;

  contentItemDiffer: IterableDiffer<HTMLDivElement>;

  blocks: Array<HTMLDivElement> = [];

  contentItems: Array<HTMLDivElement> = [];

  mouseStart: number = 0;

  movementDown: boolean = true;

  mouseDownElement: HTMLElement | null;

  hoveredDiv: HTMLElement | null;

  getAll() {
    this.blocks = Array.from(this.viewContainerRef.element.nativeElement.querySelectorAll('[data-block-type]'));
    
    this.contentItems = Array.from(this.viewContainerRef.element.nativeElement.querySelectorAll('[data-content-type]'));
  }

  apply(callBack: any) {
    for(let block of this.blocks)
      callBack(block);
    
    for(let contentItem of this.contentItems)
      callBack(contentItem);
  }

  itemSetUp(item: HTMLElement) {
    item.style.position = 'relative';

    item.style.cursor = 'default';

    item.style.transition = 'all 0.3s cubic-bezier(0.215, 0.610, 0.355, 1)';
  }

  addSegmentAddContainer() {
    this.addSegmentDiv = document.createElement('div');
    this.addSegmentDiv.classList.add('add-segment-container');

    let span = document.createElement('span');
    span.append('');
    span.classList.add('svg');
    let text = document.createTextNode(' Add Segment');

    this.addSegmentDiv.appendChild(span);
    this.addSegmentDiv.appendChild(text);
    this.addSegmentDiv.addEventListener('click', this.pushSegment.bind(this));
    this.el.appendChild(this.addSegmentDiv);
  }

  pushSegment() {
    this.value!.push(new Content('SEGMENT'));
    this.onChange(this.value);
  }

  contextMenuEvent($event: MouseEvent) {
    $event.preventDefault();
    $event.stopImmediatePropagation();
    
    const item = Utils.selectElement($event.target as HTMLElement | null, (item: HTMLElement) => item.hasAttribute('data-content-type') || item.hasAttribute('data-block-type'));
    
    if(!item) return;

    let contentIndex = item.getAttribute('data-content-index');
    let blockIndex = item.getAttribute('data-block-index');

    this.contextmenu.open<
    ContextMenuComponent, 
    {
      blockIndex: string | null, 
      contentIndex: string | null, 
      content: Content[] | null,
      courseId: number
    }, Content[] | null>
    (ContextMenuComponent, {
      clientX: $event.clientX,
      clientY: $event.clientY,
      data: {
        blockIndex,
        contentIndex,
        content: this.val,
        courseId: this.courseId
      }
    }).subscribe(res => this.onChange(res));
  }

  mouseDownEvent($event: MouseEvent) {
    const item = Utils.selectElement($event.target as HTMLElement | null, (item: HTMLElement) => item.hasAttribute('data-content-type') || item.hasAttribute('data-block-type'));

    if(!item) return;
    
    item.style.zIndex = '2';
    item.style.transform = 'scale(1.03) translateY(0px)';
    item.style.outline = '2px solid #333';
    item.style.background = 'linear-gradient(135deg, rgba(246, 246, 246, 1) 30%, rgba(207, 207, 207, 1) 70%)';
    item.style.boxShadow = 'rgba(83, 83, 83, 0.5) 0px 30px 60px 0px';

    this.mouseStart = $event.clientY;
    this.mouseDownElement = item;

  }

  mouseUpEvent($event: MouseEvent) {
    if(!this.mouseDownElement) return;

    this.mouseDownElement.style.zIndex = 'auto';
    this.mouseDownElement.style.transform = 'scale(1) translateY(0px)';
    this.mouseDownElement.style.outline = 'unset';
    this.mouseDownElement.style.background = 'linear-gradient(135deg, rgba(246, 246, 246, 0) 30%, rgba(207, 207, 207, 0) 70%)';
    this.mouseDownElement.style.boxShadow = 'rgba(83, 83, 83, 0) 0px 0px 60px 0px';
    
    this.displace();
    this.mouseDownElement = null;
    if(this.hoveredDiv) {
      this.hoveredDiv.classList.remove('highlight-border-top');
      this.hoveredDiv.classList.remove('highlight-border-bottom');
      this.hoveredDiv = null;
    }
  }

  mouseMoveEvent($event: MouseEvent) {
    if(!this.mouseDownElement) return;

    if(this.hoveredDiv) {
      this.hoveredDiv.classList.remove('highlight-border-top');
      this.hoveredDiv.classList.remove('highlight-border-bottom');
      this.hoveredDiv = null;
    }

    const item = Utils.selectElement($event.target as HTMLElement | null, (item: HTMLElement) => item != this.mouseDownElement && this.hasSameType(item, this.mouseDownElement!));

    if(!item) return;
    
    if($event.clientY < this.mouseStart) {
      item.classList.add('highlight-border-top');
      item.classList.remove('highlight-border-bottom');
      this.movementDown = false;
    }
    else {
      item.classList.add('highlight-border-bottom');
      item.classList.remove('highlight-border-top');
      this.movementDown = true;
    }
    this.hoveredDiv = item;
  }

  hasSameType(a: HTMLElement, b: HTMLElement) {
    if((a.hasAttribute('data-block-type') && b.hasAttribute('data-block-type')) ||
    (a.hasAttribute('data-content-type') && b.hasAttribute('data-content-type')))
      return true;
    return false;
  }

  displace() {
    if(this.mouseDownElement && this.hoveredDiv) {
      let srcContentIndex = this.mouseDownElement.getAttribute('data-content-index') || '0';
      let srcBlockIndex = this.mouseDownElement.getAttribute('data-block-index') || '0';

      let destContentIndex = this.hoveredDiv.getAttribute('data-content-index') || '0';

      let destBlockIndex = this.hoveredDiv.getAttribute('data-block-index') || '0';

      if(this.mouseDownElement.hasAttribute('data-content-type')) {
        let element = this.value![+srcBlockIndex].content!.splice(+srcContentIndex, 1);

        if(srcBlockIndex != destBlockIndex && this.movementDown)
        destContentIndex = `${+destContentIndex + 1}`;

        this.value![+destBlockIndex].content!.splice(+destContentIndex, 0, ...element);
      }
      else {
        let element = this.value!.splice(+srcBlockIndex, 1);

        this.value!.splice(+destBlockIndex, 0, ...element);
      }
      
      this.onChange(this.value);
    }
  }
  
}
  

@Component({
  selector: 'app-workshop-context-menu',
  templateUrl: './workshop-context-menu.component.html',
  styleUrls: ['./workshop-context-menu.component.css']
})
export class ContextMenuComponent {
  constructor(
    @Inject(ContextmenuConfig)
    private data: {
      blockIndex: string | null,
      contentIndex: string | null,
      courseId: number,
      content: Content[] | null
    },
    @Inject(ContextmenuRef)
    private contextmenuRef: ContextmenuRef<Content[] | null>,
    private uploadService: UploadService,
    private storage: AngularFireStorage
  ) { }

  
  get contextMenuItem() {
    if(this.data.contentIndex)
      return this.data.content![+this.data.blockIndex!].content![+this.data.contentIndex!];
    return this.data.content![+this.data.blockIndex!];
  }

  set contextMenuItem(val: Content) {
    if(this.data.contentIndex)
      this.data.content![+this.data.blockIndex!].content![+this.data.contentIndex!] = val;
    else
      this.data.content![+this.data.blockIndex!] = val;
  }

  insert(item: string) {
    let addContent = new Content(item);
        
    if(this.data.contentIndex) 
      this.data.content![+this.data.blockIndex!].content!.splice(+this.data.contentIndex! + 1, 0, addContent);
    else if(item != 'SEGMENT')
      this.data.content![+this.data.blockIndex!].content!.splice(0, 0, addContent);
    else
      this.data.content!.splice(+this.data.blockIndex! + 1, 0, addContent);
    
    this.emitChange();
    this.close();
  }

  remove() {
    if(this.data.contentIndex) {
      this.data.content![+this.data.blockIndex!].content!.splice(+this.data.contentIndex!, 1);
    }
    else
      this.data.content!.splice(+this.data.blockIndex!, 1);
    
    this.emitChange();
    this.close();
  }

  uploadVideo(file: File) {
    this.uploadService.createVideo(file, this.uploadService.folderUri)
    .subscribe(this.setContentVideo.bind(this))
  }
  
  getVideo(videoUri: string) {
    this.uploadService.getVideo(videoUri)
    .subscribe(this.setContentVideo.bind(this));
  }

  private setContentVideo(res: any) {
    if(!res) return;

    this.contextMenuItem.item = {
      title: res.name,
      uri: res.uri,
      embedUrl: res.player_embed_url,
      duration: res.duration
    };

    this.emitChange();
    this.close();
  }
  
  uploadFile(file: File) {
    if(!file) return;

    const previousImage = this.contextMenuItem.item;
    if(previousImage && previousImage.embedUrl) {
      this.storage.refFromURL(previousImage.embedUrl).delete().subscribe();
    }

    const path = `${this.data.courseId}/${file.name}`;

    this.storage.upload(path, file).snapshotChanges().pipe(
      finalize(() => {
        this.storage.ref(path).getDownloadURL()
        .subscribe(this.setFile.bind(this))
      })
    )
    .subscribe()
  }

  setFile(url: string) {
    if(!url) return;
    this.contextMenuItem.item.uri = url;
    this.contextMenuItem.item.embedUrl = url;
    this.emitChange();
    this.close();
  }

  emitChange() {
    this.contextmenuRef.emit(this.data.content);
  }

  close() {
    this.contextmenuRef.close();
  }

}
