"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Form,
    FormControl,
    FormField,
    FormItem,

} from "@/components/ui/form"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface CalendarFormProps {
    onDateSelect: (date: Date | null) => void;
}

interface FormData {
    dob: Date | null;
}


export function CalendarForm({ onDateSelect }: CalendarFormProps) {
    const form = useForm<FormData>({
        resolver: zodResolver(z.object({ dob: z.date().optional() })),
        defaultValues: { dob: null },
    });


    const { handleSubmit, setValue, control } = form;

    const onSubmit = (data: FormData) => {
        onDateSelect(data.dob);
    };


    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 flex justify-between">
                <FormField
                    control={control}
                    name="dob"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn("pl-2 text-left font-normal")}
                                        >
                                            <CalendarIcon className=" h-4 w-4 opacity-90" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value || undefined}
                                        onSelect={(date: Date | undefined) => {
                                            setValue('dob', date ?? null);
                                            handleSubmit(onSubmit)();
                                        }}
                                        disabled={(date) =>
                                            date > new Date() || date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                        title="Select a date"
                                    />
                                </PopoverContent>
                            </Popover>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
}
