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
  loginForm = new FormGroup({
    username: new FormControl( '', [Validators.required]),
    password: new FormControl( '', [Validators.required])
  });
  registerForm = new FormGroup({
    email: new FormControl( '', [Validators.required, Validators.email]),
    user: new FormControl( '', [Validators.required, Validators.minLength(3)]),
    pass: new FormControl( '', [Validators.required, Validators.minLength(8)]),
    pass2: new FormControl('', [Validators.required, Validators.minLength(8)])
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

  loginModal: any;
  registerModal: any;

  currentUser: any;
  currentPass: any;
  userList: any;
  newEmail: any;
  newUser: string;
  newPass: string;
  newPass2: string;
  userArray: User[];
  submitted: boolean;
  users = localStorage.getItem('users') || [];
  toggle = document.getElementById('toggle');


  constructor() {
    this.currentUser = 'Anonymus';
    // TODO Get current user name
  }

  ngOnInit(): void {
    this.submitted = false;
    // example
    // this.SignupForm = new FormGroup({
    //   'userData': new FormGroup({
    //     'username':new FormControl(null,[Validators.required,this.forbiddenNames.bind(this)]),
    //     'email':new FormControl(null,[Validators.required,Validators.email],this.forbiddenEmails),
    //   }),
    //   'gender':new FormControl('female'),
    //   'hobbies':new FormArray([])
    // });




    // alert(this.users);
    // in case of offline mode get all data from localstorage
    if ( navigator.onLine === false){
      this.getLocalData();
    }
    // TODO check if it's logged in, insert jwt token as an extra measure
    if (localStorage.getItem('isLoggedIn') === 'true'){
      this.isSession = true;
    } else{
      this.isSession = false;
    }
    // send session data to homepage
    this.sendSession(this.isSession);
  }

  registerUser(): void {
    if (this.registerForm.valid && this.registerForm.value.pass === this.registerForm.value.pass2){
      console.log(this.registerForm.value);
    }
    this.submitted = true;
    if (this.registerForm.invalid){
      alert('invalid form');
      return;
    }
    this.newUser = this.registerForm.value.user;
    this.newEmail = this.registerForm.value.email;
    this.newPass = this.registerForm.value.pass;
    this.newPass2 = this.registerForm.value.pass2;

    if (this.newPass === this.newPass2 && this.newPass !== '') {
      this.userArray = JSON.parse(localStorage.getItem('users'));
      alert(this.userArray);
      // TODO
      this.closeRegisterModal();
      alert('Successfully registered, you may login now!');
      this.submitted = false;
    }
  }

  openLoginModal(): void {
    // open login modal
    this.loginModal = document.getElementById('loginModal');
    this.loginModal.style.display = 'block';
  }

  openRegisterModal(): void {
    // open register modal
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
    // (document.getElementById('toggle')as HTMLInputElement).checked = false;
    // (document.getElementById('username')as HTMLInputElement).setAttribute('type', 'password');
    // (document.getElementById('password')as HTMLInputElement).setAttribute('type', 'password');
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

  onSubmit(): void {

    // if (this.loginForm.invalid){
    //   return;
    // }

    this.currentUser = this.loginForm.value.username;
    this.currentPass = this.loginForm.value.password;
    this.userList = JSON.parse(localStorage.getItem('users'));
    alert(this.userList);
    if (this.hashPassword(this.currentPass)){
          this.loginUser();
      }


  }

  loginUser(): void {
    // TODO authenticate user from both localstorage or if online then from server-db

    this.isSession = true;
    this.sendSession(this.isSession);


    this.closeLoginModal();
    this.closeRegisterModal();
    // this.loadLinks(this.userId);
  }



  getLocalData(): void{
    // TODO offline session data gather, is access valid? is user token still active? load back opened pages last state from cache
  }

  sendSession(session): void{
    this.isSessionEvent.emit(session);
  }

  loadLinks(userId: number): void{
    // TODO load the current user's links
  }

  hashPassword(password): boolean{
    const hashedPass = sha256(password);
    const users = localStorage.getItem('users');
    this.currentUser = users[0];
    // if (hashedPass === currentUser.password){
    //    return true;
    // }
    return false;
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

  checkPasswords(): boolean{
    const pass = (document.getElementById('pass')as HTMLInputElement).value;
    const pass2 = (document.getElementById('pass2')as HTMLInputElement).value;
    if (pass === pass2 && pass !== ''){
      return false;
    } else{
      return true;
    }
  }


}
