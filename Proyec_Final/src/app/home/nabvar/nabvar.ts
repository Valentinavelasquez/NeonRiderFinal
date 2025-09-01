import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nabvar',
  imports: [RouterLink],
  templateUrl: './nabvar.html',
  styleUrl: './nabvar.css'
})
export class Nabvar {
loguiado :boolean = !!sessionStorage.getItem('token')
  ngOnInit(){
    this.loguiado=!!sessionStorage.getItem('token')
  }

  ngDoCheck(){
    this.loguiado=!!sessionStorage.getItem('token')

  }

  logout(){
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
  }
}
