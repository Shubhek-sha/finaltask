import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/Button";
import { Toaster } from "./Toaster";
import { toast } from "./use-toast";

const meta: Meta = {
  title: "Components/Toast",
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster />
      </>
    ),
  ],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Button onClick={() => toast({ title: "Heads up", description: "This is a toast notification." })}>
      Show toast
    </Button>
  ),
};

export const Success: Story = {
  render: () => (
    <Button
      variant="secondary"
      onClick={() =>
        toast({ title: "Project created", description: "Your changes were saved.", variant: "success" })
      }
    >
      Show success toast
    </Button>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Button
      variant="destructive"
      onClick={() =>
        toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" })
      }
    >
      Show error toast
    </Button>
  ),
};
