export interface RealtimeBus {
  publish<TPayload>(channel: string, event: string, payload: TPayload): void;
  subscribe<TPayload>(
    channel: string,
    handler: (event: string, payload: TPayload) => void,
  ): () => void;
}

interface RealtimeMessage<TPayload> {
  event: string;
  payload: TPayload;
}

/**
 * BroadcastChannel-backed RealtimeBus — simulates "another tab moved a
 * task" with zero server process. See ARCHITECTURE.md §9: this interface
 * is the seam a real socket.io-client implementation could satisfy later
 * without touching anything that calls publish()/subscribe().
 */
class BroadcastChannelBus implements RealtimeBus {
  // A BroadcastChannel never delivers a message back to the exact object
  // instance that sent it (per spec) — even within the same tab. Senders
  // and receivers use separate objects per channel name so that publishing
  // and subscribing from the same tab still works ("incl. sender", per
  // ARCHITECTURE.md §9), not just cross-tab.
  private senders = new Map<string, BroadcastChannel>();
  private receivers = new Map<string, BroadcastChannel>();

  private getSender(name: string): BroadcastChannel {
    let channel = this.senders.get(name);
    if (!channel) {
      channel = new BroadcastChannel(name);
      this.senders.set(name, channel);
    }
    return channel;
  }

  private getReceiver(name: string): BroadcastChannel {
    let channel = this.receivers.get(name);
    if (!channel) {
      channel = new BroadcastChannel(name);
      this.receivers.set(name, channel);
    }
    return channel;
  }

  publish<TPayload>(channel: string, event: string, payload: TPayload): void {
    const message: RealtimeMessage<TPayload> = { event, payload };
    this.getSender(channel).postMessage(message);
  }

  subscribe<TPayload>(
    channel: string,
    handler: (event: string, payload: TPayload) => void,
  ): () => void {
    const target = this.getReceiver(channel);
    const listener = (e: MessageEvent<RealtimeMessage<TPayload>>) => {
      handler(e.data.event, e.data.payload);
    };
    target.addEventListener("message", listener);
    return () => target.removeEventListener("message", listener);
  }
}

/**
 * In-process fallback for environments without BroadcastChannel. Does not
 * cross tab/window boundaries — only used when the real transport is
 * unavailable, so realtime features degrade to "single context only"
 * rather than crashing.
 */
class InProcessBus implements RealtimeBus {
  private handlers = new Map<string, Set<(event: string, payload: unknown) => void>>();

  publish<TPayload>(channel: string, event: string, payload: TPayload): void {
    for (const handler of this.handlers.get(channel) ?? []) {
      handler(event, payload);
    }
  }

  subscribe<TPayload>(
    channel: string,
    handler: (event: string, payload: TPayload) => void,
  ): () => void {
    const set = this.handlers.get(channel) ?? new Set();
    const cast = handler as (event: string, payload: unknown) => void;
    set.add(cast);
    this.handlers.set(channel, set);
    return () => set.delete(cast);
  }
}

export const realtimeBus: RealtimeBus =
  typeof BroadcastChannel !== "undefined" ? new BroadcastChannelBus() : new InProcessBus();
