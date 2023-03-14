export class User {
  _id: string = '';

  name: string = '';

  login: string = '';

  constructor(_id: string, name: string, login: string) {
    this._id = _id;
    this.name = name;
    this.login = login;
  }
}
