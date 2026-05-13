import {inject,Injectable } from '@angular/core';
import{HttpClient} from '@angular/common/http';
import{environment} from '../../environments/environment.development';
import {Observable} from 'rxjs';
import { WeatherDetail } from '../models/weather.model';
import {map} from 'rxjs/opartors';

Injectable({
    provideIn: 'root',
})
export class WeatherService {
    private apiUrl = environment.apiUrl+'/weather';
    private API_KEY = environment.weatherApiKey;

    constructor(private http:HttpClient){}

    getWeather(cityName:string):Observable<WeatherDetail>{
        const url = `https://api.weatherapi.com/v1/current.json?key=${this.API_KEY}&q=${cityName}`;  
    return this.http.get<any>(url).pipe( 
    map((res: { current: { temp_c: any; condition: { text: any; }; humidity: any; }; }) => ({ 
     temp_c:    res.current.temp_c, 
     condition: res.current.condition.text, 
     humidity:  res.current.humidity 
        })) 
    ); 
    }
}