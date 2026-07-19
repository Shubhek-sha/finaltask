import type { Meta, StoryObj } from "@storybook/react-vite";
import { useForm } from "react-hook-form";
import { Button } from "../button/Button";
import { Checkbox } from "./Checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./Form";
import { Input } from "./Input";
import { Label } from "./Label";
import { Select } from "./Select";
import { Textarea } from "./Textarea";

interface ProjectFormValues {
  name: string;
  description: string;
  priority: string;
  notifyTeam: boolean;
}

function ProjectForm() {
  const form = useForm<ProjectFormValues>({
    defaultValues: { name: "", description: "", priority: "medium", notifyTeam: true },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() => {})}
        className="w-96 space-y-4"
      >
        <FormField
          control={form.control}
          name="name"
          rules={{ required: "Project name is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Platform Migration" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="What is this project about?" {...field} />
              </FormControl>
              <FormDescription>Optional — shown on the project card.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <FormControl>
                <Select {...field}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notifyTeam"
          render={({ field }) => (
            <FormItem className="flex-row items-center gap-2">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <Label>Notify team on creation</Label>
            </FormItem>
          )}
        />

        <Button type="submit">Create project</Button>
      </form>
    </Form>
  );
}

const meta: Meta<typeof ProjectForm> = {
  title: "Components/Form",
  component: ProjectForm,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ProjectForm>;

export const Default: Story = {};
