
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
				<ButtonOrLink href="https://github.com/juzybits/polymedia-explorer" className="break-words text-pBody font-semibold text-steel-dark">
					Source code: <span className="text-hero-dark font-semibold">github.com</span>
				</ButtonOrLink>
				<ButtonOrLink href="https://app.turbos.finance/#/trade?input=0x2::sui::SUI&output=0x30a644c3485ee9b604f52165668895092191fcaf5489a846afa7fc11cdb9b24a::spam::SPAM" className="break-words text-pBody font-semibold text-steel-dark">
					Support this project: <span className="text-hero-dark font-semibold">buy SPAM</span>
				</ButtonOrLink>
			</div>
		</Card>
	);
}
