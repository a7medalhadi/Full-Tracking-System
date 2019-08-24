import { Component , ViewChild , ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import  { Http } from '@angular/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Geolocation } from '@ionic-native/geolocation';

import 'rxjs/Rx';

declare let google ;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  locations: any=[];
  sub;
name ;
  constructor(public navCtrl: NavController , public http : Http , public geolocation : Geolocation  ) {
    this.sub = Observable.interval(3000)
    .subscribe((val) => { this.getLocations(); });
  }

  ionViewDidEnter(){ 
    this.loadMap();
    this.getLocations();   }


  loadMap() {
    this.geolocation.getCurrentPosition().then((position)=>{
      var latLong = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      var options = {
        center: latLong,
        zoom: 6,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, options);
    },(error)=>{
      console.log(error);
    }) }

    getLocations(){
      this.http.get('http://localhost:3309/locations').pipe(
          map(res => res.json())
      ).subscribe(response => {
          console.log('GET Response:', response.result);
          this.locations = response.result
          this.loadMarkers(this.locations)
      });
    }

    loadMarkers(markers){
      for (var marker of markers){
      var loc ={lat : marker.lat , lng :marker.long , name : marker.cnum , from : marker.from , to : marker.to}
       marker = new google.maps.Marker({
        position : loc  ,
        map : this.map,
        title : loc.name,
      });

    
    var infowindow = new google.maps.InfoWindow()
	  var content = "from :" + loc.from + "</br>" + "to :" + loc.to 
	  google.maps.event.addListener(marker,'click', (function(marker,content,infowindow){ 
    return function() {
        infowindow.setContent(content);
        infowindow.open(this.map,marker);
    };
})(marker,content,infowindow));
}
  }

}
