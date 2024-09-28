import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { buttonVariants } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";

export const meta: MetaFunction = () => {
  return [
    { title: "Boards - Trellix Demo" }
  ];
};

export default function Index() {

  return (
    <div className={"flex flex-grow justify-center items-center"}>
      <Card>
        <CardHeader>
          <CardTitle>Trello Drag & Drop Clone</CardTitle>
          <CardDescription className="sr-only">Manage your boards</CardDescription>
        </CardHeader>
        <CardContent>
          This is just a clone demo of drag and drop feature from trello.
        </CardContent>
        <CardFooter>
          <Link to="/boards" className={buttonVariants({ variant: "default" })}>
            Go to boards
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}





