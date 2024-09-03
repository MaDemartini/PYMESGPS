import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceUsuarioService } from 'src/app/services/service-usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private _usuarioService: ServiceUsuarioService, private router: Router) {
    this.loginForm = this.fb.group({
      correo_us: ['', [Validators.required, Validators.email]],
      contrasena_us: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {}

  onLogin() {
    const { correo_us, contrasena_us } = this.loginForm.value;
    if (this._usuarioService.validar_usuario(correo_us, contrasena_us)) {
      console.log("Usuario existe");
      this.router.navigate(['home']);
    } else {
      console.error("Usuario no existe");
    }
  }
}
