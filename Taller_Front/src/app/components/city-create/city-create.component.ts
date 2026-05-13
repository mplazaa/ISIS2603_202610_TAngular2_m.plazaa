import { Component, EventEmitter,OnInit, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CityService } from '../../services/city.service';
import { CountryService } from '../../services/country.service';
import { Country } from '../../models/country.model';

/*
 * Implementar: HU-02 — Crear Ciudad
 */

@Component({
  selector: 'app-city-create',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './city-create.component.html'
})

export class CityCreateComponent implements OnInit{
  private countryService = inject(CountryService);
  private cityService    = inject(CityService);

  @Output() cityCreated = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  cityName: string = '';
  selectedCountryId: number | null = null;
  countries: Country[] = [];
 
  ngOnInit(): void {
    this.countryService.getCountries()
      .subscribe((countries: Country[]) => this.countries = countries);
  }
 
  get isFormValid(): boolean {
    return this.cityName.trim().length > 0 && this.selectedCountryId !== null;
  }
 
  onSave(): void {
    if (!this.isFormValid) return;
 
    this.cityService.createCity(this.selectedCountryId!, { name: this.cityName.trim() })
      .subscribe({
        next: () => this.cityCreated.emit(),
        error: (err: any) => console.error('Error al crear ciudad', err)
      });
  }
 
  onCancel(): void {
    this.cancel.emit();
  }
}
