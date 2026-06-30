import { Platform } from "react-native";
import axios, { AxiosHeaders, AxiosInstance, AxiosRequestConfig } from "axios";
import { AppError } from "../helpers/AppError";
import { useUserStore } from "../store/user-store";
import { useCompanyStore } from "../store/company-store";

const getBaseURL = () =>
  __DEV__
    ? Platform.OS === "android"
      ? "http://10.0.2.2:8091"
      : "http://localhost:8091"
    : "https://www.styleappblue.lojinhadoquebrabackend.com.br";

//const getBaseURL = () => {
//  if (__DEV__) {
//    if (Platform.OS === "ios") {
//      return "http://localhost:8091";
//    }
//    if (Platform.OS === "android") {
//      return "www.styleappblue.lojinhadoquebrabackend.com.br";
//    }
//    // fallback (android físico, Windows/macOS RN desktop, etc) http://10.0.2.2:8091
//    return "www.styleappblue.lojinhadoquebrabackend.com.br"; // coloque seu IP  da rede
//  }
//  // Produção
//  return "www.styleappblue.lojinhadoquebrabackend.com.br";
//};

const baseURL = getBaseURL();

export class StyleAppApiClient {
  private instance: AxiosInstance;
  private isRefreshing = false;

  constructor() {
    this.instance = axios.create({
      baseURL: getBaseURL(),
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.instance.interceptors.request.use(
      (config) => {
        const token = useUserStore.getState().access_token;
        const selectedCompanyId = useCompanyStore.getState().selectedCompanyId;

        if (!config.headers) {
          config.headers = new AxiosHeaders();
        }

        if (token) {
          config.headers.set("Authorization", `Bearer ${token}`);
        }

        if (
          selectedCompanyId &&
          config.url &&
          !config.url.startsWith("/companies") &&
          !config.url.startsWith("companies") &&
          !config.url.startsWith("/auth") &&
          !config.url.startsWith("auth") &&
          !config.url.startsWith("/oauth2") &&
          !config.url.startsWith("oauth2")
        ) {
          config.params = {
            companyId: selectedCompanyId,
            ...config.params,
          };
        }

        return config;
      },
      (error) => Promise.reject(error),
    );

    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (!error.response) {
          return Promise.reject(new AppError("Sem conexão com a internet."));
        }

        if (error.response?.status === 401) {
          const originalRequest = error.config;

          // ✅ não faz logout em endpoints que não são de auth
          const skipLogoutUrls = [
            "/oauth2/token",
            "/users/", // update de usuário
            "/auth/",
          ];

          const shouldSkip = skipLogoutUrls.some((url) =>
            originalRequest?.url?.includes(url),
          );

          if (shouldSkip) {
            return Promise.reject(error);
          }

          const token = useUserStore.getState().access_token;
          if (token) {
            useUserStore.getState().logout?.();
          }

          return Promise.reject(new AppError("Sessão expirada."));
        }
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          `Erro ${error.response?.status} em ${error.config?.method?.toUpperCase()} ${error.config?.url}`;

        return Promise.reject(new AppError(message));
      },
    );
  }
  getInstance() {
    return this.instance;
  }
}

export const styleAppApiClient = new StyleAppApiClient().getInstance();
