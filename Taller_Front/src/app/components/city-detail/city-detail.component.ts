import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { City } from '../../models/city.model';
import { WeatherRecord } from '../../models/weather-record.model';
import { WeatherRecordService } from '../../services/weather-record.service';
import { WeatherService } from '../../services/weather.service';  
import { WeatherDetail } from '../../models/weather.model';
/*
 * Implementar:
 * HU-03 — Detalle de Ciudad con Clima (Ver TALLER.md Parte B)
 * HU-04 — Historial de Registros de Clima (Ver TALLER.md Parte D)
 */

@Component({
  selector: 'app-city-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './city-detail.component.html'
})
export class CityDetailComponent implements OnChanges {
  private weatherRecordService = inject(WeatherRecordService);
  private weatherService = inject(WeatherService);

  @Input() city!: City;

  weatherRecords: WeatherRecord[] = [];
  weatherDetail:WeatherDetail | null = null;
  loading: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['city'] && this.city) {
      this.weatherRecordService.getRecords(this.city.id)
        .subscribe(records => this.weatherRecords = records);

      this.loading = true;
      this.weatherService.getWeather(this.city.name)
        .subscribe({
          next: (data) => {
            this.weatherDetail = data;
            this.loading = false;
          },
          error: () => {
            this.loading = false;
            this.weatherDetail = null;
          }
        });
    }
  }

  saveWeather(): void {
    if(!this.weatherDetail) return;
    const record={
      temC: this.weatherDetail.temp_c,
      condition:this.weatherDetail.condition,
      humidity:this.weatherDetail.humidity
    };
     this.weatherRecordService.saveRecord(this.city.id,record)
     .subscribe({
      next: () => {
        this.weatherRecordService.getRecords(this.city.id)
        .subscribe(records => this.weatherRecords = records);
      },
      error: (err) => {
        console.error('Error guardando el registro del clima', err);
      }
     });
  }
}
