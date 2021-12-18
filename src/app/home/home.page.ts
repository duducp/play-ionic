import { Component, OnInit, ViewChild } from '@angular/core';
import {AlertController, IonSearchbar, LoadingController} from '@ionic/angular';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  @ViewChild('search', { static: false }) search: IonSearchbar;

  public list: Array<object> = [];
  public searchedItem: any;
  public url: string;
  public authorization: string;
  public username: string;
  public password: string;

  constructor(
    public http: HttpClient,
    public alertController: AlertController,
    public loadingController: LoadingController,
  ) {
    this.searchedItem = [];
    this.url = 'https://play-nas-ferias.herokuapp.com/party/tickets/';
    this.username = null;
    this.authorization = null;
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.search.setFocus();
    });
  }

  _ionSearchClear() {
    this.searchedItem = [];
  }

  _ionSearch(event) {
    if (!event.detail.value.trim()) {
      return;
    }

    this.loadingController.create({
      message: 'Buscando ingresso...',
    }).then(loading => {
      loading.present();

      const params = new HttpParams().set('value', event.detail.value.trim());

      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json');
      headers = headers.set('Accept', 'application/json');
      headers = headers.set('Authorization', this.authorization);

      this.http.get(
        this.url,
        { params, headers }
      ).subscribe(data => {
        this.searchedItem = data;
        loading.dismiss();
      }, error => {
        loading.dismiss();
        this.alertController.create({
          header: 'Erro',
          message: 'Não foi possível buscar o ingresso.',
          buttons: ['OK'],
        }).then(res => {
          res.present();
        });
      });
    });
  }

  _validateTicket(item) {
    this.loadingController.create({
      message: 'Validando ingresso...',
    }).then(loading => {
      loading.present();

      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json');
      headers = headers.set('Accept', 'application/json');
      headers = headers.set('Authorization', this.authorization);

      this.http.put(
        this.url,
        {
          id: item.id
        },
        {headers}
      ).subscribe(data => {
        loading.dismiss();

        this.alertController.create({
          header: 'Sucesso',
          message: 'Ingresso válidado com sucesso!',
          buttons: ['OK'],
        }).then(alert => {
          alert.present();
        });

        item.validated = true;
      }, error => {
        loading.dismiss();

        this.alertController.create({
          header: 'Erro',
          message: 'Não foi possível validar o ingresso.',
          buttons: ['OK'],
        }).then(alert => {
          alert.present();
        });
      });
    });
  }

  _getFirstAndLastName(name: string) {
    const last = name.split(' ').pop();
    const first = name.split(' ')[0];

    return `${first} ${last}`;
  }

  async _modalLogin() {
    const alert = await this.alertController.create({
      header: 'Autenticar',
      inputs: [
        {
          name: 'username',
          type: 'text',
          placeholder: 'Usuário'
        },
        {
          name: 'password',
          type: 'password',
          placeholder: 'Senha',
          cssClass: 'specialClass',
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: async (data) => {
            await this.login(data.password, data.username);
          }
        }
      ]
    });
    alert.present();
  }

  _logout() {
    this.username = null;
    this.authorization = null;
    this.searchedItem = [];
  }

  async login(password: string, username: string) {
    this.loadingController.create({
      message: 'Aguarde...',
    }).then(loading => {
      loading.present();

      const authorization = 'Basic ' + btoa(`${username}:${password}`);

      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json');
      headers = headers.set('Accept', 'application/json');
      headers = headers.set('Authorization', authorization);

      this.http.get(
        this.url + 'login/',
        {headers}
      ).subscribe(_ => {
        loading.dismiss();

        this.username = username;
        this.authorization = authorization;
        this.alertController.create({
          header: 'Sucesso',
          message: 'Autenticação realizada com sucesso!',
          buttons: ['OK'],
        }).then(alert => {
          alert.present();
        });
      }, error => {
        loading.dismiss();

        this.alertController.create({
          header: 'Erro',
          message: 'Usuário ou senha inválidos!',
          buttons: ['OK'],
        }).then(alert => {
          alert.present();
        });
      });
    });
  }
}
