import {CheckboxRedirectReference, RedirectExplorer, useReference} from "~/components/CheckboxRedirectReference";
import {RadioGroup, RadioGroupItem} from "@mysten/ui";

export function Reference() {
    const {
        reference,
        setReference,
    } = useReference();

    return (
        <div className="flex flex-col justify-center items-center gap-4 mt-4">
            <RadioGroup aria-label="redirect-preferences" value={reference} onValueChange={(reference) => setReference(reference as RedirectExplorer)}>
                <RadioGroupItem value={RedirectExplorer.SUISCAN} label={RedirectExplorer.SUISCAN} />
                <RadioGroupItem value={RedirectExplorer.SUIVISION} label={RedirectExplorer.SUIVISION} />
            </RadioGroup>
            <CheckboxRedirectReference />
        </div>
    );
}