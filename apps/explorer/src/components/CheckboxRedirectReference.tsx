import {Checkbox} from "~/ui/Checkbox";
import {useLocalStorage} from "@mysten/core";

export enum RedirectExplorer {
    SUISCAN = 'suiscan',
    SUIVISION = 'suivision',
}

export function useReference() {
    const [checked, setChecked] = useLocalStorage<boolean>(
        'is-explorer-reference-checked',
        true,
    );

    const [reference, setReference] = useLocalStorage<RedirectExplorer | undefined>(
        'explorer-reference',
        undefined,
    );

    return {
        checked,
        setChecked,
        reference,
        setReference,
    };
}

export function CheckboxRedirectReference() {
    const {
        checked,
        setChecked,
    } = useReference();

    return (
        <Checkbox
            checked={checked}
            onCheckedChange={(isChecked) => {
                setChecked(!!isChecked);
            }}
            id="explorer-reference"
            label="Remember my explorer reference"
            className="justify-center"
        />
    )
}