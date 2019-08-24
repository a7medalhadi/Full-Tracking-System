import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { map } from 'rxjs/operators'
import { HomePage } from '../home/home';
import {Storage} from '@ionic/storage'
@IonicPage()
@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {
 data = {
    email : "",
    password : 0
  }

  response  ;
  res = "" ;
  loggedIn = false ;

  constructor(public navCtrl: NavController, public navParams: NavParams , public http : Http , public storage : Storage) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SigninPage');

  }

 sign(){
    this.http.post('http://localhost:3309/users/login',this.data).pipe(
      map(res => res.json())
  ).subscribe(response => {
      console.log('POST Response:', response);
      this.response = response
      if (this.response.message === 'auth succesful') {
        this.loggedIn=true;
        this.storage.set('token' , response.token);
        this.storage.set('from' , response.from);
        this.storage.set('to' , response.to);
        this.storage.set('cnum' , response.cnum);
        this.navCtrl.push(HomePage)
      } else {
        this.res = this.response.message
      }
  })
  

  }


  }


