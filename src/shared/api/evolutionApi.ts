import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

const getBaseURL = () => {
  return 'http://129.80.125.205:8081';
};

const baseURL = getBaseURL();

export class EvolutionApiClient {
  private instance: AxiosInstance;
  private isRefreshing = false;

  constructor() {
    this.instance = axios.create({
      baseURL,
    });


  }

  getInstance() {
    return this.instance;
  }

  
}

export const evolutionApiClient = new EvolutionApiClient().getInstance();
