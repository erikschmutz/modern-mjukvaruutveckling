import { APIClient } from '..';

export const templates = {
  createTemplate: (object: object) => new APIClient().authenticatedPost<any>('/templates', object),
  updateTemplate: (template: Partial<any>) =>
    new APIClient().authenticatedPost<any>('/templates/' + template.id, template),
  getSignedURL: (id: string, filename: string, filetype: string, intent: 'put' | 'get' | 'delete' = 'put') => {
    const params = new URLSearchParams();
    params.append('filetype', filetype);
    params.append('filename', filename);
    params.append('intent', intent);

    return new APIClient().authenticatedGet<string>('/templates/' + id + '/url?' + params.toString());
  },
  getAll: () => new APIClient().get<any[]>('/templates/')
};
