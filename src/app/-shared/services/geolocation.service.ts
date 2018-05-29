import {Injectable} from '@angular/core';

export interface IPoint {
  latitude: number;
  longitude: number;
}

@Injectable()
export class GeolocationService {

  private currentPosition: Position;

  constructor() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.successGeo.bind(this), this.errorGeo.bind(this));
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }

  public isSupported(): boolean {
    return !!this.currentPosition;
  }

  public distanceTo(coordinates: IPoint): number {
    if (!this.isSupported()) {
      return;
    }
    return this.distance(coordinates, this.currentPosition.coords);
  }

  public distance(point1: IPoint, point2: IPoint): number {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(point2.latitude - point1.latitude);  // deg2rad below
    const dLon = this.deg2rad(point2.longitude - point1.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(point1.latitude)) * Math.cos(this.deg2rad(point2.latitude)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  private successGeo(position) {
    this.currentPosition = position;
    console.log('currentPosition', this.currentPosition);
  }

  private errorGeo(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.log('User denied the request for Geolocation.');
        break;
      case error.POSITION_UNAVAILABLE:
        console.log('Location information is unavailable.');
        break;
      case error.TIMEOUT:
        console.log('The request to get user location timed out.');
        break;
      case error.UNKNOWN_ERROR:
      default:
        console.log('An unknown error occurred.');
        break;
    }
  }

}
