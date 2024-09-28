import { ActionFunctionArgs, unstable_data as data, LoaderFunctionArgs } from "@remix-run/node";
import { Link, useFetchers, useLoaderData } from "@remix-run/react";
import clsx from "clsx";
import invariant from "tiny-invariant";
import { buttonVariants } from "~/components/ui/button";
import { getBoard } from "~/queries/board";
import { createColumn, deleteColumn } from "~/queries/column";
import { createItem, deleteItem, updateItemColumn } from "~/queries/item";
import { RenderColumn, RenderColumnType } from "~/routes/boards_.$id/column";
import { CreateColumn } from "~/routes/boards_.$id/create-column";
import { FETCHER_KEYS, INTENTS } from "~/routes/boards_.$id/types";

export async function loader({ params }: LoaderFunctionArgs) {
    const { id: boardId } = params;
    invariant(boardId, "Id is required");

    const numberBoardId = Number(boardId);
    invariant(!isNaN(numberBoardId), "Id must be a number");
    invariant(Number.isInteger(numberBoardId), "Id must be an integer");
    invariant(numberBoardId > 0, "Id must be greater than 0");

    const board = await getBoard(numberBoardId);

    if (!board) {
        throw data("Not Found",
            {
                status: 404,
                statusText: "Not Found"
            });
    }

    const newBoard = {
        ...board,
        columns: board.columns.map(column => ({
            ...column,
            items: column.items.map((item, index) => ({
                ...item,
                prevOrder: index > 0 ? column.items[index - 1].order : 0,
                nextOrder: index < column.items.length - 1 ? column.items[index + 1].order : item.order + 1,
                isOptimistic: false
            }))
        }))
    };

    return { board: newBoard };
}

export async function action({ request, params }: ActionFunctionArgs) {
    const formData = await request.formData();
    const intent = String(formData.get("intent") || "");

    invariant(typeof intent === "string", "Expected intent to be a string");
    invariant(intent !== "", "intent is required");

    const { id: boardId } = params;
    invariant(boardId, "Id is required");

    const numberBoardId = Number(boardId);
    invariant(!isNaN(numberBoardId), "Id must be a number");
    invariant(Number.isInteger(numberBoardId), "Id must be an integer");
    invariant(numberBoardId > 0, "Id must be greater than 0");


    if (intent === INTENTS.createColumn) {
        const columnId = String(formData.get("columnId") || "");
        invariant(typeof columnId === "string", "Expected id to be a string");
        invariant(columnId !== "", "columnId is required");

        const name = String(formData.get("name") || "");
        invariant(typeof name === "string", "Expected id to be a string");
        invariant(name !== "", "Name is required");

        await createColumn({
            id: columnId,
            name: name,
            boardId: numberBoardId,
        });

        await new Promise((resolve) => setTimeout(resolve, 2000));
        return { ok: true };
    }

    if (intent === INTENTS.deleteColumn) {

        const columnId = String(formData.get("columnId") || "");
        invariant(typeof columnId === "string", "Expected id to be a string");
        invariant(columnId !== "", "columnId is required");

        await new Promise((resolve) => setTimeout(resolve, 2000));

        await deleteColumn(columnId);
        return { ok: true };
    }

    if (intent === INTENTS.createItem) {
        const itemId = String(formData.get("itemId") || "");
        invariant(typeof itemId === "string", "Expected id to be a string");
        invariant(itemId !== "", "itemId is required");

        const content = String(formData.get("content") || "");
        invariant(typeof content === "string", "Expected id to be a string");
        invariant(content !== "", "Content is required");

        const columnId = String(formData.get("columnId") || "");
        invariant(typeof columnId === "string", "Expected id to be a string");
        invariant(columnId !== "", "columnId is required");

        const order = String(formData.get("order") || "");
        invariant(typeof order === "string", "Expected id to be a string");
        invariant(order !== "", "order is required");
        const numberOrder = Number(order);
        invariant(!isNaN(numberOrder), "order must be a number");

        await new Promise((resolve) => setTimeout(resolve, 2000));

        await createItem({
            id: itemId,
            content: content,
            columnId: columnId,
            order: numberOrder,
        });

        return { ok: true };
    }

    if (intent === INTENTS.deleteItem) {

        const itemId = String(formData.get("itemId") || "");
        invariant(typeof itemId === "string", "Expected id to be a string");
        invariant(itemId !== "", "itemId is required");

        await new Promise((resolve) => setTimeout(resolve, 2000));

        await deleteItem(itemId);
        return { ok: true };
    }

    if (intent === INTENTS.moveItem) {

        const itemId = String(formData.get("itemId") || "");
        const columnId = String(formData.get("columnId") || "");

        invariant(typeof itemId === "string", "Expected id to be a string");
        invariant(itemId !== "", "itemId is required");

        invariant(typeof columnId === "string", "Expected id to be a string");
        invariant(columnId !== "", "columnId is required");

        const order = String(formData.get("order") || "");
        invariant(typeof order === "string", "Expected id to be a string");
        invariant(order !== "", "order is required");
        const numberOrder = Number(order);
        invariant(!isNaN(numberOrder), "order must be a number");

        await new Promise((resolve) => setTimeout(resolve, 2000));

        await updateItemColumn(itemId, columnId, numberOrder);
        return { ok: true };
    }

    throw data(`Invalid intent: ${intent}`,
        {
            status: 400,
            statusText: "Bad Request"
        });
}

export default function Board() {
    const { board } = useLoaderData<typeof loader>();
    const pendingColumns = usePendingColumns();

    const columns = new Map<string, RenderColumnType>();

    for (const column of [...board.columns.map(item => { return { ...item, isOptimistic: false } }), ...pendingColumns]) {
        if (columns.has(column.id)) {
            continue;
        }
        columns.set(column.id, column);
    }

    const iterableColumns = [...columns.values()];

    return (
        <>
            <div className="mt-5 flex items-center gap-5">
                <h2 className="text-xl font-semibold">{board.name}</h2>
                <Link to="/boards" className={buttonVariants({ variant: "default" })}>
                    Go back
                </Link>
            </div>

            <div className={clsx("flex gap-4", "justify-center md:justify-start")}>
                {iterableColumns.map((column) => (
                    <RenderColumn
                        key={column.id}
                        boardId={column.boardId}
                        id={column.id}
                        name={column.name}
                        isOptimistic={column.isOptimistic}
                        order={column.order}
                        items={column.items}
                    />
                ))}

                <CreateColumn boardId={board.id} />
            </div>

        </>
    )
}

function usePendingColumns() {

    const pendingColumns =
        useFetchers()
            .filter((fetcher) => fetcher.key.startsWith(FETCHER_KEYS.createColumn))
            .map((fetcher) => {
                return {
                    id: String(fetcher.formData?.get("columnId")),
                    name: String(fetcher.formData?.get("name")),
                    boardId: Number(fetcher.formData?.get("boardId")),
                    order: 0,
                    isOptimistic: true,
                    items: [],
                }
            });

    return pendingColumns as RenderColumnType[];
}




