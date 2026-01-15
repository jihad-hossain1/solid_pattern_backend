export class User {
  constructor(
    public id: number,
    public email: string,
    public username: string,
    public firstName: string | null,
    public lastName: string | null,
    public isActive: boolean,
    public createdAt: Date | null,
    public updatedAt: Date | null,
    public businessId: number
  ) {}

  get name(): string {
    return [this.firstName, this.lastName].filter(Boolean).join(" ");
  }
}
