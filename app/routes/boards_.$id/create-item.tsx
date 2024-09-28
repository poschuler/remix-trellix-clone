import { Form, useSubmit } from "@remix-run/react";
import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { Button } from "~/components/ui/button";
import { CustomTextField } from "~/components/ui/textfield";
import { FETCHER_KEYS, INTENTS } from "~/routes/boards_.$id/types";

type CreateItemProps = {
    columnId: string;
    isOptimistic: boolean;
    lastOrder: number;
}

export function CreateItem({ columnId, isOptimistic, lastOrder }: CreateItemProps) {
    const [creating, setCreating] = useState(false);
    const ref = useRef(null);
    const submit = useSubmit();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (creating) {
            inputRef.current?.focus();
        }
    }, [creating]);

    const handleClickOutside = () => {
        setCreating(false);
    }

    useOnClickOutside(ref, handleClickOutside);

    return creating ?
        (

            <Form className="flex flex-col gap-2" method="post" onSubmit={(event) => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                const id = crypto.randomUUID();
                formData.set("itemId", id);
                submit(formData,
                    {
                        fetcherKey: `${FETCHER_KEYS.createItem}-${columnId}-${id}`,
                        navigate: false,
                        method: "post",
                    }
                );
                event.currentTarget.reset();
                inputRef.current?.focus();
            }}
                ref={ref}
            >
                <input type="hidden" name="columnId" value={columnId} />
                <input type="hidden" name="intent" value={INTENTS.createItem} />
                <input type="hidden" name="order" value={lastOrder + 1} />
                <CustomTextField
                    type="text"
                    name="content"
                    isRequired
                    minLength={3}
                    maxLength={100}
                    ref={inputRef}
                />
                <div className="flex gap-4">
                    <Button className="w-full" type="submit">
                        Create
                    </Button>
                    <Button className="w-full" variant={"outline"} onPress={() => setCreating(false)} >
                        Cancel
                    </Button>
                </div>
            </Form>
        )
        : (
            <Button className={"mt-5"} onPress={() => setCreating(true)} isDisabled={isOptimistic}>
                <Plus size={18} className="mr-2" />
                Add item
            </Button>
        )
}