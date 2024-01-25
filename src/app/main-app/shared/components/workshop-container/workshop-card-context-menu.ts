import { PopupAlertService, PopupConfirmService } from './../popup-container/popup-container.component';
import { ContextmenuRef } from './../contextmenu-container/contextmenu-ref';
import { ContextmenuConfig } from './../contextmenu-container/contextmenu-config';
import { ContextmenuService } from './../contextmenu-container/contextmenu-container';
import { WorkshopService } from './../../services/workshop.service';
import { 
    AfterViewInit, 
    Component, 
    Directive, 
    ElementRef, 
    Inject, 
    OnDestroy
} from "@angular/core";
import { STATUS } from 'src/assets/data/status';
import { Status } from '../../models/workshop.model';
import Utils from '../../utils/utility-function';


@Component({
    selector: 'app-workshop-card-context-menu',
    templateUrl: './workshop-card-context-menu.component.html',
    styleUrls: ['./workshop-card-context-menu.component.css']
})
export class WorkshopCardContextMenuComponent {
    constructor(
        @Inject(ContextmenuConfig)
        public data: {
            wid: string,
            status: Status,
            title: string
        },
        @Inject(ContextmenuRef)
        private contextmenuRef: ContextmenuRef<any>,
        private workshopService: WorkshopService,
        private popupAlert: PopupAlertService,
        private popupConfirm: PopupConfirmService
    ) { }

    updateStatus(status: Status) {
        if(status.id == this.data.status.id) return;

        this.workshopService.updateWorkshop(`workshops/${this.data.wid}`, {status});
        this.contextmenuRef.close();
    }

    launchAgain() {
        this.workshopService.launchAgain(this.data.wid)
        .then(docId => {
            this.popupAlert.open({
                type: 'Launch',
                title: 'Launching Again',
                alertMessage: 'This workshop will launch again with same courseId but different workshopId. You can see it in archived section. All your content will be preserved. You can edit it later.'
            });
        });
        this.contextmenuRef.close();
    }

    deleteWorkshop() {
        if(this.data.status.id != 2) {
            this.popupAlert.open({
                type: 'BAD REQUEST',
                title: 'Bad Request',
                alertMessage: "Can't delete non archived workshop. Please archive workshop before deleting."
            });
        }
        
        this.popupConfirm.open({
            type: 'Delete',
            title: 'Delete Confirmation',
            highlightColor: '#b00020',
            highlightComplementColor: '#fff',
            confirmMessage: this.data.title,
            warningMessage: 'Are you sure! You want to delete workshop?',
            callBack: (val: boolean) => {
                if(!val) return;
        
                this.workshopService.deleteWorkshop(this.data.wid)
                .catch(err => {
                    this.popupAlert.open({
                    type: 'ERROR',
                    title: 'ERROR',
                    alertMessage: err.message
                    });
                })
            }
        });
        this.contextmenuRef.close();
    }

    selectItems: Status[] = STATUS;
}

@Directive({
    selector: '[statusChange]'
})
export class StatusChangeDirective implements AfterViewInit, OnDestroy {
    constructor(
        private el: ElementRef,
        private contextMenuService: ContextmenuService    
    ) { }

    ngAfterViewInit(): void {
        (this.el.nativeElement as HTMLElement).addEventListener('contextmenu', this.contextMenuEvent.bind(this));
    }

    ngOnDestroy(): void {
        (this.el.nativeElement as HTMLElement).removeEventListener('contextmenu', this.contextMenuEvent.bind(this));
    }

    contextMenuEvent($event: MouseEvent) {
        $event.stopImmediatePropagation();
        $event.preventDefault();

        const item = Utils.selectElement($event.target as HTMLElement | null, (item: HTMLElement) => item.tagName == 'APP-WORKSHOP-CARD');

        if(!item) return;

        let wid = item.getAttribute('data-workshop-id')!;
        let statusId = +item.getAttribute('data-status-id')!;
        let title = item.getAttribute('data-title')!;

        let status: Status;

        switch(statusId) {
            case 1: {
                status = {id: 1, name: 'ACTIVE'};
                break;
            }
            case 3: {
                status = {id: 3, name: 'COMPLETED'};
                break;
            }
            default: {                
                status = {id: 2, name: 'ARCHIVED'};
                break;
            }
        }

        this.contextMenuService.open(WorkshopCardContextMenuComponent, {
            clientX: $event.clientX,
            clientY: $event.clientY,
            padding: '0px',
            backgroundColor: '#fff',
            minWidth: 'unset',
            maxWidth: 'unset',
            data: {
                wid,
                status,
                title
            }
        });
    }
}
