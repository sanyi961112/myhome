import {Component, Input, OnInit} from '@angular/core';
import {Link} from '../models/Link';
import {MenuComponent} from '../menu/menu.component';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
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

  constructor(private sanitizer: DomSanitizer) {
    this.checkDevice();

    if (localStorage.getItem('users') === null) {
      // alert('users now exists');
      localStorage.setItem('users', '[]');
    }
    if (localStorage.getItem('currentList') === null) {
      localStorage.setItem('currentList', '[]');
    }
    if (localStorage.getItem('linkList') === null) {
      localStorage.setItem('linkList', '[]');
    }
    // this.linklist = JSON.parse(localStorage.getItem('linklist'));
  }

  ngOnInit(): void {
    this.urlExample = 'http://wiki.archlinux.org';
    this.frameID = 1000;
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
  }

  openPage(link: string): void {
    this.currentPage = link;
    // alert(this.currentPage);
    this.openedLinks = true;
    let httplink;
    if (!(link.includes('http://' || 'https://'))){
      httplink = 'http://' + link;
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
    this.frameID++;
  }

  deleteLink(link: string): void {
    if (this.isLoggedIn !== true){
      return;
    }
    // alert('this will delete the link');
    let list = JSON.parse(localStorage.getItem('currentList'));
    // alert(list);
    list = list.filter(obj => obj !== link);
    localStorage.setItem('currentList', JSON.stringify(list));
    // alert(list);
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

  closePage(currentPageID): void {
    localStorage.getItem('currentPage');
    // alert(currentPage + ' is going to be closed!');
    // if (this.openedLinks === true){
    //   length = this.openedLinkList.length;
    //
    // TODO POST request needed to be sent to server, if online mode?????
    // }
    // alert(this.currentPageID);
    const iframe = document.getElementById(this.currentPageID);
    iframe.parentNode.removeChild(iframe);
    this.linkCounter = this.linkCounter - 1;
    if (this.linkCounter === 0) {
      location.reload();
    }
  }

  prevPage(): void {
    // TODO update the close-page button and actually add animation too
  }

  nextPage(): void {
    // TODO
  }

  getSessionData($event): void{
    this.isLoggedIn = $event;
    localStorage.setItem('isLoggedIn', this.isLoggedIn.toString());
  }

  // Addlink works fine now
  addLink(url): void {
    this.foundLink = false;
    // alert(url);
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

  }
}
