import type { Meta, StoryObj } from "@storybook/react-vite";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./Table";
import { Badge } from "../badge/Badge";

const meta: Meta<typeof Table> = {
  title: "Components/Table",
  component: Table,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Table>;

const ROWS = [
  { name: "Platform Migration", owner: "Ada Lovelace", status: "In Progress" },
  { name: "Q3 Roadmap", owner: "Grace Hopper", status: "Backlog" },
  { name: "Design System", owner: "Alan Turing", status: "Done" },
];

export const Default: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ROWS.map((row) => (
          <TableRow key={row.name}>
            <TableCell className="font-medium">{row.name}</TableCell>
            <TableCell>{row.owner}</TableCell>
            <TableCell>
              <Badge variant={row.status === "Done" ? "success" : "secondary"}>{row.status}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};
