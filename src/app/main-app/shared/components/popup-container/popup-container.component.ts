
import { ApplicationRef, ComponentFactoryResolver, EmbeddedViewRef, Injector, ViewChild, ElementRef } from '@angular/core';
import { Component, ComponentRef, Injectable, OnInit } from '@angular/core';

@Component({
  selector: 'app-popup-confirm',
  templateUrl: './popup-confirm.component.html',
  styleUrls: ['./popup-container.component.css']
})
export class PopupConfirmComponent {

  @ViewChild('confirmationInput') confirmationInput: ElementRef;

  showPopup = false;

  type: string;

  title: string;

  highlightColor: string;

  highlightComplementColor: string;

  confirmMessage: string;

  warningMessage: string;

  callBack: (val: boolean) => void;

  onClose() {
    this.showPopup = false;
    this.callBack(false); 
    (this.confirmationInput.nativeElement as HTMLInputElement).value = '';
  }

  onAction() {
    const val = (this.confirmationInput.nativeElement as HTMLInputElement).value;
    if(val == this.confirmMessage || !this.confirmMessage)
      this.showPopup = false;
    this.callBack(val == this.confirmMessage || !this.confirmMessage);
    (this.confirmationInput.nativeElement as HTMLInputElement).value = '';
  }

}

@Injectable({
  providedIn: 'root'
})
export class PopupConfirmService {
  
  constructor(
    private cfr: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector  
  ) { 
    this.create();
  }

  componentRef: ComponentRef<PopupConfirmComponent>;

  create() {
    this.componentRef = this.cfr
    .resolveComponentFactory(PopupConfirmComponent)
    .create(this.injector);
  
    const componentRootNode = (this.componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

    this.appRef.attachView(this.componentRef.hostView);

    this.componentRef.onDestroy(() => {
      this.appRef.detachView(this.componentRef.hostView);
    });

    document.body.appendChild(componentRootNode);
  }

  open(config: {
    type: string,
    title: string,
    highlightColor: string,
    highlightComplementColor: string,
    confirmMessage: string,
    warningMessage: string,
    callBack: (val: boolean) => void
  }) {
    this.componentRef.instance.showPopup = true;
    this.componentRef.instance.type = config.type;
    this.componentRef.instance.title = config.title;
    this.componentRef.instance.highlightColor = config.highlightColor;
    this.componentRef.instance.highlightComplementColor = config.highlightComplementColor;
    this.componentRef.instance.confirmMessage = config.confirmMessage;
    this.componentRef.instance.warningMessage = config.warningMessage;
    this.componentRef.instance.callBack = config.callBack;

  }

}


@Component({
  selector: 'app-popup-alert',
  templateUrl: './popup-alert.component.html',
  styleUrls: ['./popup-container.component.css']
})
export class PopupAlertComponent {
  constructor() { }

  type: string;

  title: string;

  alertMessage: string;

  showPopup = false;
}

@Injectable({
  providedIn: 'root'
})
export class PopupAlertService {
  constructor(
    private cfr: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) { 
    this.create();
  }

  componentRef: ComponentRef<PopupAlertComponent>;

  create() {
    this.componentRef = this.cfr.resolveComponentFactory(PopupAlertComponent).create(this.injector);

    const componentRootNode = (this.componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

    this.appRef.attachView(this.componentRef.hostView);

    this.componentRef.onDestroy(() => {
      this.appRef.detachView(this.componentRef.hostView);
    });

    document.body.appendChild(componentRootNode);
  }

  
  open(config: {
    type: string,
    title: string,
    alertMessage: string
  }) {
    this.componentRef.instance.showPopup = true;
    this.componentRef.instance.type = config.type;
    this.componentRef.instance.title = config.title;
    this.componentRef.instance.alertMessage = config.alertMessage;
  }
}
