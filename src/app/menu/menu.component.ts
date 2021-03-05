import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {sha256} from 'js-sha256';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  regex = /^[a-zA-Z0-9@_-]*$/;
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.pattern(this.regex)]),
    password: new FormControl('', [Validators.required, Validators.pattern(this.regex)])
  });
  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    user: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern(this.regex)]),
    pass: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(this.regex)]),
    pass2: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(this.regex)])
  });

  isSession: boolean;
  @Output() isSessionEvent = new EventEmitter<boolean>();

  id: any;
  currentList: any[];
  loginModal: any;
  registerModal: any;
  newId: string;
  nextId: number;
  currentUser: any;
  currentPass: any;
  newEmail: any;
  newUser: string;
  newPass: string;
  newPass2: string;
  userArray: any;
  submitted: boolean;
  users: any[];
  usersNew: any;
  selectedID: any;
  toggle = document.getElementById('toggle');
  linkList: any;
  foundList: boolean;

  constructor() {
  }
  // tslint:disable-next-line:typedef
  get f() {
    return this.registerForm.controls;
  }

  // tslint:disable-next-line:typedef
  get g() {
    return this.loginForm.controls;
  }

  ngOnInit(): void {
    if (localStorage.getItem('currentList') === null){
      localStorage.setItem('currentList', '[]');
    }
    // get the current username if logged in, so won't lose it on refresh
    if (!(localStorage.getItem('currentUser'))) {
      localStorage.setItem('currentUser', '');
    } else {
      this.currentUser = localStorage.getItem('currentUser');
    }
    // in case of offline mode get all data from localstorage
    if (navigator.onLine === false) {
      this.getLocalData();
    }
    // TODO check if user is still logged in, insert jwt token as an extra measure 10 mins max
    if (localStorage.getItem('isLoggedIn') === 'true') {
      this.isSession = true;
    } else {
      this.isSession = false;
    }
    // send session data to homepage
    this.sendSession(this.isSession);
  }

  registerUser(): void {
    // check if users exists
    if (!(localStorage.getItem('users'))) {
      // alert('users now exists');
      localStorage.setItem('users', '[]');
    }
    // if users not exist, make it
    if (this.registerForm.invalid) {
      alert('invalid form');
      return;
    }

    // get user data from the form
    this.newEmail = this.registerForm.value.email;
    this.newUser = this.registerForm.value.user;
    this.newPass = this.registerForm.value.pass;
    this.newPass2 = this.registerForm.value.pass2;
    // check if user or email is in use
    if (this.checkMailAndUser(this.newEmail, this.newUser) === false) {
      // alert('this data not yet in users, we can add this user to the users');

      // get a new id for new user
      this.id = localStorage.getItem('nextID');
      if (this.id === null || this.id.length === 0 || this.id === '') {
        this.id = 100000;
        localStorage.setItem('nextID', JSON.stringify(this.id));
      }
      this.newId = localStorage.getItem('nextID') || '100000';
      this.nextId = Number(this.newId) + 1;
      localStorage.setItem('nextID', JSON.stringify(this.nextId));

      // hash the password
      this.newPass = this.hashPassword(this.newPass);
      this.users = JSON.parse(localStorage.getItem('users')) || [];

      this.userArray = {
        id: this.newId,
        email: this.newEmail,
        username: this.newUser,
        password: this.newPass
      };
      // add user
      this.users.push(this.userArray);
      localStorage.setItem('users', JSON.stringify(this.users));
      if (navigator.onLine === true) {
        // TODO POST request to Server, update users db with new user
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

  closeLoginModal(): void {
    this.loginModal.style.display = 'none';
    this.resetLoginForm();
  }

  resetLoginForm(): void {
    this.loginForm.reset({username: '', password: ''});
  }

  closeRegisterModal(): void {
    this.registerModal.style.display = 'none';
    this.resetRegisterForm();
  }

  reloadPage(): void {
    // this.sendSession(this.isSession);
    // alert(this.users);
    window.location.reload();
  }

  resetRegisterForm(): void {
    (document.getElementById('toggle') as HTMLInputElement).checked = false;
    (document.getElementById('pass') as HTMLInputElement).setAttribute('type', 'password');
    (document.getElementById('pass2') as HTMLInputElement).setAttribute('type', 'password');
    this.registerForm.reset({email: '', user: '', pass: '', pass2: ''});
  }

  endSession(): void {
    // no need to delete user or links, since we want the user to access the pages in offline, just end the session
    // TODO save the currentlist to the user's list, it's an overwrite
    const list = JSON.parse(localStorage.getItem('currentList'));
    let linkList = localStorage.getItem('linkList');


    if (localStorage.getItem('isLoggedIn') === 'true') {
      this.isSession = false;
      localStorage.setItem('isLoggedIn', 'false');
      this.sendSession(this.isSession);
      // this.reloadPage();
      // alert('User has been logged out');
    }
    // this.sendSession(this.isSession);
  }

  loginUser(): void {
    // this.foundList = false;
    // localStorage.setItem('linkList', '[]');
    // TODO authenticate user from localstorage or if online then from server-db
    const username = this.loginForm.value.username;
    const password = this.loginForm.value.password;
    localStorage.setItem('currentList', '[]');

    this.users = JSON.parse(localStorage.getItem('users'));
    if (this.users === null) {
      localStorage.setItem('users', '[]');
      alert('In order to login you need to register first');
    }
    for (let i = 0; i <= this.users.length; i++) {
      if (JSON.stringify(this.users).match(username) && JSON.stringify(this.users).match(this.hashPassword(password))) {
        // find ID of the log in user, then select the user's link list
        this.selectedID = (this.users[i].id);
        this.linkList = JSON.parse(localStorage.getItem('linkList'));
        for (let j = 0; j < this.linkList.length; j++){
          // alert(this.linkList[j].id);
          const checkedID = this.linkList[j].id;
          // alert(checkedID);
          if (checkedID.match(this.selectedID)){
              // alert(JSON.stringify(this.linkList[j].links));
              this.currentList = this.linkList[j].links;
              localStorage.setItem('currentList', JSON.stringify(this.currentList));
              // this.foundList = true;
              break;
          }
        }
        // // if the user has no list yet, then create the next for them, id needed
        // if (this.foundList !== true){
        //   localStorage.setItem('currentList', '[]');
        //   alert('You do not have any links yet');
        //   // this.reloadPage();
        // }

        localStorage.setItem('currentList', JSON.stringify(this.currentList));
        this.currentUser = username;
        localStorage.setItem('currentUser', this.currentUser);
        this.isSession = true;
        this.sendSession(this.isSession);
        this.closeLoginModal();
        // this.closeRegisterModal();
        location.reload();
      }
    }
    alert('Wrong login/password combination');
  }


  getLocalData(): void {
    // TODO offline session data gather, is access valid? is user token still active? load back opened pages last state
  }

  sendSession(session): void {
    this.isSessionEvent.emit(session);
  }

  toggleVisible(): void {
    if (document.getElementById('pass').getAttribute('type') === 'password') {
      document.getElementById('pass').setAttribute('type', 'text');
      document.getElementById('pass2').setAttribute('type', 'text');
    } else {
      document.getElementById('pass').setAttribute('type', 'password');
      document.getElementById('pass2').setAttribute('type', 'password');
    }
  }

  hashPassword(password): string {
    const hashedPass = sha256(password);
    return hashedPass;
  }

  checkPasswords(): boolean {
    const pass = (document.getElementById('pass') as HTMLInputElement).value;
    const pass2 = (document.getElementById('pass2') as HTMLInputElement).value;
    if (pass === pass2 && pass !== '') {
      return false;
    } else {
      return true;
    }
  }

  checkMailAndUser(mail, user): boolean {
    const data = localStorage.getItem('users');
    if (data.match('"' + mail + '"')) {
      alert('The given e-mail is already registered');
      return true;
    }
    if (data.match('"' + user + '"')) {
      alert('The given username is already in use, please choose another one!');
      return true;
    }
    return false;
  }
}
