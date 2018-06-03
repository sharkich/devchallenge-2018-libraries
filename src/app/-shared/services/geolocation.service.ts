import {Injectable} from '@angular/core';
import {ChangesService} from './changes.service';

export interface IPoint {
  latitude: number;
  longitude: number;
}

/**
 * Service for GEO-location
 */
@Injectable()
export class GeolocationService {

  /**
   * Error is some problems with geolovations
   */
  public error;

  /**
   * Current user position
   */
  private currentPosition: Position;

  constructor(private changesService: ChangesService) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.successGeo.bind(this), this.errorGeo.bind(this));
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }

  /**
   * Check is geo location is supported
   * @return {boolean}
   */
  public isSupported(): boolean {
    return !!this.currentPosition;
  }

  /**
   * Get current user position
   * @return {boolean}
   */
  public getCurrentPosition(): IPoint {
    return this.currentPosition && this.currentPosition.coords;
  }

  /**
   * Calculate distance from current position to point
   * @param {IPoint} coordinates
   * @return {number}
   */
  public distanceTo(coordinates: IPoint): number {
    if (!this.isSupported()) {
      return;
    }
    return this.distance(coordinates, this.currentPosition.coords);
  }

  /**
   * Calculate distance between two points
   * @param {IPoint} point1
   * @param {IPoint} point2
   * @return {number}
   */
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

  /**
   * Convert degrees to radiance
   * @param {number} deg
   * @return {number}
   */
  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  /**
   * Handle success current location initiate
   * @param {Position} position
   */
  private successGeo(position: Position) {
    this.currentPosition = position;
    this.changesService.geo.emit();
  }

  /**
   * Handle error event initiate current position
   * @param error
   */
  private errorGeo(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        this.error = 'User denied the request for Geolocation.';
        break;
      case error.POSITION_UNAVAILABLE:
        this.error = 'Location information is unavailable.';
        break;
      case error.TIMEOUT:
        this.error = 'The request to get user location timed out.';
        break;
      case error.UNKNOWN_ERROR:
      default:
        this.error = 'An unknown error occurred.';
        break;
    }
    this.changesService.geo.emit();
  }

}
