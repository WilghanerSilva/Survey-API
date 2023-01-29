import { HttpReq, HttpRes } from "../types/Http-types";


interface iController {
  route(httpRequest: HttpReq) : Promise<HttpRes>,
}

export default iController;