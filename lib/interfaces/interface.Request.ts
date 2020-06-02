interface IRequest {
  get(url: URL, params?: object): Promise<any>;
}
