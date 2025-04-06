import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SignalService {
  private cartHubConnection!: signalR.HubConnection;
  private authHubConnection!: signalR.HubConnection;

  private cartUpdates = new BehaviorSubject<any>(null);
  cartUpdates$ = this.cartUpdates.asObservable();

  private authUpdates = new BehaviorSubject<any>(null);
  authUpdates$ = this.authUpdates.asObservable();

  constructor() {}

  // ✅ Nuevo método para iniciar ambas conexiones
  startConnections() {
    this.startCartConnection();
    this.startAuthConnection();
  }

  private startCartConnection() {
    this.cartHubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5169/cartHub', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();

    this.cartHubConnection
      .start()
      .then(() => console.log('✅ Conectado a CartHub'))
      .catch((err) => console.error('❌ Error al conectar con CartHub:', err));

    this.cartHubConnection.on('CartUpdated', (cartData) => {
      console.log('📦 Carrito actualizado:', cartData);
      this.cartUpdates.next(cartData);
    });

    this.cartHubConnection.on('CartCleared', () => {
      console.log('🗑️ Carrito vaciado');
      this.cartUpdates.next({ items: [] });
    });
  }

  private startAuthConnection() {
    this.authHubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5169/authHub', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();

    this.authHubConnection
      .start()
      .then(() => console.log('✅ Conectado a AuthHub'))
      .catch((err) => console.error('❌ Error al conectar con AuthHub:', err));

    this.authHubConnection.on('UserLoggedIn', (user) => {
      console.log('🔐 Usuario inició sesión:', user);
      this.authUpdates.next({ type: 'login', user });
    });

    this.authHubConnection.on('UserRegistered', (user) => {
      console.log('📝 Usuario registrado:', user);
      this.authUpdates.next({ type: 'register', user });
    });

    this.authHubConnection.on('UserLoggedOut', (user) => {
      console.log('🚪 Usuario cerró sesión:', user);
      this.authUpdates.next({ type: 'logout', user });
    });
  }

  // ✅ Verificación previa antes de invocar métodos
  sendLoginNotification(user: any) {
    if (this.authHubConnection?.state !== signalR.HubConnectionState.Connected) {
      console.warn('⚠️ AuthHub no está conectado (login)');
      return;
    }

    this.authHubConnection
      .invoke('NotifyLogin', user.id, user.email)
      .catch((err) => console.error('❌ Error notificando login:', err));
  }

  sendRegisterNotification(user: any) {
    if (this.authHubConnection?.state !== signalR.HubConnectionState.Connected) {
      console.warn('⚠️ AuthHub no está conectado (registro)');
      return;
    }

    this.authHubConnection
      .invoke('NotifyRegister', user.id, user.email)
      .catch((err) => console.error('❌ Error notificando registro:', err));
  }

  sendLogoutNotification(userId: number) {
    if (this.authHubConnection?.state !== signalR.HubConnectionState.Connected) {
      console.warn('⚠️ AuthHub no está conectado (logout)');
      return;
    }

    this.authHubConnection
      .invoke('NotifyLogout', userId)
      .catch((err) => console.error('❌ Error notificando logout:', err));
  }

  sendUpdate(userId: number, cartData: any) {
    if (this.cartHubConnection?.state !== signalR.HubConnectionState.Connected) {
      console.warn('⚠️ CartHub no está conectado');
      return;
    }

    this.cartHubConnection
      .invoke('NotifyCartUpdated', userId.toString(), cartData)
      .catch((err) => console.error('❌ Error enviando datos:', err));
  }

  sendClearNotification(userId: number) {
    if (this.cartHubConnection?.state !== signalR.HubConnectionState.Connected) {
      console.warn('⚠️ CartHub no está conectado');
      return;
    }

    this.cartHubConnection
      .invoke('NotifyCartCleared', userId.toString())
      .catch((err) => console.error('❌ Error notificando carrito vaciado:', err));
  }

  stopConnections() {
    if (this.cartHubConnection) {
      this.cartHubConnection
        .stop()
        .then(() => console.log('⏹️ Conexión con CartHub cerrada'))
        .catch((err) => console.error('❌ Error al cerrar CartHub:', err));
    }

    if (this.authHubConnection) {
      this.authHubConnection
        .stop()
        .then(() => console.log('⏹️ Conexión con AuthHub cerrada'))
        .catch((err) => console.error('❌ Error al cerrar AuthHub:', err));
    }
  }
}
