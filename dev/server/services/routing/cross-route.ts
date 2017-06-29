import { BaseController } from "../../api/base-controller";
export class CrossRoute
{
  public route: string;
  public name: string;
  public title: string;
  public controller: BaseController;

  constructor(route: string, name: string, title: string, controller: BaseController)
  {
      this.route = route;
      this.name = name;
      this.title = title;
      this.controller = controller;
  }
}
