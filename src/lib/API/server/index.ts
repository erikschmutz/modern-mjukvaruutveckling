import { Auth } from 'aws-amplify';
import { templates } from './request/template';

const url = 'http://localhost:4000';
export class APIClient {
  templates = templates;

  public async fetch<T>(
    url: string,
    body?: null | object,
    headers?: Headers,
    method?: 'POST' | 'GET'
  ): Promise<T | string> {
    console.log(JSON.stringify(body));
    const res = await fetch(url, {
      body: body ? JSON.stringify(body) : undefined,
      headers,
      method: method || body ? 'POST' : 'GET'
    });
    const contentType = res.headers.get('content-type');
    if (contentType?.toLowerCase().includes('application/json')) return res.json() as Promise<T>;
    else return res.text() as Promise<string>;
  }

  public async get<T>(relativePath: string, headers?: Headers): Promise<T | string> {
    return this.fetch<T>(url + relativePath, null, headers || (await this.getHeaders()));
  }

  public async post<T>(relativePath: string, body: object, headers?: Headers): Promise<T | string> {
    return this.fetch<T>(url + relativePath, body, headers || (await this.getHeaders()));
  }

  public async authenticatedGet<T>(relativePath: string): Promise<T | string> {
    return this.get<T>(relativePath, await this.getHeaders());
  }

  public async authenticatedPost<T>(relativePath: string, body: object): Promise<T | string> {
    return this.post<T>(relativePath, body, await this.getHeaders());
  }

  private async getHeaders(): Promise<Headers> {
    const headers = new Headers();
    const session = await Auth.currentSession();
    const token = session.getIdToken().getJwtToken();

    headers.set('Content-Type', 'application/json');
    headers.set('Authorization', 'Bearer ' + token);

    return headers;
  }
}
