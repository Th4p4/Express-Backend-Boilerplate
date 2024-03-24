interface Logger {
  info: (msg: string, ...meta: any) => void;
  debug: (msg: string, ...meta: any) => void;
  warn: (msg: string, ...meta: any) => void;
  error: (msg: string, ...meta: any) => void;
}
export type { Logger };
