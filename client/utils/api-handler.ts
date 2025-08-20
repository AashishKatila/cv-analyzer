import { AxiosResponse } from 'axios';
import { http } from './api-utils';
import { toast } from 'sonner';

type HTTPMethod = 'get' | 'post' | 'patch' | 'del' | 'postWithFile';
interface RequestOptions {
  config?: any;
  showToast?: boolean;
}
const handleRequest = async <T = any>(
  method: HTTPMethod,
  url: string,
  data?: any,
  options: RequestOptions = {}
): Promise<T | null> => {
  const { config = {}, showToast = true } = options;
  try {
    let res: AxiosResponse;

    if (method === 'get' || method === 'del') {
      res = await http[method](url, config);
    } else {
      res = await http[method](url, data, config);
    }

    const responseData = res.data as T;

    if (
      showToast &&
      ['post', 'patch', 'del', 'postWithFile'].includes(method)
    ) {
      toast.success(res.data.message || 'Operation successful');
    }

    return responseData;
  } catch (error: any) {
    const message = error?.response?.data?.message || 'An error occurred';
    console.error('Error in handleRequest:', error);

    if (showToast && ['post', 'patch', 'del'].includes(method)) {
      toast.error(message || 'An error occurred');
    }

    return null;
  }
};

export const apiHandler = {
  get: <T = any>(url: string, config: RequestOptions = {}) =>
    handleRequest<T>('get', url, undefined, config),
  post: <T = any>(url: string, data: any, config: RequestOptions = {}) =>
    handleRequest<T>('post', url, data, config),
  patch: <T = any>(url: string, data: any, config: RequestOptions = {}) =>
    handleRequest<T>('patch', url, data, config),
  del: <T = any>(url: string, config: RequestOptions = {}) =>
    handleRequest<T>('del', url, undefined, config),
  postWithFile: <T = any>(
    url: string,
    data: any,
    config: RequestOptions = {}
  ) => handleRequest<T>('postWithFile', url, data, config),
};
