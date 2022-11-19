import { HttpReq, HttpRes } from "../types/Http-types"


export default interface Controller {
  route(httpRequest: HttpReq) : Promise<HttpRes>
}