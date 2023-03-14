export class Board {
  _id: string;

  title: string;

  owner: string;

  users: string[];

  constructor(
    _id: string = '',
    title: string = '',
    owner: string = '',
    users: string[] = []
  ) {
    this._id = _id;
    this.title = title;
    this.owner = owner;
    this.users = users;
  }
}
