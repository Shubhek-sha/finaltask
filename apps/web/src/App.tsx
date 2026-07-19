import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Label,
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
  Toaster,
  toast,
} from "@forge/ui";

interface ProjectFormValues {
  name: string;
  description: string;
  priority: string;
  notifyTeam: boolean;
}

const PROJECTS = [
  { id: 1, name: "Platform Migration", owner: "Ada Lovelace", status: "In Progress" },
  { id: 2, name: "Q3 Roadmap", owner: "Grace Hopper", status: "Backlog" },
  { id: 3, name: "Design System", owner: "Alan Turing", status: "Done" },
];

function statusVariant(status: string) {
  if (status === "Done") return "success" as const;
  if (status === "In Progress") return "default" as const;
  return "secondary" as const;
}

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const form = useForm<ProjectFormValues>({
    defaultValues: { name: "", description: "", priority: "medium", notifyTeam: true },
  });

  function onSubmit(values: ProjectFormValues) {
    toast({
      title: "Project created",
      description: `"${values.name}" was added to your workspace.`,
      variant: "success",
    });
    setModalOpen(false);
    form.reset();
  }

  return (
    <main className="mx-auto max-w-4xl space-y-10 p-10">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Forge — Design System</h1>
        <p className="text-sm text-text-muted">
          Phase 1 showcase: every packages/ui component exercised on one page.
        </p>
      </header>

      <section className="flex flex-wrap items-center gap-3">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="link">Link</Button>
        <Button isLoading>Loading</Button>
      </section>

      <section className="flex flex-wrap items-center gap-3">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="destructive">Destructive</Badge>
      </section>

      <section className="flex items-center gap-4">
        <Avatar fallback="AL" alt="Ada Lovelace" />
        <Avatar fallback="GH" alt="Grace Hopper" size="lg" />
        <Avatar fallback="AT" alt="Alan Turing" size="sm" />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
          <CardDescription>A Table component rendering live data.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PROJECTS.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{project.owner}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(project.status)}>{project.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Modal open={modalOpen} onOpenChange={setModalOpen}>
            <ModalTrigger asChild>
              <Button>New project</Button>
            </ModalTrigger>
            <ModalContent>
              <ModalHeader>
                <ModalTitle>Create project</ModalTitle>
                <ModalDescription>
                  A Form wired to react-hook-form, validated on submit.
                </ModalDescription>
              </ModalHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <Label>Notify team on creation</Label>
                      </FormItem>
                    )}
                  />

                  <ModalFooter>
                    <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Create project</Button>
                  </ModalFooter>
                </form>
              </Form>
            </ModalContent>
          </Modal>
        </CardFooter>
      </Card>

      <section>
        <Button
          variant="secondary"
          onClick={() =>
            toast({ title: "Heads up", description: "This is a toast notification." })
          }
        >
          Fire a toast
        </Button>
      </section>

      <Toaster />
    </main>
  );
}

export default App;
