import { EventEmitter } from "node:events";

const bus = globalThis.__tasitposPaymentEvents || new EventEmitter();
bus.setMaxListeners(100);
globalThis.__tasitposPaymentEvents = bus;

export function publishPaymentEvent(event) {
  bus.emit(`gallery:${event.gallery_id}`, event);
}

export function subscribePaymentEvents(galleryId, listener) {
  const channel = `gallery:${galleryId}`;
  bus.on(channel, listener);
  return () => bus.off(channel, listener);
}

