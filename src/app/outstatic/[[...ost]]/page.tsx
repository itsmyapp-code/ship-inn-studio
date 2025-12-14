// import '../styles.css'
import { Outstatic } from 'outstatic'
import { OstClient } from 'outstatic/client'

export default async function Page({ params }: { params: { ost: string[] } }) {
  // NUCLEAR OPTION: Inject credentials directly into process.env on the server
  // This ensures Outstatic finds them even if Vercel env vars are missing
  process.env.OST_GITHUB_ID = 'Ov23liJWu8geK8HsiyH0'
  process.env.OST_GITHUB_SECRET = '01a1223c25936d38e8c03dcbd67bdb4477596dfc'
  process.env.OST_REPO_SLUG = 'ship-inn-studio'
  process.env.OST_REPO_OWNER = 'itsmyapp-code'
  process.env.OST_TOKEN_SECRET = '3f664d8ac4622c86018c9ff4158d81f4e2b9a0c7d3e5f1g6h8i9j0k1l2m3n4o'

  const outstatic = await Outstatic()
  return <OstClient ostData={outstatic} params={params} />
}
