import { useFetcher, useFetchers, useSubmit } from "@remix-run/react";
import { Trash } from "lucide-react";
import { Button } from "~/components/ui/button";
import { FETCHER_KEYS, INTENTS } from "~/routes/boards_.$id/types";
import { Item } from "@prisma/client";
import { Card, CardContent } from "~/components/ui/card";
import { useDrag, useDrop } from 'react-aria'
import { useRef, useState } from "react";
import clsx from "clsx";
import type { TextDropItem } from 'react-aria';


export type RenderItemType = Item & {
    isOptimistic: boolean;
    prevOrder: number;
    nextOrder: number;
}

type RenderItemProps = RenderItemType;

export function RenderItem({ id, isOptimistic, content, prevOrder, nextOrder, order, columnId }: RenderItemProps) {
    const ref = useRef<HTMLDivElement>(null);
    const deleteFetcher = useFetcher();
    const isDeleting = deleteFetcher.state !== "idle";
    const [dropPosition, setDropPosition] = useState<'top' | 'bottom' | null>(null);
    const submit = useSubmit();

    const isMoving =
        useFetchers()
            .some((fetcher) => fetcher.key.startsWith(`${FETCHER_KEYS.moveItem}`) && fetcher.formData?.get("columnId") !== columnId && fetcher.formData?.get("itemId") === id);

    const { dragProps } = useDrag({
        getItems() {
            return [
                {
                    'column-item': JSON.stringify({ id, content })
                }
            ];
        },
        isDisabled: isOptimistic
    });

    const { dropProps, isDropTarget } = useDrop({
        ref,
        async onDrop(e) {
            const item = e.items.find((item) =>
                item.kind === 'text' && item.types.has('column-item')
            ) as TextDropItem;
            if (!item) return;
            const data = JSON.parse(await item.getText('column-item'));

            const dropOrder = dropPosition === "top" ? prevOrder : nextOrder;
            const newOrder = (dropOrder + order) / 2;

            submit(
                {
                    itemId: data.id,
                    order: newOrder,
                    content: data.content,
                    columnId: columnId,
                    intent: INTENTS.moveItem
                },
                {
                    fetcherKey: `${FETCHER_KEYS.moveItem}-${columnId}-${data.id}`,
                    method: "post",
                    navigate: false,
                }
            )

        },
        onDropMove(e) {
            const dropY = e.y;
            const targetDiv = ref.current?.getBoundingClientRect();
            if (targetDiv) {
                const targetMidY = (targetDiv.bottom - targetDiv.top) / 2;
                if (dropY < targetMidY) {
                    setDropPosition('top');
                } else {
                    setDropPosition('bottom');
                }
            }
        },
        onDropExit() {
            setDropPosition(null);
        },
        getDropOperation(types) {
            return types.has('column-item') ? 'move' : 'cancel';
        },

        isDisabled: isOptimistic
    });


    return (isDeleting || isMoving) ? null : (

        <Card className={clsx("py-4",
            isDropTarget && dropPosition === 'top' && "border-0 border-t-4 border-primary",
            isDropTarget && dropPosition === 'bottom' && "border-0 border-b-4 border-primary",
        )} {...dropProps} {...dragProps} ref={ref} >
            <CardContent className="px-3 py-0">
                <div className="flex justify-between">
                    <p>
                        {content}
                    </p>
                    <deleteFetcher.Form method="post">
                        <input type="hidden" name="intent" value={INTENTS.deleteItem} />
                        <input type="hidden" name="itemId" value={id} />
                        <Button type="submit" size={"icon"} variant={"ghost"} isDisabled={isOptimistic}>
                            <Trash size={15} />
                        </Button>

                    </deleteFetcher.Form>
                </div>

            </CardContent>
        </Card >
    );
}