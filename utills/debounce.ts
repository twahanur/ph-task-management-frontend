/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface DebounceOptions {
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number | null;
}

export interface DebouncedFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): ReturnType<T> | undefined;
  cancel: () => void;
  flush: () => ReturnType<T> | undefined;
  pending: () => boolean;
}

export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay = 500,
  options: DebounceOptions = {}
): DebouncedFunction<T> {
  let timerId: ReturnType<typeof setTimeout> | null = null;
  let lastCallTime: number | undefined;
  let lastInvokeTime = 0;
  let lastArgs: Parameters<T> | undefined;
  let lastThis: any;
  let result: ReturnType<T> | undefined;

  const { leading = false, trailing = true, maxWait = null } = options;

  const invoke = (context: any, args: Parameters<T>) => {
    lastInvokeTime = Date.now();
    result = fn.apply(context, args);
    return result;
  };

  const startTimer = (callback: () => void, wait: number) => {
    return setTimeout(callback, wait);
  };

  const remainingWait = (time: number) => {
    const sinceLastCall = time - (lastCallTime ?? 0);
    const sinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = delay - sinceLastCall;
    return maxWait ? Math.min(timeWaiting, maxWait - sinceLastInvoke) : timeWaiting;
  };

  const shouldInvoke = (time: number) => {
    if (lastCallTime === undefined) return true;

    const sinceLastCall = time - lastCallTime;
    const sinceLastInvoke = time - lastInvokeTime;

    return (
      sinceLastCall >= delay ||
      sinceLastCall < 0 ||
      (maxWait !== null && sinceLastInvoke >= maxWait)
    );
  };

  const trailingEdge = (time: number) => {
    timerId = null;
    if (trailing && lastArgs) return invoke(lastThis, lastArgs);
    lastArgs = lastThis = undefined;
    return result;
  };

  function timerExpired() {
    const now = Date.now();
    if (shouldInvoke(now)) return trailingEdge(now);
    timerId = startTimer(timerExpired, remainingWait(now));
  }

  const debounced = function (this: any, ...args: Parameters<T>) {
    const now = Date.now();
    const isInvoking = shouldInvoke(now);

    lastArgs = args;
    lastThis = this;
    lastCallTime = now;

    if (isInvoking) {
      if (!timerId && leading) {
        return invoke(lastThis, lastArgs);
      }
      if (timerId) clearTimeout(timerId);
      timerId = startTimer(timerExpired, delay);
    } else if (!timerId) {
      timerId = startTimer(timerExpired, delay);
    }

    return result;
  } as DebouncedFunction<T>;

  debounced.cancel = () => {
    if (timerId) clearTimeout(timerId);
    timerId = null;
    lastArgs = lastThis = undefined;
    lastCallTime = undefined;
  };

  debounced.flush = () => {
    if (!timerId) return result;
    return trailingEdge(Date.now());
  };

  debounced.pending = () => !!timerId;

  return debounced;
}