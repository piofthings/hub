# This document outlines how API end points can be defined using the custom CrossRouter

## Writing a new Controller
1. Controllers inherit from ```BaseController```
2. Constructor of every controller must have the following minimum parameters (can have more)

```
constructor(configuration: Configuration, auther: PassportLocalAuthenticator, logger: any)
{
    super(auther, logger);
    ...
}
```

3. Controllers are registered in the ```di/container.ts``` file as follows in the ```ìnject``` method

```  
/**
* authenticator = instance of PassportLocalAuthenticator
* logger = instance of a bunyan logger
**/

Container.injectController(new PassportLocalController(Container.config, authenticator, logger));
```

## Attribute binding routes to route handlers
The controller pattern roughly mimics the ASP.NET Web API attribute routing mechanism. Since we don't have function
attributes in Typescript yet, we make use the dynamic nature of Javascript and use Keys to define routes in each controller, e.g.

```
onstructor(configuration: Configuration, auther: PassportLocalAuthenticator, logger: any, moscaServer: MoscaServer)
{
    super(auther, logger);
    this.mosquitto = moscaServer;
    this["Device:path"] = "/device/:deviceid:";
}
```
Each path can potentially map to one function for every HTTP action possible, e.g. ```getDevice```, ```putDevice```, ```postDevice```, ```deleteDevice``` etc.  The Key for the path can be anything as long as it is unique. Non-unique paths will basically overwrite their previous ones and the last one will stand.

```
postDevice = (req: Express.Request, res: Express.Response, next, params) => {
    ...
}
```

The DI container automatically registers all the paths defined in each controller to the particular CrossRouter instance, while injecting the controllers.

```
private static injectController = (controller: BaseController) => {
    let keys = Object.keys(controller);
    keys.forEach((key: string)=>{
        if(typeof(controller[key]) == "string"){
            Container.apiRouter.registerRoute(new CrossRoute(controller[key], key.replace(":path", ""), "", controller));
        }
    });
}
```
