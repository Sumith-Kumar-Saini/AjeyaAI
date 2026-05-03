import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { DashboardCard } from "@/components/dashboard-card";
import { RecentSales } from "@/components/recent-projects";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/(non-public)/dashboard/(overview)/")({
  component: RouteComponent,
});

const data01 = {
  heading: "Total Projects",
  count: "134",
  description: "Total Projects",
};
const data02 = {
  heading: "Total Documents",
  count: "134",
  description: "description",
};
const data03 = {
  heading: "Processed Documents",
  count: "134",
  description: "description",
};

function RouteComponent() {
  return (
    <>
      <SiteHeader heading="Overview" />
      {/* <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 sm:grid-cols-2 xl:grid-cols-4 pt-20"> */}
      <div className="flex flex-col justify-center gap-4 px-4 lg:px-6 pt-20">
        {/* <div className="flex gap-4">
          <DashboardCard detail={{ ...data01 }} />
          <DashboardCard detail={{ ...data02 }} />
          <DashboardCard detail={{ ...data03 }} />
        </div> */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">50</div>
              <p className="text-xs text-muted-foreground">
                +180.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Processed Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">34</div>
              <p className="text-xs text-muted-foreground">
                +19% from last month
              </p>
            </CardContent>
          </Card>
        </div>
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>
              You Create 265 Projects this month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-25">Recent Projects</TableHead>
                  <TableHead>Total Features</TableHead>
                  <TableHead>Accepted</TableHead>
                  <TableHead>Rejected</TableHead>
                  <TableHead>Nutral</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">INV001</TableCell>
                  <TableCell>Paid</TableCell>
                  <TableCell>Credit Card</TableCell>
                  <TableCell>$250.00</TableCell>
                  <TableCell>$250.00</TableCell>
                  <TableCell className="text-right">
                    <Link
                      to="/dashboard/$projectId"
                      params={{ projectId: "asdf" }}
                    >
                      <Button className="rounded-sm cursor-pointer">view Project</Button>
                    </Link>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">INV001</TableCell>
                  <TableCell>Paid</TableCell>
                  <TableCell>Credit Card</TableCell>
                  <TableCell>$250.00</TableCell>
                  <TableCell>$250.00</TableCell>
                  <TableCell className="text-right">
                    <Link
                      to="/dashboard/$projectId"
                      params={{ projectId: "asdf" }}
                    >
                      <Button className="rounded-sm cursor-pointer">view Project</Button>
                    </Link>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">INV001</TableCell>
                  <TableCell>Paid</TableCell>
                  <TableCell>Credit Card</TableCell>
                  <TableCell>$250.00</TableCell>
                  <TableCell>$250.00</TableCell>
                  <TableCell className="text-right">
                    <Link
                      to="/dashboard/$projectId"
                      params={{ projectId: "asdf" }}
                    >
                      <Button className="rounded-sm cursor-pointer">view Project</Button>
                    </Link>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">INV001</TableCell>
                  <TableCell>Paid</TableCell>
                  <TableCell>Credit Card</TableCell>
                  <TableCell>$250.00</TableCell>
                  <TableCell>$250.00</TableCell>
                  <TableCell className="text-right">
                    <Link
                      to="/dashboard/$projectId"
                      params={{ projectId: "asdf" }}
                    >
                      <Button className="rounded-sm cursor-pointer">view Project</Button>
                    </Link>
                  </TableCell>
                </TableRow>
                <TableCaption>
                  <Link to="/dashboard/projects">
                    <Button className="rounded-sm cursor-pointer">View ALL Projects</Button>
                  </Link>
                  </TableCaption>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
