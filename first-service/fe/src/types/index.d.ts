export {};
declare global {
  interface Window {
    env: { be_url: string; client_id: string; core_client_url: string };
  }
}
