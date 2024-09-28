import { ReloadIcon } from "@radix-ui/react-icons";
import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, Link, redirect, useFetcher, useLoaderData, useNavigation } from "@remix-run/react";
import clsx from "clsx";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { CustomTextField } from "~/components/ui/textfield";
import { createBoard, deleteBoard, getBoards } from "~/queries/board";
import { unstable_data as data } from "@remix-run/node";
import invariant from "tiny-invariant";


export const INTENTS = {
    deleteBoard: "deleteBoard",
    createBoard: "createBoard",
};

export async function loader() {
    const boards = await getBoards();
    return { boards };
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const intent = String(formData.get("intent") || "");

    invariant(typeof intent === "string", "Expected intent to be a string");
    invariant(intent !== "", "intent is required");

    if (intent === INTENTS.createBoard) {

        const name = String(formData.get("name") || "");
        invariant(typeof name === "string", "Expected intent to be a string");
        invariant(name !== "", "Name is required");

        //await new Promise((resolve) => setTimeout(resolve, 2000));

        const board = await createBoard({ name: name });
        return redirect(`/boards/${board.id}`);
    }

    if (intent === INTENTS.deleteBoard) {

        const id = String(formData.get("id") || "");
        const numberId = Number(id);
        invariant(!isNaN(numberId), "Id must be a number");
        invariant(Number.isInteger(numberId), "Id must be an integer");
        invariant(numberId > 0, "Id must be greater than 0");

        //await new Promise((resolve) => setTimeout(resolve, 2000));

        await deleteBoard(numberId);
        return { ok: true };
    }

    throw data(`Invalid intent: ${intent}`,
        {
            status: 400,
            statusText: "Bad Request"
        });
}


export const meta: MetaFunction = () => {
    return [
        { title: "Boards - Trellix Demo" }
    ];
};

export default function Boards() {
    const { boards } = useLoaderData<typeof loader>();

    return (
        <>
            <CreateBoard />

            <div className="mt-5">
                <h2 className="text-xl font-semibold">Boards</h2>
            </div>

            <div className={clsx("flex flex-wrap gap-4", "justify-center md:justify-start")}>
                {boards.map((board) => (
                    <Board key={board.id} board={board} />
                ))}
            </div>
        </>
    );
}

function CreateBoard() {

    const navigation = useNavigation();
    const isCreating = navigation.formData?.get("intent") === INTENTS.createBoard;

    return (
        <div className="w-full flex justify-center md:justify-start">
            <Card className="w-[280px]">
                <CardHeader>
                    <CardTitle>Create a new board</CardTitle>
                    <CardDescription className="sr-only">Create a new board</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form className="flex flex-col gap-2" method="post">
                        <input type="hidden" name="intent" value={INTENTS.createBoard} />
                        <CustomTextField
                            label="Board name"
                            type="text"
                            name="name"
                            isRequired
                            minLength={3}
                            maxLength={25}
                        />
                        <Button className="w-full" type="submit" isDisabled={isCreating}>
                            {isCreating &&
                                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                            }
                            {isCreating ? "Creating..." : "Create"}
                        </Button>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

type BoardProps = {
    board: {
        id: number;
        name: string;
    }
}

function Board({ board }: BoardProps) {

    const fetcher = useFetcher();
    const isDeleting = fetcher.state !== "idle";

    return isDeleting ? null : (
        <Link to={`/boards/${board.id}`}>
            <Card key={board.id} className="w-[280px] cursor-pointer">
                <CardHeader>
                    <CardTitle>{board.name}</CardTitle>
                    <CardDescription className="sr-only">{board.name}</CardDescription>
                </CardHeader>

                <CardContent className="grid gap-4">
                    {board.name}
                </CardContent>

                <CardFooter>
                    <fetcher.Form method="post" className="w-full">
                        <input type="hidden" name="intent" value={INTENTS.deleteBoard} />
                        <input type="hidden" name="id" value={board.id} />
                        <Button className="w-full" type="submit">
                            Delete
                        </Button>
                    </fetcher.Form>
                </CardFooter>
            </Card>
        </Link>
    );
}



