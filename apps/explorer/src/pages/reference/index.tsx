import {CheckboxRedirectPreference, RedirectExplorer, usePreference} from "~/components/CheckboxRedirectPreference";
import {RadioGroup, RadioGroupItem} from "@mysten/ui";

export function Preference() {
    const {
        preference,
        setReference,
    } = usePreference();

    return (
        <div className="flex flex-col justify-center items-center gap-4 mt-4">
            <RadioGroup aria-label="redirect-preferences" value={preference} onValueChange={(preference) => setReference(preference as RedirectExplorer)}>
                <RadioGroupItem value={RedirectExplorer.SUISCAN} label={RedirectExplorer.SUISCAN} />
                <RadioGroupItem value={RedirectExplorer.SUIVISION} label={RedirectExplorer.SUIVISION} />
            </RadioGroup>
            <CheckboxRedirectPreference />
        </div>
    );
}