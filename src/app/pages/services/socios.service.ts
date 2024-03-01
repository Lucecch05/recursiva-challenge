import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Socio, SocioFilter } from '../../entities/index'
import { ListadoEquiposTable } from '../dashboard/dashboard.component';

@Injectable({
  providedIn: 'root'
})
export class SociosService {

  private csvDataSubject = new BehaviorSubject<any[]>([]);
  fileData$ = this.csvDataSubject.asObservable();

  constructor() { }

  updateCsvData(data: any[]) {
    this.csvDataSubject.next(data);
  }


  //Functions
  getSociosFilter(socios: Socio[], filter?: SocioFilter[]): Socio[] {
    let filteredArray: Socio[] = [];

    if (filter) {
      filteredArray = [...socios];
      for (let i = 0; i < filter.length; i++) {
        filteredArray = filteredArray.filter(socio => {

          switch (filter[i].operator) {
            case 'equal':
              return socio[filter[i].column] == filter[i].value;
            case 'greater':
              return socio[filter[i].column] > filter[i].value;
            case 'less':
              return socio[filter[i].column] < filter[i].value;
            case 'greaterOrEqual':
              return socio[filter[i].column] >= filter[i].value;
            case 'lessOrEqual':
              return socio[filter[i].column] <= filter[i].value;
            case 'like':
              return String(socio[filter[i].column]).toLowerCase().includes(filter[i].value.toString().toLowerCase());
          }

        })
      }
    }

    return filteredArray;
  }

  getPromedioEdad(socios: Socio[]): number {
    if (socios.length == 0) {
      return 0;
    }

    return socios.reduce((acc, socio) => acc + socio.edad, 0) / socios.length;
  }


  getEdadMinAndMax(socios: Socio[]): { min: number, max: number } {
    return {
      min: Math.min(...socios.map(socio => socio.edad)),
      max: Math.max(...socios.map(socio => socio.edad))
    }
  }

  orderArray(array: any[] | Socio[] | ListadoEquiposTable[], order: 'asc' | 'desc', column?: string): any[] | Socio[] | ListadoEquiposTable[] {

    if (!column) {
      return array.sort((a, b) => {
        if (a.count < b.count) {
          return order == 'asc' ? -1 : 1;
        }
        if (a.count > b.count) {
          return order == 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    else {
      return array.sort((a, b) => {
        if (a[column] < b[column]) {
          return order == 'asc' ? -1 : 1;
        }
        if (a[column] > b[column]) {
          return order == 'asc' ? 1 : -1;
        }
        return 0;
      })
    }

  }

  getColumnCount(socios: Socio[], column: 'nombre' | 'edad' | 'equipo' | 'estadoCivil' | 'nivelEstudios', order: 'asc' | 'desc'): { name: any, count: number }[] {

    let arrayData: [{ name: any, count: number }] = [{ name: '', count: 0 }];
    let filteredArray = [...socios];

    do {
      const toSearch = filteredArray[0][column];
      const count = filteredArray.filter(s => s[column] == toSearch).length;

      arrayData.push({ name: toSearch, count: count });
      filteredArray = filteredArray.filter(s => s[column] != toSearch);

    } while (filteredArray.length > 0);

    arrayData.sort((a, b) => {
      if (a.count < b.count) {
        return order == 'asc' ? -1 : 1;
      }
      if (a.count > b.count) {
        return order == 'asc' ? 1 : -1;
      }
      return 0;
    });

    return arrayData.filter(s => s.name != '');
  }

  getColumnsValues(socios: Socio[], column: 'nombre' | 'edad' | 'equipo' | 'estadoCivil' | 'nivelEstudios'): any[] {
    let columnArray = [];
    let filteredArray = [...socios];

    do {
      const toSearch = filteredArray[0][column];
      columnArray.push(toSearch)
      filteredArray = filteredArray.filter(s => s[column] != toSearch);

    } while (filteredArray.length > 0);

    return columnArray;
  }


}
