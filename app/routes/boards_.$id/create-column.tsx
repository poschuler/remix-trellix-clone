import { Form, useSubmit } from "@remix-run/react";
import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { CustomTextField } from "~/components/ui/textfield";
import { FETCHER_KEYS, INTENTS } from "~/routes/boards_.$id/types";

type CreateColumnProps = {
    boardId: number;
}

export function CreateColumn({ boardId }: CreateColumnProps) {
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
            <Card className="w-[280px] h-full">
                <CardHeader>
                    <CardTitle>New column</CardTitle>
                    <CardDescription className="sr-only">Create a new column</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form className="flex flex-col gap-2" method="post" onSubmit={(event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const id = crypto.randomUUID();
                        formData.set("columnId", id);
                        submit(formData,
                            {
                                fetcherKey: `${FETCHER_KEYS.createColumn}-${id}`,
                                navigate: false,
                                method: "post",
                            }
                        );
                        event.currentTarget.reset();
                        inputRef.current?.focus();
                    }}
                        ref={ref}
                    >
                        <input type="hidden" name="boardId" value={boardId} />
                        <input type="hidden" name="intent" value={INTENTS.createColumn} />
                        <CustomTextField
                            label="Colum name"
                            type="text"
                            name="name"
                            isRequired
                            minLength={3}
                            maxLength={25}
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
                </CardContent>
            </Card >
        )
        : (
            <Button size={"icon"} onPress={() => setCreating(true)}>
                <Plus size={24} />
            </Button>
        )
}