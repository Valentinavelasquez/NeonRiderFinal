import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../services/user/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {
  userService = inject(User)
  formUser!: FormGroup
  //formValidPSWD!: FormControl

  constructor(private fb: FormBuilder, private router: Router){
    this.formUser = fb.group({
      nombre: [""],
      apellido: [""],
      correo: [""],
      password: [""],
      confirmPassword: [""]
    })
  }

  registrarse() {
    if (this.formUser.valid) {
      this.userService.register(this.formUser.value).subscribe({
        next:(dataApi:any)=>{
          Swal.fire({
            title: "¡Registro exitoso!",
            icon: "success",
            draggable: true
          })
        console.log(dataApi);
        this.formUser.reset()
        this.router.navigate(['/loguin'])
      },
        error:(error:any)=>{
          console.log(error);
          Swal.fire({
            title:"¡Error!",
            icon:"warning",
            draggable:true
          })
        }
      })
    } else {
      Swal.fire({
        title:"¡Error!",
        icon:"warning",
        text:"El registro no es válido, por favor,intente nuevamente.",
        draggable:true
      })
    }
  }
}
// nombre: ["", Validators.required, Validators.minLength(2), Validators.maxLength(60), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$')],
//       apellido: ["", Validators.required, Validators.minLength(2), Validators.maxLength(60), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$')],
//       correo: ["", Validators.required, Validators.email],
//       password: ["", Validators.required, Validators.minLength(8), Validators.maxLength(64), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$')],
//       confirmPassword: ["", Validators.required, Validators.minLength(8), Validators.maxLength(64), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$')]
