import type { Meta, StoryObj } from "@storybook/react-vite";
import { Can } from "./Can";
import { Badge } from "../badge/Badge";

const meta: Meta<typeof Can> = {
  title: "Components/Can",
  component: Can,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Can>;

export const AdminSeesWriteAction: Story = {
  args: {
    permissions: { "employee:write": true },
    I: "employee:write",
    children: <Badge variant="success">Invite employee</Badge>,
    fallback: <Badge variant="secondary">View only</Badge>,
  },
};

export const EmployeeIsFilteredOut: Story = {
  args: {
    permissions: { "employee:write": false },
    I: "employee:write",
    children: <Badge variant="success">Invite employee</Badge>,
    fallback: <Badge variant="secondary">View only</Badge>,
  },
};
