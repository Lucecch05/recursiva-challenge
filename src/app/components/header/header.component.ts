import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  actualRoute: string = '';

  constructor(private router: Router){}

  ngOnInit(): void {

  }

  goTohome(){
    if (this.router.url != '/pages/home')
      this.router.navigate(['pages/home']);
  }
 

}
