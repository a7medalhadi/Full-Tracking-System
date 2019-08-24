import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http , Headers, RequestOptions} from '@angular/http';
import {map} from 'rxjs/operators';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import 'rxjs/add/operator/filter';
import{Storage}from '@ionic/storage'
import { SigninPage } from '../signin/signin';

let headers = new Headers();

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  lat: number ;
  long: number ;
  watch: any;
  result = {};
  cnum=7 ;
  loggedIN = true ;
  token ;


  constructor(public navCtrl: NavController , private http : Http ,
    public zone: NgZone,
    public geolocation: Geolocation,
    public backgroundGeolocation: BackgroundGeolocation,
    public navparams : NavParams ,
    public storage : Storage ) {
 this.getData();
  } 

  getData(){
this.storage.get('token').then(val=>{
  if(val){
    this.token = val
   // this.storage.get('cnum').then((res)=>this.cnum = res);
  }else {
    this.navCtrl.push(SigninPage)
  }
})
  }


  startGps() {
    var config = {
      desiredAccuracy: 0,
      stationaryRadius: 20,
      distanceFilter: 9,
      debug: true,
      interval: 2000
    }
    
        this.backgroundGeolocation.configure(config).subscribe((location) => {
      console.log('Background running' + location.latitude + ',' + location.longitude);
      this.zone.run(() => {
        this.lat = location.latitude;
        this.long = location.longitude;

      });


    }, (error) => {
      console.log('error : ' + error);
    });

    this.backgroundGeolocation.start();

    var options = {
      frequency: 3000,
      enableHighAccuracy: true
    }
    this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe(
      (position: Geoposition) => {
        console.log(position);
        this.zone.run(() => {
          this.lat = position.coords.latitude;
          this.long = position.coords.longitude;
        });

        this.sendData()
      });

  }

  sendData(){
    
    var data = {
      lat : this.lat,
      long :this.long,
      speed:23
  };

  headers.append('Authorization', 'bearer '+ this.token);

  let options = new RequestOptions({ headers: headers });

  this.http.patch('http://localhost:3309/locations/'+this.cnum,data ,options).pipe(
    map(res => res.json())
).subscribe(response => {
    console.log('POST Response:', response.message);
})
  }

  stopGps() {
    this.backgroundGeolocation.finish();
    this.watch.unsubscribe();
    console.log('the GPS stopped ... ')
  }
  signOut(){
    this.storage.remove('token');
    this.storage.remove('from');
    this.storage.remove('to');
    this.storage.remove('cnum');
    this.navCtrl.push(SigninPage);

  }

 

}
