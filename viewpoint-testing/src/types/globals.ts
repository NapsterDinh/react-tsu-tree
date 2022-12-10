export {};

declare global {
  interface Window {
    __RUNTIME_CONFIG__: {
      NODE_ENV: string;
      REACT_APP_API_URL: string;
      VERSION: string;
      RELEASE_DATE: string;
    };
  }
}
