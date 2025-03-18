"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe2Icon, LockIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { videooUpdateSchema } from "@/db/schema";

type VideoVisibilityFieldProps = {
  form: UseFormReturn<z.infer<typeof videooUpdateSchema>>;
};

export const VideoVisibilityField = ({ form }: VideoVisibilityFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="visibility"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Visibility</FormLabel>
          <Select onValueChange={field.onChange} value={field.value ?? undefined}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {[
                {
                  name: "public",
                  icon: <Globe2Icon className="size-4" />,
                },
                {
                  name: "private",
                  icon: <LockIcon className="size-4" />,
                },
              ].map((visibility) => (
                <SelectItem key={visibility.name} value={visibility.name}>
                  <div className="flex items-center gap-x-2">
                    {visibility.icon}
                    {visibility.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
