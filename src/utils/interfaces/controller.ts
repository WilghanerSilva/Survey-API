import { HttpReq, HttpRes } from "../types/Http-types"


export default interface controller {
  route(httpRequest: HttpReq) : Promise<HttpRes>
}