import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

//HZUMAETA: 
export class EventsService {
  private eventSubject = new Subject<any>();  //Actúa como el canal por donde circularán los eventos.
  event$ = this.eventSubject.asObservable();  //observable (event$) para que los componentes puedan suscribirse y recibir notificaciones.
  
  constructor() { }
  emitEvent(data: any) {
  // Cuando un componente quiere enviar un evento, llama al método emitEvent(data).
  // El método emitEvent envía los datos a través del Subject, notificando a todos los suscriptores.
    this.eventSubject.next(data);
  }
}
