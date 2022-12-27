export type Request = {
  servers: {
    original: string;
    compare: string;
  }
  requests: {
    [ key: string ]: {
      url?: string
      urls?: string[]
      method: 'GET' | 'POST' | 'PUT' | 'DELETE'
      headers?: object
      data?: object
      ignore?: string
    }
  }
}