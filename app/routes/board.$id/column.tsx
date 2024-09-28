import { Column as PrismaColumn } from "@prisma/client";
import { useFetcher, useFetchers, useSubmit } from "@remix-run/react";
import { Trash } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { CreateItem } from "~/routes/board.$id/create-item";
import { RenderItem, RenderItemType } from "~/routes/board.$id/item";
import { FETCHER_KEYS, INTENTS } from "~/routes/board.$id/types";
import { useDrop } from 'react-aria'
import { useRef } from "react";
import type { TextDropItem } from 'react-aria';
import clsx from "clsx";


export type RenderColumnType = PrismaColumn & {
    isOptimistic: boolean;
    items: RenderItemType[];
};

type RenderColumnProps = RenderColumnType;

export function RenderColumn({ id, name, items, isOptimistic }: RenderColumnProps) {

    const ref = useRef<HTMLDivElement>(null);
    const deleteFetcher = useFetcher();
    const isDeleting = deleteFetcher.state !== "idle";
    const submit = useSubmit();

    const pendingItems = usePendingItems({ columnId: id });

    const mapItems = new Map<string, RenderItemType>();

    for (const item of [...items.map(item => { return { ...item, isOptimistic: false } }), ...pendingItems]) {
        if (mapItems.has(item.id)) {
            continue;
        }
        mapItems.set(item.id, item);
    }

    const iterableItems = [...mapItems.values()].sort((a, b) => a.order - b.order);


    const { dropProps, isDropTarget } = useDrop({
        ref,
        async onDrop(e) {
            const item = e.items.find((item) =>
                item.kind === 'text' && item.types.has('column-item')
            ) as TextDropItem;
            if (!item) return;
            const data = JSON.parse(await item.getText('column-item'));

            submit(
                {
                    itemId: data.id,
                    order: 1,
                    content: data.content,
                    columnId: id,
                    intent: INTENTS.moveItem
                },
                {
                    fetcherKey: `${FETCHER_KEYS.moveItem}-${id}-${data.id}`,
                    method: "post",
                    navigate: false,
                }
            )

        },
        getDropOperation(types) {
            return types.has('column-item') ? 'move' : 'cancel';
        },

        isDisabled: iterableItems.length !== 0
    });


    return isDeleting ? null : (
        <Card className={clsx("w-[280px] h-full", isDropTarget ? "border-primary" : "")} ref={ref} {...dropProps}>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <p className="flex-grow">{name}</p>
                    <deleteFetcher.Form method="post">
                        <input type="hidden" name="intent" value={INTENTS.deleteColumn} />
                        <input type="hidden" name="columnId" value={id} />

                        <Button type="submit" size={"icon"} variant={"ghost"} isDisabled={isOptimistic}>
                            <Trash size={15} />
                        </Button>

                    </deleteFetcher.Form>
                </CardTitle>
                <CardDescription className="sr-only">{name}</CardDescription>
            </CardHeader>
            <CardContent className="text-xs space-y-4">
                {iterableItems.map((item) => (
                    <RenderItem key={item.id}
                        id={item.id}
                        isOptimistic={item.isOptimistic}
                        columnId={item.columnId}
                        order={item.order}
                        content={item.content}
                        nextOrder={item.nextOrder}
                        prevOrder={item.prevOrder}
                    />
                ))}
                <CreateItem columnId={id} isOptimistic={isOptimistic} lastOrder={iterableItems.length > 0 ? iterableItems[iterableItems.length - 1].order : 0} />
            </CardContent>
        </Card>
    );
}

function usePendingItems({ columnId }: { columnId: string }) {

    // console.log('${FETCHER_KEYS.moveItem}-${columnId}', `${FETCHER_KEYS.moveItem}-${columnId}`);
    // console.log('useFetchers()', useFetchers().filter((fetcher) => fetcher.key.startsWith(`${FETCHER_KEYS.createItem}-${columnId}`) || fetcher.key.startsWith(`${FETCHER_KEYS.moveItem}-${columnId}`)));

    const pendingItems =
        useFetchers()
            .filter((fetcher) => fetcher.key.startsWith(`${FETCHER_KEYS.createItem}-${columnId}`) || fetcher.key.startsWith(`${FETCHER_KEYS.moveItem}-${columnId}`))
            .map((fetcher) => {
                return {
                    id: String(fetcher.formData?.get("itemId")),
                    content: String(fetcher.formData?.get("content")),
                    order: Number(String(fetcher.formData?.get("order"))),
                    columnId: String(fetcher.formData?.get("columnId")),
                    isOptimistic: true,
                    prevOrder: 0,
                    nextOrder: 0
                }
            });

    return pendingItems as RenderItemType[];
}