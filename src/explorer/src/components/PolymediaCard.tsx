
import { Card } from "~/ui/Card";
import { ButtonOrLink } from "~/ui/utils/ButtonOrLink";

export function PolymediaCard() {
	return (
		<Card bg="white/80" spacing="lg" height="full">
			<div className="flex h-full flex-col gap-4 overflow-hidden">

				<div className="md:text-heading4 text-heading6 text-steel-darker font-semibold">
					Polymedia Explorer
				</div>

				<div className="break-words text-pBody font-semibold text-steel-dark">
					The Sui Explorer, maintained by&nbsp;
					<ButtonOrLink href="https://x.com/juzybits" className="break-words text-pBody font-semibold text-steel-dark">
						<span className="text-hero-dark font-semibold">@juzybits</span>
					</ButtonOrLink>
				</div>

				<div className="break-words text-pBody font-semibold text-steel-dark">
					<ButtonOrLink href="https://github.com/juzybits/polymedia-explorer">
						<span className="text-hero-dark font-semibold">🛠️ SOURCE CODE</span>
					</ButtonOrLink>
				</div>

				<div className="break-words text-pBody font-semibold text-steel-dark flex align-middle">
					<ButtonOrLink href="https://github.com/juzybits/polymedia-explorer">
						<img alt="polymedia" src="https://assets.polymedia.app/img/all/logo-nomargin-transparent-512x512.webp"
							className="inline-block h-4"
						/>
						&nbsp;
						<span className="text-hero-dark font-semibold">MORE PROJECTS</span>
					</ButtonOrLink>
				</div>

				<div className="break-words text-pBody font-semibold text-steel-dark">
					<ButtonOrLink href="https://spamsui.com/">
						<span className="text-hero-dark font-semibold">🕯️ JOIN THE CULT</span>
					</ButtonOrLink>
				</div>

			</div>
		</Card>
	);
}
