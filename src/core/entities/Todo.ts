export class Todo {
  constructor(
    public id: number,
    public userId: number,
    public title: string,
    public description: string | null,
    public completed: boolean,
    public createdAt: Date | null,
    public updatedAt: Date | null
  ) {}
}
