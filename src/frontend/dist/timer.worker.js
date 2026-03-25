/**
 * ChronoFlow Timer Web Worker
 * Runs setInterval off the main thread for accurate, throttle-free timing.
 * Messages in:  { type: 'START', remaining: number }  -- remaining in ms
 *               { type: 'PAUSE' }
 *               { type: 'STOP' }
 * Messages out: { type: 'TICK', elapsed: number }      -- ms since START
 */

let interval = null;
let startTime = null;

self.onmessage = function (e) {
  var data = e.data;

  if (data.type === 'START') {
    // Clear any existing interval first
    if (interval !== null) {
      clearInterval(interval);
      interval = null;
    }
    startTime = Date.now();
    interval = setInterval(function () {
      var elapsed = Date.now() - startTime;
      self.postMessage({ type: 'TICK', elapsed: elapsed });
    }, 50);
  }

  if (data.type === 'PAUSE' || data.type === 'STOP') {
    if (interval !== null) {
      clearInterval(interval);
      interval = null;
    }
    startTime = null;
  }
};
