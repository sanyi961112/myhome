import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  isSession = false;
  @Output() isSessionEvent = new EventEmitter<boolean>();
  loginModal: any;
  registerModal: any;
  currentUser: string;
  constructor() { }

  ngOnInit(): void {
    if ( navigator.onLine === false){
      this.getLocalData();
    }
  }

  openLoginModal(): void {
    this.loginModal = document.getElementById('loginModal');
    this.loginModal.style.display = 'block';
  }

  openRegisterModal(): void {
    this.registerModal = document.getElementById('registerModal');
    this.registerModal.style.display = 'block';
  }

  reloadPage(): void {
    window.location.reload();
  }

  closeLoginModal(): void {
    this.loginModal.style.display = 'none';
  }

  closeRegisterModal(): void {
    this.registerModal.style.display = 'none';
  }

  endSession(): void {

    this.isSession = false;
    this.sendSession(this.isSession);
    // this.reloadPage();
  }

  loginUser(): void {
    // TODO authenticate user from both localstorage or if online then from server-db

    this.isSession = true;
    this.sendSession(this.isSession);
    this.closeLoginModal();
  }

  registerUser(): void{
    // TODO register, then login new user automatically

    this.isSession = true;
    this.closeLoginModal();
  }

  getLocalData(): void{
    // TODO offline session data gather, is access valid? is user token still active? load back opened pages last state from localstorage
  }

  sendSession(session): void{
    this.isSessionEvent.emit(session);
  }
}
