import {Component, Input, OnInit} from '@angular/core';
import {MenuComponent} from '../menu/menu.component';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {trigger, transition, animate, style, state} from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('slideNext', [
      state('true', style({transform: 'translateX(100%)', opacity: 0})),
      state('false', style({transform: 'translateX(0)', opacity: 1})),
      transition('0 => 1', animate('500ms', style({transform: 'translateX(0)', opacity: 1 }))),
      transition('1 => 1', animate('500ms', style({transform: 'translateX(100%)', opacity: 1 }))),
    ]),

    trigger('slidePrev', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('700ms ease-in', style({ transform: 'translateX(0%)', opacity: 1 }))
      ]),

      transition(':leave', [
        style({ transform: 'translateX(0%)', opacity: 1 }),
        animate('0ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {
  linklist: any;
  openedLinks = true;
  openedLinkList: any;
  isLoggedIn: boolean;
  isMobileView = false;
  urlRegex = /^(?![^\n]*\.$)(?:https?:\/\/)?(?:(?:[2][1-4]\d|25[1-5]|1\d{2}|[1-9]\d|[1-9])(?:\.(?:[2][1-4]\d|25[1-5]|1\d{2}|[1-9]\d|[0-9])){3}(?::\d{4})?|[a-z\-]+(?:\.[a-z\-]+){2,})$/;
  urlString: string;
  linkCounter: number;
  currentPage: any;
  currentPageID: string;
  infoString: string;
  foundLink: boolean;
  usersList: any;
  frameID: any;
  urlExample: any;
  iFrameUrl: SafeResourceUrl;
  prev: any;
  current: any;
  next: any;
  nextFrame: any;
  prevFrame: any;
  prevLink: any;
  nextLink: any;

  constructor(private sanitizer: DomSanitizer) {
    this.checkDevice();

    if (localStorage.getItem('users') === null){
      localStorage.setItem('users', '[]');
    }
    if (localStorage.getItem('currentList') === null){
      localStorage.setItem('currentList', '[]');
    }
    if (localStorage.getItem('linkList') === null){
      localStorage.setItem('linkList', '[]');
    }
    if (localStorage.getItem('openedPages') === null){
      localStorage.setItem('openedPages', '[]');
    }
    if (localStorage.getItem('activePage') === null){
      localStorage.setItem('activePage', '');
    }
  }

  ngOnInit(): void {
    localStorage.setItem('openedPages', '[]');
    this.frameID = 1001;
    if (localStorage.getItem('nextFrameID') === null){
      localStorage.setItem('nextFrameID', this.frameID);
    } else{
      this.frameID = localStorage.getItem('nextFrameID');
    }
    this.foundLink = false;
    if (this.linkCounter === null || this.linkCounter < 0){
      localStorage.setItem('linkCounter', '0');
    }
    if (localStorage.getItem('isLoggedIn') === null){
      localStorage.setItem('isLoggedIn', 'false');
      this.infoString = localStorage.getItem('isLoggedIn');
    }
    this.linklist = JSON.parse(localStorage.getItem('currentList'));

    const sessionBool = Boolean(this.infoString);
    this.isLoggedIn = sessionBool;
    this.linkCounter = Number(localStorage.getItem('linkCounter'));

    // TODO check for openedPages and reopen them
    this.reopenPages();
  }

  reopenPages(): void{
    if (localStorage.getItem('openedPages') !== '[]' && localStorage.getItem('openedPages') !== null){
      const openedPages = JSON.parse(localStorage.getItem('openedPages'));
      localStorage.setItem('openedPages', '[]');
      for (let i = 0; i < openedPages.length; i++) {
        // alert(openedPages[i].link);
        this.openPage(openedPages[i].link);
      }
    }
    return;
  }

  openPage(link: string): void {
    const openedList = JSON.parse(localStorage.getItem('openedPages'));
    this.currentPage = link;
    this.openedLinks = true;
    let httplink;
    // alert(link);
    if ((link.includes('http://') === false && (link.includes('https://') === false))){
      httplink = 'https://' + link;
    } else {
      httplink = link;
    }

    this.iFrameUrl = this.sanitizer.bypassSecurityTrustResourceUrl(link);
    const iFrame = document.createElement('iframe');
    iFrame.id = 'frame' + this.frameID;
    this.currentPageID = iFrame.id;
    // alert(this.currentPageID);
    iFrame.src = httplink;
    iFrame.classList.add('frame');

    document.getElementById('frames').appendChild(iFrame);
    this.linkCounter++;
    localStorage.setItem('linksOpened', JSON.stringify(this.linkCounter));
    this.frameID++;
    localStorage.setItem('nextFrameID', this.frameID);
    const newOpening = {
      id: iFrame.id,
      link: httplink};
    const openedPages = JSON.parse(localStorage.getItem('openedPages'));
    openedPages.push(newOpening);
    localStorage.setItem('openedPages', JSON.stringify(openedPages));
    localStorage.setItem('activePage', iFrame.id);

    // hide previous frame
    if (this.linkCounter > 0){
      const currentActive = String(localStorage.getItem('activePage'));
      // alert(currentActive);
      const res = currentActive.replace('frame', '');
      const resNum = Number(res);
      const lastNum = resNum - 1;
      if (document.getElementById('frame' + lastNum)){
        const lastFrame = document.getElementById('frame' + lastNum);
        // alert(lastFrame.id);
        lastFrame.classList.add('frame-hidden');
      }
    }
    return;
  }

  deleteLink(link: string): void {
    if (this.isLoggedIn !== true){
      return;
    }
    let list = JSON.parse(localStorage.getItem('currentList'));
    list = list.filter(obj => obj !== link);
    localStorage.setItem('currentList', JSON.stringify(list));
    return;
  }

  checkDevice(): boolean{
    if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      this.isMobileView = true;
      return this.isMobileView;
    } else{
      this.isMobileView = false;
      return this.isMobileView;
    }
    return this.isMobileView;
  }

  validateInput(url): void {
    this.urlString = url.toString();
    if (this.urlString.match(this.urlRegex)){
      this.addLink(url);
      return;
    } else if (this.urlString === ''){
      alert('Add a valid url in the input field!');
      return;
    }
    alert('e.g: www.google.com');
    return;
  }

  closePage(): void {
    // delete the openedPage array element on close
    const currentPage = localStorage.getItem('activePage');
    // alert(currentPage);
    const openedList = JSON.parse(localStorage.getItem('openedPages'));
    for (let i = 0; i < openedList.length; i++){
      if (openedList[i].id === currentPage){
          openedList.splice(i, 1);
      }
    }
    localStorage.setItem('openedPages', JSON.stringify(openedList));

    // TODO POST request needed to be sent to server, if online mode?????
    // }
    // alert(this.currentPageID);
    const iframe = document.getElementById(this.currentPageID);
    iframe.parentNode.removeChild(iframe);
    this.linkCounter = this.linkCounter - 1;
    localStorage.setItem('linksOpened', JSON.stringify(this.linkCounter));
    if (this.linkCounter === 0) {
      location.reload();
    } else {
      this.setNewActivePage();
    }
    return;
  }

  setNewActivePage(): void{
    const openedPages = JSON.parse(localStorage.getItem('openedPages'));
    // alert(openedPages);
    let thisOne: string;
    let thisLink: string;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < openedPages.length; i++){
      if (openedPages[i] != null){
        thisOne = openedPages[i].id;
        thisLink = openedPages[i].link;
        break;
      }
    }
    // alert(thisOne);
    const newActive = document.getElementById(thisOne);
    newActive.classList.add('frame-active');
    localStorage.setItem('activePage', thisOne);
    this.currentPage = thisLink;
    this.currentPageID = thisOne;
  }

  prevPage(): void {
    const currentFrame = localStorage.getItem('activePage');
    const openedList = JSON.parse(localStorage.getItem('openedPages'));
    // alert(JSON.stringify(openedList));
    if (JSON.parse(localStorage.getItem('linksOpened')) > 1) {
      for (let i = 0; i < openedList.length; i++) {
        // alert(typeof(openedList[i + 1]));
        if (openedList[i].id === currentFrame){
          if (typeof(openedList[i - 1]) !== 'undefined'){
            this.prevFrame = openedList[i - 1].id;
            this.prevLink = openedList[i - 1].link;
            break;
          } else {
            this.prevFrame = openedList[openedList.length - 1].id;
            this.prevLink = openedList[openedList.length - 1].link;
            break;
          }
        }
      }
      // let's hide the current frame, show the new frame, set new active frame on localstorage, add the animations, return
      this.current = document.getElementById(currentFrame);
      this.prev = document.getElementById(this.prevFrame);
      // TODO trigger animations here
      this.current.classList.add('frame-hidden');
      this.current.classList.remove('frame-active');
      // TODO and here
      this.prev.classList.remove('frame-hidden');
      this.prev.classList.add('frame-active');
      localStorage.setItem('activePage', this.prev.id);
      this.currentPage = this.prevLink;
    }
    return;
  }

  nextPage(): void {
    const currentFrame = localStorage.getItem('activePage');
    const openedList = JSON.parse(localStorage.getItem('openedPages'));
    if (JSON.parse(localStorage.getItem('linksOpened')) > 1) {
      for (let i = 0; i < openedList.length; i++) {
          // alert(typeof(openedList[i + 1]));
          if (openedList[i].id === currentFrame){
            if (typeof(openedList[i + 1]) !== 'undefined'){
              this.nextFrame = openedList[i + 1].id;
              this.nextLink = openedList[i + 1].link;
              break;
            } else {
              this.nextFrame = openedList[0].id;
              this.nextLink = openedList[0].link;
              break;
            }
          }
      }
      // let's hide the current frame, show the new frame, set new active frame on localstorage, add the animations, return
      this.current = document.getElementById(currentFrame);
      this.next = document.getElementById(this.nextFrame);
      // TODO trigger animations here
      this.current.classList.remove('frame-active');
      this.current.classList.add('frame-hidden');
      // TODO and here
      this.next.classList.add('frame-active');
      this.next.classList.remove('frame-hidden');
      localStorage.setItem('activePage', this.next.id);
      this.currentPage = this.nextLink;
    }
    return;
  }

  updateClosePage(): void {
    return;
  }

  getSessionData($event): void{
    this.isLoggedIn = $event;
    localStorage.setItem('isLoggedIn', this.isLoggedIn.toString());
    return;
  }

  // Addlink works fine now
  addLink(url): void {
    this.foundLink = false;
    this.linklist = JSON.parse(localStorage.getItem('currentList'));
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.linklist.length; i++){
      if (this.linklist[i] === url){
        alert('This link is already in the list');
        this.foundLink = true;
        // return;
      }
    }
    if (this.foundLink !== true){
      this.linklist.push(url);
      localStorage.setItem('currentList', JSON.stringify(this.linklist));
      (document.getElementById('Search') as HTMLInputElement).value = '';
    }
    return;
  }
}
