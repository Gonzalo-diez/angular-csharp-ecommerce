import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalService {
  private hubConnection!: signalR.HubConnection;
  private cartUpdates = new BehaviorSubject<any>(null);
  cartUpdates$ = this.cartUpdates.asObservable();

  constructor() {}

  // 🔹 Iniciar conexión con el backend
  startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5169/cartHub', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('✅ Conectado a SignalR'))
      .catch(err => console.error('❌ Error al conectar SignalR:', err));

    // 📌 Escuchar eventos del backend
    this.hubConnection.on('CartUpdated', (cartData) => {
      console.log('📦 Carrito actualizado:', cartData);
      this.cartUpdates.next(cartData);
    });

    this.hubConnection.on('CartCleared', () => {
      console.log('🗑️ Carrito vaciado');
      this.cartUpdates.next({ items: [] }); // Emitir carrito vacío
    });
  }

  // 🔹 Enviar actualización del carrito al backend
  sendUpdate(userId: number, cartData: any) {
    if (!this.hubConnection || this.hubConnection.state !== signalR.HubConnectionState.Connected) {
      console.warn('⚠️ No hay conexión activa con SignalR');
      return;
    }

    this.hubConnection.invoke('NotifyCartUpdated', userId.toString(), cartData)
      .catch(err => console.error('❌ Error enviando datos:', err));
  }

  // 🔹 Notificar que el carrito ha sido vaciado
  sendClearNotification(userId: number) {
    if (!this.hubConnection || this.hubConnection.state !== signalR.HubConnectionState.Connected) {
      console.warn('⚠️ No hay conexión activa con SignalR');
      return;
    }

    this.hubConnection.invoke('NotifyCartCleared', userId.toString())
      .catch(err => console.error('❌ Error notificando carrito vaciado:', err));
  }

  // 🔹 Detener conexión cuando el usuario se desconecta
  stopConnection() {
    if (this.hubConnection) {
      this.hubConnection.stop()
        .then(() => console.log('⏹️ Conexión con SignalR cerrada'))
        .catch(err => console.error('❌ Error al cerrar conexión:', err));
    }
  }
}
