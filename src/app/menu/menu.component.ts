import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { sha256 } from 'js-sha256';
import {User} from '../models/User';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  regex = /^[a-zA-Z0-9@_-]*$/;
  loginForm = new FormGroup({
    username: new FormControl( '', [Validators.required, Validators.pattern(this.regex)]),
    password: new FormControl( '', [Validators.required, Validators.pattern(this.regex)])
  });
  registerForm = new FormGroup({
    email: new FormControl( '', [Validators.required, Validators.email]),
    user: new FormControl( '', [Validators.required, Validators.minLength(3), Validators.pattern(this.regex)]),
    pass: new FormControl( '', [Validators.required, Validators.minLength(8), Validators.pattern(this.regex)]),
    pass2: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(this.regex)])
  });
  // tslint:disable-next-line:typedef
  get f(){
    return this.registerForm.controls;
  }
  // tslint:disable-next-line:typedef
  get g(){
    return this.loginForm.controls;
  }


  isSession: boolean;
  @Output() isSessionEvent = new EventEmitter<boolean>();

  id: any;
  loginModal: any;
  registerModal: any;
  newId: string;
  nextId: number;
  currentUser: any;
  currentPass: any;
  userList: any;
  newEmail: any;
  newUser: string;
  newPass: string;
  newPass2: string;
  userArray: any;
  submitted: boolean;
  users: any[];
  usersNew: any;
  toggle = document.getElementById('toggle');


  constructor() {
  }

  ngOnInit(): void {
    // get the current username if logged in, so won't lose it on refresh
    if (!(localStorage.getItem('currentUser'))){
      localStorage.setItem('currentUser', '');
    } else {
      this.currentUser = localStorage.getItem('currentUser');
    }
    if (!(localStorage.getItem('users'))){
      // alert('users now exists');
      localStorage.setItem('users', '[]');
    }
    // in case of offline mode get all data from localstorage
    if ( navigator.onLine === false){
      this.getLocalData();
    }
    // TODO check if user is still logged in, insert jwt token as an extra measure 10 mins max
    if (localStorage.getItem('isLoggedIn') === 'true'){
      this.isSession = true;
    } else{
      this.isSession = false;
    }
    // send session data to homepage
    this.sendSession(this.isSession);
  }

  registerUser(): void {
    // if users not exist, make it
    if (this.registerForm.invalid){
      alert('invalid form');
      return;
    }

    // get user data from the form
    this.newEmail = this.registerForm.value.email;
    this.newUser = this.registerForm.value.user;
    this.newPass = this.registerForm.value.pass;
    this.newPass2 = this.registerForm.value.pass2;
    // check if user or email is in use
    if (this.checkMailAndUser(this.newEmail, this.newUser) === false){
        // alert('this data not yet in users, we can add this user to the users');

        // get a new id for new user
        this.id = localStorage.getItem('nextID');
        if (this.id === null || this.id.length === 0 || this.id === ''){
        this.id = 100000;
        localStorage.setItem('nextID', JSON.stringify(this.id));
      }
        this.newId = localStorage.getItem('nextID') || '100000';
        this.nextId = Number(this.newId) + 1;
        localStorage.setItem('nextID', JSON.stringify(this.nextId));

        // hash the password
        this.newPass = this.hashPassword(this.newPass);
        this.users = JSON.parse(localStorage.getItem('users')) || [];

        this.userArray = [{
          id: this.newId}, {
          email: this.newEmail}, {
          username: this.newUser}, {
          password: this.newPass
        }];
        this.users.push(this.userArray);
        localStorage.setItem('users', JSON.stringify(this.users));
        if (navigator.onLine === true){
          // TODO POST request to Server, update users with new user
        }
        this.closeRegisterModal();
        alert('Successfully registered, you may login now!');
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
    // this.sendSession(this.isSession);
    // alert(this.users);
    window.location.reload();
  }

  closeLoginModal(): void {
    this.loginModal.style.display = 'none';
    this.resetLoginForm();
  }

  resetLoginForm(): void{
    this.loginForm.reset({username: '', password: ''});
  }

  closeRegisterModal(): void {
    this.registerModal.style.display = 'none';
    this.resetRegisterForm();
  }

  resetRegisterForm(): void{
    (document.getElementById('toggle')as HTMLInputElement).checked = false;
    (document.getElementById('pass')as HTMLInputElement).setAttribute('type', 'password');
    (document.getElementById('pass2')as HTMLInputElement).setAttribute('type', 'password');
    this.registerForm.reset({email: '', user: '', pass: '', pass2: ''});
  }

  endSession(): void {
    // no need to delete user, since we want the user to access the page in offline, just end the session
    // is reload page needed?
    if ( localStorage.getItem('isLoggedIn') === 'true'){
      this.isSession = false;
      localStorage.setItem('isLoggedIn', 'false');
      this.sendSession(this.isSession);
      // this.reloadPage();
      alert('User has been logged out');
    }
    // this.sendSession(this.isSession);
  }

  loginUser(): void {
    // TODO authenticate user from localstorage or if online then from server-db
    const username = this.loginForm.value.username;
    const password = this.loginForm.value.password;

    this.users = JSON.parse(localStorage.getItem('users'));
    // alert('users:' + JSON.stringify(this.users[0][3]));
    for (let i = 0; i <= this.users.length; i++){
      if (JSON.stringify(this.users[i][2]).match(username) && JSON.stringify(this.users[i][3]).match(this.hashPassword(password))){
        this.isSession = true;
        this.currentUser = username;
        localStorage.setItem('currentUser', this.currentUser);
        this.sendSession(this.isSession);
        // TODO load links
        // this.loadLinks(this.userId);
        this.closeLoginModal();
        this.closeRegisterModal();
        return;
      }
    }
  }



  getLocalData(): void{
    // TODO offline session data gather, is access valid? is user token still active? load back opened pages last state as pwa
  }

  sendSession(session): void{
    this.isSessionEvent.emit(session);
  }

  loadLinks(userId: number): void{
    // TODO load the current user's links
  }

  toggleVisible(): void{
    if (document.getElementById('pass').getAttribute('type') === 'password'){
      document.getElementById('pass').setAttribute('type', 'text');
      document.getElementById('pass2').setAttribute('type', 'text');
    } else{
      document.getElementById('pass').setAttribute('type', 'password');
      document.getElementById('pass2').setAttribute('type', 'password');
    }
  }

  hashPassword(password): string{
    const hashedPass = sha256(password);
    return hashedPass;
  }

  checkPasswords(): boolean{
    const pass = (document.getElementById('pass')as HTMLInputElement).value;
    const pass2 = (document.getElementById('pass2')as HTMLInputElement).value;
    if (pass === pass2 && pass !== ''){
      return false;
    } else{
      return true;
    }
  }

  checkMailAndUser(mail, user): boolean {
    const data = localStorage.getItem('users');
    if (data.includes(mail)){
      alert('The given e-mail is already registered');
      return true;
    }
    if (data.includes(user)){
      alert('The given username is already in use, please choose another one!');
      return true;
    }
    return false;
  }
}
