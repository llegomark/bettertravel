import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="BetterTravel is an AI-powered travel planning platform that provides customized itineraries for destinations around the world. With just a few clicks, our users can get a well-rounded and optimized travel plan in just a few seconds."
          />
          <meta
            property="og:site_name"
            content="Experience the Best of Every Destination: Get Your AI-Generated Itinerary Today - Better Travel"
          />
          <meta
            property="og:description"
            content="BetterTravel is an AI-powered travel planning platform that provides customized itineraries for destinations around the world. With just a few clicks, our users can get a well-rounded and optimized travel plan in just a few seconds."
          />
          <meta
            property="og:title"
            content="Experience the Best of Every Destination: Get Your AI-Generated Itinerary Today - Better Travel"
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content="Experience the Best of Every Destination: Get Your AI-Generated Itinerary Today - Better Travel"
          />
          <meta
            name="twitter:description"
            content="BetterTravel is an AI-powered travel planning platform that provides customized itineraries for destinations around the world. With just a few clicks, our users can get a well-rounded and optimized travel plan in just a few seconds."
          />
          <meta
            property="og:image"
            content="https://bible.betterself.app/bettertravel.png"
          />
          <meta
            name="twitter:image"
            content="https://bible.betterself.app/bettertravel.png"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;