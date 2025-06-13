import Head from "next/head";

const MetaTags = ({ title }) => {
  return (
    <Head>
      {/* Basic metas */}
      <meta charSet="utf-8" />
      <meta name="robots" content="noindex, follow" />
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      <meta
        name="description"
        content="eTrade - Mẫu giao diện thương mại điện tử React Next JS"
      />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <title>{`${title ? title : "eTrade"} - Mẫu giao diện thương mại điện tử React Next JS`}</title>
    </Head>
  );
};

export default MetaTags;
