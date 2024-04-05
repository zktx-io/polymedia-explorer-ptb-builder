import {Checkbox} from "~/ui/Checkbox";
import {useLocalStorage} from "@mysten/core";

export enum RedirectExplorer {
    SUISCAN = 'suiscan',
    SUIVISION = 'suivision',
}

export function usePreference() {
    const [checked, setChecked] = useLocalStorage<boolean>(
        'is-explorer-reference-checked',
        true,
    );

    const [preference, setPreference] = useLocalStorage<RedirectExplorer | undefined>(
        'explorer-reference',
        undefined,
    );

    return {
        checked,
        setChecked,
        preference,
        setPreference,
    };
}

export function CheckboxRedirectPreference() {
    const {
        checked,
        setChecked,
    } = usePreference();

    return (
        <Checkbox
            checked={checked}
            onCheckedChange={(isChecked) => {
                setChecked(!!isChecked);
            }}
            id="explorer-reference"
            label="Remember my explorer preference"
            className="justify-center"
        />
    )
}