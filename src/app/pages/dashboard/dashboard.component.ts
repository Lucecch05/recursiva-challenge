
import { Component, OnInit } from '@angular/core';
import { SociosService } from '../services/socios.service';
import { Socio, SocioFilter } from 'src/app/entities';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';

interface ListaNombres{
  name: string,
  count: number
}

interface ListadoPersonasTable{
  nombre: string,
  edad: number,
  equipo: string,
}

export interface ListadoEquiposTable {
  equipo: string,
  cantidadSocios: number,
  edadMinima: number,
  edadMaxima: number,
  promedioEdad: number
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DashboardComponent implements OnInit {

  socios: Socio[] = [];

  
  
 
 
  // ** INFO ** //
  teamsArray: string[] = [];


  // ** HOME PAGE ** //
  totalSocios: number = 0;

  promedioEdad: number = 0;
  equipoSeleccionadoPE: string = 'Racing';

  nombreComunList: Array<ListaNombres> = [];
  equipoSeleccionadoNC: string = 'River';


  // ** TABLAS PAGE ** //

  // Filtro para ordenar los equipos por socios y edades
  sociosPorEquipo: Array<ListadoEquiposTable> = [];
  sociosPorEquipoColumns = ['posicion','equipo', 'cantidad_socios','edad_menor','edad_mayor','edad_promedio'];

  // Filtro por default para el listado de las 100 primeras personas
  sociosTable: ListadoPersonasTable[] = [];
  sociosTableColumns: string[] = ['posicion','nombre', 'edad', 'equipo'];

  defaultFilters: SocioFilter[] = [
    {
        column: 'estadoCivil',
        operator: 'like',
        value: 'casado'
      },
      {
        column: 'nivelEstudios',
        operator: 'like',
        value: 'Universitario'
      }
  ];

  constructor(private sociosService: SociosService, private router: Router){
  }

  ngOnInit(): void {
    
    this.sociosService.fileData$.subscribe(data => {
      this.socios = data;
      if(this.socios.length == 0) {
        this.router.navigate(['pages/home']); 
        return;
      }
      this.teamsArray = this.sociosService.getColumnsValues(this.socios, 'equipo');
      
      this.totalSocios = this.socios.length;
      
      this.changeSelectedTeamPE('Racing');
      this.changeSelectedTeamNC('River');

      this.filteredSociosTablas(this.socios);

    });
  }

  changeSelectedTeamPE(team: string){
    this.equipoSeleccionadoPE = team;

    const sociosPE = this.sociosService.getSociosFilter(this.socios, [
      { column: 'equipo', operator: 'like', value: this.equipoSeleccionadoPE }
    ]);

    this.promedioEdad = this.sociosService.getPromedioEdad(sociosPE);
  }

  changeSelectedTeamNC(team: string){
    this.equipoSeleccionadoNC = team;

    const sociosNC = this.sociosService.getSociosFilter(this.socios, [
      { column: 'equipo', operator: 'like', value: this.equipoSeleccionadoNC }
    ]);

    this.nombreComunList = this.sociosService.getColumnCount(sociosNC, 'nombre', 'desc').slice(0, 5);
  }

  filteredSociosTablas(socios: Socio[]){
    
    const filterSocios: Socio[] = this.sociosService.getSociosFilter(socios, this.defaultFilters);

    const orderSocios: Socio[] = this.sociosService.orderArray(filterSocios, 'asc', 'edad').splice(0, 100);

    this.sociosTable = orderSocios;


    this.teamsArray.forEach(team => {
      const sociosTeam = this.sociosService.getSociosFilter(socios, [{ column: 'equipo', operator: 'equal', value: team }]);
      const totalSociosTeam = sociosTeam.length;

      const edadesMinMax = this.sociosService.getEdadMinAndMax(sociosTeam);
      const promedioEdad = this.sociosService.getPromedioEdad(sociosTeam);

      this.sociosPorEquipo.push({
        equipo: team,
        cantidadSocios: totalSociosTeam,
        edadMinima: edadesMinMax.min,
        edadMaxima: edadesMinMax.max,
        promedioEdad: promedioEdad
      })
    });

    this.sociosPorEquipo.sort((a, b) => {
      if (a['cantidadSocios'] < b['cantidadSocios']) {
        return 1;
      }
      if (a['cantidadSocios'] > b['cantidadSocios']) {
        return -1;
      }
      return 0;
    })

  }

}
