export class User {
  constructor(
    public id: number,
    public email: string,
    public name: string | null,
    public createdAt: Date | null,
    public updatedAt: Date | null
  ) {}
}
