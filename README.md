# Typescript Backend Skeleton

Please use VSCode as your text editor.

## VSCode Extensions

Required:

- Coverage Gutter
- Prettier

Optional:

- VSCode Greate Icons

## Running Project

```
make dev
```

## Enviroment Variables

You can store environment variables in `.env`

It should contains following fields:

| Name                         | Description                                            |
| ---------------------------- | ------------------------------------------------------ |
| MONGODB_HOST                 | Mongo Host                                             |
| MONGODB_PORT                 | Mongo Port                                             |
| MONGODB_DB_NAME              | Mongo DB name                                          |
| PORT                         | Port open for access, default is 3000                  |
| NODE_TLS_REJECT_UNAUTHORIZED | 0 if you are working in local environment              |
| CORS                         | Allowed domain, default is `*`                         |
| GRAPHITE_HOST                | Graphite host, default is `plaintext://localhost:2003` |
| LOG_DIR                      | Logstash folder, default is `/tmp`                     |
| ENABLE_CONSOLE_LOG           | `1` for enable console log                             |

## Adding New Controller

We are using `Inversify.js` as our DI framework

### Controller

`controller` layer only talk to `service` layer

`controller` contains all routing configurations

```ts
// controller/session.ts

import {
  controller,
  httpGet,
  BaseHttpController
} from "inversify-express-utils";
import { inject } from "inversify";
import { ISession, SessionService } from "../service/session";
import { Request } from "express";
import TYPES from "../constant/types";

@controller("/session")
export class SessionController extends BaseHttpController {
  constructor(
    @inject(TYPES.SessionService) private sessionService: SessionService
  ) {
    super();
  }

  @httpGet("/")
  public get() {
    console.log(this.sessionService);
    return this.ok("ok");
  }
}
```

## Service

`service` layer will connect to data sources / other web services

```ts
// service/session.ts

import { injectable } from "inversify";

export interface ISession {
  userId: string;
  token: string;
}

@injectable()
export class SessionService {}
```

## Type

`types` contains all symbol for injectable dependency

```ts
// constant/types.ts

const TYPES = {
  SessionService: Symbol.for("SessionService")
};

export default TYPES;
```

## Server

`server` will bootstrap all component

```ts
// server.ts

import "reflect-metadata";
import { InversifyExpressServer } from "inversify-express-utils";
import { Container } from "inversify";
import * as bodyParser from "body-parser";
import TYPES from "./constant/types";
import "./controller/session";
import { ServiceLogger } from "./utils/Logger/service.logger";
import { SessionService } from "./service/session";

// Load everything needed to the Container
const container = new Container();
container.bind<UserService>(TYPES.UserService).to(UserService);
container.bind<SessionService>(TYPES.SessionService).to(SessionService);

// Start the server
const server = new InversifyExpressServer(container, null, {
  rootPath: "/api/v1"
});

server.setConfig(app => {
  app.use(
    bodyParser.urlencoded({
      extended: true
    })
  );
  app.use(bodyParser.json());
});

const serverInstance = server.build();

const port: string = process.env.PORT || "3000";

serverInstance.listen(parseInt(port));

console.log(`Server started on port ${port}`);
```

## Clean Up

```sh
docker rm $(docker ps -q -f 'status=exited')
docker rmi $(docker images -q -f "dangling=true")
```
