import axios from 'axios';

export abstract class Service {
  protected static client = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  });

  static setToken(token: string) {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  static removeToken() {
    delete this.client.defaults.headers.common['Authorization'];
  }
}
