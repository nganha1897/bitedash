export class User {
  constructor(
    public email: string,
    public phone: string,
    public name?: string,
    public type?: string,
    public status?: string,
    public email_verified?: boolean,
    public _id?: string
  ) {}
}
