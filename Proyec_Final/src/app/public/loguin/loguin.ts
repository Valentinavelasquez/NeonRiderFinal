import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../services/user/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-loguin',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './loguin.html',
  styleUrl: './loguin.css'
})
export class Loguin {
  userService = inject(User)
  formLogin!: FormGroup

  constructor (private fb: FormBuilder, private router : Router){
    this.formLogin = fb.group({
      correo: ["", Validators.required],
      password: ["", Validators.required],
    })
  }

  loggeo() {
    console.log(this.formLogin.value)
    console.log(this.formLogin.valid);

    if (this.formLogin.valid){
      this.userService.login(this.formLogin.value).subscribe({
        next:(dataApi:any)=>{
          sessionStorage.setItem('token', dataApi.token)
          sessionStorage.setItem('user', dataApi.id)
          console.log(dataApi.id);

          Swal.fire({
            title: "¡Inicio de sesión exitoso!",
            icon: "success",
            draggable: true
          })
          console.log(dataApi);
            this.formLogin.reset()
            this.router.navigate(['/dashboard'])
        },
        error:(error:any)=>{
          console.log(error);
          Swal.fire({
            title:"¡Datos incorrectos!, intenta nuevamente",
            icon:"warning",
            draggable:true
          })
        }
      })
    } else {
        Swal.fire({
        title:"¡Error!",
        icon:"warning",
        text:"Ingrese sus datos para poder iniciar sesión.",
        draggable:true
      })
    }
  }
}
