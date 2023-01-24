import { HttpReq, HttpRes } from "../types/Http-types";


export default interface iController {
  route(httpRequest: HttpReq) : Promise<HttpRes>,
};;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;