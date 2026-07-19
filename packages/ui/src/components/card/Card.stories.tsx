import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./Card";
import { Button } from "../button/Button";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Project settings</CardTitle>
        <CardDescription>Manage members, permissions, and integrations.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-text-muted">Card body content goes here.</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm">
          Cancel
        </Button>
        <Button size="sm" className="ml-2">
          Save
        </Button>
      </CardFooter>
    </Card>
  ),
};
