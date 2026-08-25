// Renders a structured-data block. Server component: the JSON is serialized at
// build time and ships in the HTML, where crawlers read it without running JS.
export default function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
