export interface EcEvent {
  name: string;
  once: boolean;
  execute(client: any): void;
}

export interface EcLavaLink {
  name: string;
  once: boolean;
  execute(...args: any[]): void;
}
