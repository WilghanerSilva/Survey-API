export type HttpReq = {
  body: any;
  headers: any;
}

export type HttpRes = {
  body: {
    message: string,
    data? : any
  };
  statusCode: number;
}