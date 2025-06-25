type MiddlewareFn = (payload: any) => any;

let inboundMiddleware: MiddlewareFn[] = [];
let outboundMiddleware: MiddlewareFn[] = [];

export const useMiddleware = {
  addInbound: (fn: MiddlewareFn) => inboundMiddleware.push(fn),
  addOutbound: (fn: MiddlewareFn) => outboundMiddleware.push(fn),
  applyInbound: (payload: any) => inboundMiddleware.reduce((acc, fn) => fn(acc), payload),
  applyOutbound: (payload: any) => outboundMiddleware.reduce((acc, fn) => fn(acc), payload),
};