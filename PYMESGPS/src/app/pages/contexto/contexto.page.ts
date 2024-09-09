import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-contexto',
  templateUrl: './contexto.page.html',
  styleUrls: ['./contexto.page.scss'],
})
export class ContextoPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  volver() {
    this.router.navigate(['/home']); 
  }
  
}
