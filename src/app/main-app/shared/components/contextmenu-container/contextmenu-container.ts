import { 
  Subject, 
  merge 
} from 'rxjs';
import { 
  AfterViewInit, 
  ChangeDetectorRef, 
  ElementRef 
} from '@angular/core';
import { CodeInsertionDirective } from './code-insertion.directive';
import { 
  Component, 
  ComponentFactoryResolver, 
  ApplicationRef, 
  Injector, 
  ComponentRef, 
  Injectable, 
  EmbeddedViewRef, 
  OnDestroy, 
  ViewChild 
} from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { ContextmenuConfig } from './contextmenu-config';
import { ContextmenuInjector } from './contextmenu-injector';
import { ContextmenuRef } from './contextmenu-ref';

@Component({
  selector: 'app-contextmenu-container',
  templateUrl: './contextmenu-container.component.html',
  styleUrls: ['./contextmenu-container.component.css']
})
export class ContextmenuContainerComponent 
implements AfterViewInit, OnDestroy {

  @ViewChild(CodeInsertionDirective) 
  insertionPoint: CodeInsertionDirective;

  constructor(
    private cfr: ComponentFactoryResolver, 
    private cd: ChangeDetectorRef,
    private el: ElementRef
  ) { 
    window.addEventListener('scroll', this.closeContextMenu.bind(this));
  }

  ngAfterViewInit(): void {
    this.loadComponent(this.childComponentType);
    this.setPosition();
    this.cd.detectChanges();
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.closeContextMenu.bind(this));
    if(this.childComponentRef)
      this.childComponentRef.destroy();
  }

  private readonly _onClose = new Subject<null>();
  onClose = this._onClose.asObservable();

  configStyles: {
    color?: string,
    backgroundColor?: string,
    padding?: string,
    maxWidth?: string,
    minWidth?: string
  };

  childComponentRef: ComponentRef<any>;

  childComponentType: ComponentType<any>;

  loadComponent(componentType: ComponentType<any>) {
    const factory = this.cfr.resolveComponentFactory(componentType);

    this.insertionPoint.vcr.clear();
    this.childComponentRef = this.insertionPoint.vcr.createComponent(factory);
  }

  closeContextMenu() {
    this._onClose.next();
  }
  
  position: {x: number, y: number} = {x: 0, y: 0};
  
  setPosition() {
    let container = this.el.nativeElement.querySelector('.context-menu-container') as HTMLDivElement;

    if(!container)
      return;

    let rightOffset = document.documentElement.clientWidth - this.position.x;
    let bottomOffset = document.documentElement.clientHeight - this.position.y;

    let elementRect = container.getBoundingClientRect();

    if(rightOffset < elementRect.width)
      container.style.right = rightOffset + 'px';
    else
      container.style.left = this.position.x + 'px';

    if(bottomOffset < elementRect.height)
      container.style.bottom = bottomOffset + 'px';
    else
      container.style.top = this.position.y + 'px';    
  }


}

@Injectable()
export class ContextmenuService {
  constructor(
    private cfr: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}

  componentRef: ComponentRef<ContextmenuContainerComponent>;

  private appendComponentToBody<K, L>(config: ContextmenuConfig<K>) {
    const factory = this.cfr.resolveComponentFactory(ContextmenuContainerComponent);

    const map = new WeakMap();
    map.set(ContextmenuConfig, config.data);

    const contextmenuRef = new ContextmenuRef<L>();
    map.set(ContextmenuRef, contextmenuRef);

    this.componentRef = factory.create(new ContextmenuInjector(this.injector, map));

    this.appRef.attachView(this.componentRef.hostView);

    const domElem = (this.componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    return contextmenuRef;
  }

  private removeComponentFromBody() {
    this.appRef.detachView(this.componentRef.hostView);
    this.componentRef.destroy();
  }

  open<T, K, L>(component: ComponentType<T>, config: ContextmenuConfig<K>) {
    const contextmenuRef = this.appendComponentToBody<K, L>(config);
    
    const {data, clientX, clientY, ...configStyles} = config;
    
    this.componentRef.instance.childComponentType = component;
    this.componentRef.instance.configStyles = configStyles;
    this.componentRef.instance.position = {
      x: clientX, 
      y: clientY
    };

    const sub = merge(
      this.componentRef.instance.onClose, 
      contextmenuRef.close$
    )
    .subscribe(() => {
      this.removeComponentFromBody();
      sub.unsubscribe();
    });

    return contextmenuRef.change$;
  }


}