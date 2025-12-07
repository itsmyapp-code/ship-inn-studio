// Include legacy 'post' documents as news so published Studio posts appear on the site.

// GROQ queries for News and Events
export const EVENTS_QUERY = `*[_type == "event" && startDate >= now()] | order(startDate asc){
  _id,
  title,
  slug,
  summary,
  startDate,
  endDate,
  time,
  price,
  location,
  coverImage{ asset-> { _id, url } }
}`

export const NEWS_QUERY = `*[_type == "news"] | order(publishedAt desc){
  _id,
  title,
  slug,
  summary,
  publishedAt,
  coverImage{ asset-> { _id, url } },
  body
}`
