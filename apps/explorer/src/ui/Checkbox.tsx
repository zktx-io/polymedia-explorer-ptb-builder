import * as RadixCheckbox from '@radix-ui/react-checkbox';
import { CheckStroke24 } from "@mysten/icons";
import { Text } from "@mysten/ui";
import clsx from "clsx";

interface CheckboxProps extends RadixCheckbox.CheckboxProps {
    id: string;
    label?: string;
    className?: string;
}

export function Checkbox({ id, label, className, ...props }: CheckboxProps) {
    return (
        <div className={clsx("flex items-center gap-2 group", className)}>
            <RadixCheckbox.Root
                {...props}
                id={id}
                className="border border-steel hover:border-steel-dark rounded w-6 h-6"
            >
                <RadixCheckbox.Indicator className=" items-center justify-center h-full w-full">
                    <CheckStroke24 className="h-full w-full text-sui-dark"/>
                </RadixCheckbox.Indicator>
            </RadixCheckbox.Root>
            {label && (
                <label className="Label group-hover:text-sui-dark cursor-pointer" htmlFor={id}>
                    <Text variant="body/medium">
                        {label}
                    </Text>
                </label>
            )}
        </div>
    )
}

