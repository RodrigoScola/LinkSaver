import Head from "next/head"
import { BASEURL } from "../utils/formatting/utils"

export const RenderHead = ({
	title,
	imageUrl = "https://overflow-organizer-mmm11vmep-rodrigoscola.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo_white.7b3ec946.png&w=256&q=75",
	imageAlt = "Link Saver Logo",
}) => {
	return (
		<Head>
			<title>{title}</title>
			<meta property="og:type" content="article" />
			<meta
				property="og:image"
				itemProp="image"
				content={
					"https://overflow-organizer-hr4pkttc7-rodrigoscola.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.cb5c0cdf.png&w=128&q=75"
				}
			/>
			<meta property="og:url" content={BASEURL} />
			<meta name="twiiter:card" content="summary_large_image" />

			<meta property="og:description" content="We save stack overflow links so you dont have to"></meta>
			<meta property="og:site_name" content="Link Saver"></meta>
			<meta name="twitter:image:alt" content={imageAlt}></meta>
		</Head>
	)
}
