"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"

const FormSchema = z.object({
    dob: z.date({
        required_error: "A date is required.",
    }),
});

export function CalendarForm({ onDateSelect }) {
    const form = useForm({
        resolver: zodResolver(FormSchema),
    });

    const onSubmit = (data) => {
        onDateSelect(data.dob);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex justify-between">
                <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => (
                        <Calendar
                            onChange={field.onChange}
                            value={field.value}
                            onClickDay={(value) => {
                                field.onChange(value);
                                form.handleSubmit(onSubmit)();
                            }}
                        />
                    )}
                />
            </form>
        </Form>
    );
}