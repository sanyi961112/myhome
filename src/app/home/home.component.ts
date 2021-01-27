import {Component, Input, OnInit} from '@angular/core';
import {Link} from '../models/Link';
import {MenuComponent} from '../menu/menu.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isOnline: boolean;
  linklist: Array<Link>;
  openedLinks = true;
  openedLinkList: Array<Link>;
  isLoggedIn: boolean;
  isMobileView = false;
  urlRegex = /^(?![^\n]*\.$)(?:https?:\/\/)?(?:(?:[2][1-4]\d|25[1-5]|1\d{2}|[1-9]\d|[1-9])(?:\.(?:[2][1-4]\d|25[1-5]|1\d{2}|[1-9]\d|[0-9])){3}(?::\d{4})?|[a-z\-]+(?:\.[a-z\-]+){2,})$/;
  urlString: string;
  linkCounter: number;
  currentPage: number;


  constructor() {
    this.checkDevice();
  }

  ngOnInit(): void {
    this.isLoggedIn = false;
    this.linkCounter = 0;
  }

  openLink(): void {

  }

  deleteLink(id: number): void {

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

  validateInput(url): boolean {
    this.urlString = url.toString();
    if (this.urlString.match(this.urlRegex)){
      alert('URL syntax accepted!');
      return true;
    } else if (this.urlString === ''){
      alert('Add a valid url in the input field!');
      return false;
    }
    alert('URL syntax is wrong!');
    return false;
  }

  closePage(location): void {
    if (this.openedLinks === true){
      length = this.openedLinkList.length;

      // TODO POST request needed to be sent to server, if online mode
    }
  }

  prevPage(): void {

  }

  nextPage(): void {

  }

  getSessionData($event): void{
    this.isLoggedIn = $event;
    localStorage.setItem('isLoggedIn', this.isLoggedIn.toString());
  }
}
