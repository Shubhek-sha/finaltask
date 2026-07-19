import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "./Avatar";

const meta: Meta<typeof Avatar> = {
  title: "Components/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
  args: {
    fallback: "AL",
    alt: "Ada Lovelace",
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const FallbackOnly: Story = {};

export const WithImage: Story = {
  args: {
    src: "https://i.pravatar.cc/150?img=5",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar fallback="SM" size="sm" />
      <Avatar fallback="MD" size="md" />
      <Avatar fallback="LG" size="lg" />
    </div>
  ),
};
