import { describe, expect, it, vi } from "vitest";
import { realtimeBus } from "../realtime";

describe("realtimeBus", () => {
  it("delivers published events to subscribers on the same channel", async () => {
    const handler = vi.fn();
    const unsubscribe = realtimeBus.subscribe("board:1", handler);

    realtimeBus.publish("board:1", "task.moved", { taskId: "t1", column: "in_progress" });

    await vi.waitFor(() => {
      expect(handler).toHaveBeenCalledWith("task.moved", { taskId: "t1", column: "in_progress" });
    });

    unsubscribe();
  });

  it("does not deliver events to a different channel", async () => {
    const handler = vi.fn();
    const unsubscribe = realtimeBus.subscribe("board:2", handler);

    realtimeBus.publish("board:3", "task.moved", { taskId: "t2" });

    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(handler).not.toHaveBeenCalled();

    unsubscribe();
  });

  it("stops delivering events after unsubscribe", async () => {
    const handler = vi.fn();
    const unsubscribe = realtimeBus.subscribe("board:4", handler);
    unsubscribe();

    realtimeBus.publish("board:4", "task.moved", { taskId: "t3" });
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(handler).not.toHaveBeenCalled();
  });
});
