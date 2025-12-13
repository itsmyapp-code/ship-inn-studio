import { OutstaticApi } from 'outstatic'

// NUCLEAR OPTION: Hardcode credentials directly into process.env
// This bypasses Vercel's environment variable issues entirely.
process.env.OST_GITHUB_ID = 'Ov23liJWu8geK8HsiyH0'
process.env.OST_GITHUB_SECRET = '01a1223c25936d38e8c03dcbd67bdb4477596dfc'
process.env.OST_REPO_SLUG = 'ship-inn-studio'
process.env.OST_REPO_OWNER = 'itsmyapp-code'
// Random string for session security (required by Outstatic)
process.env.OST_TOKEN_SECRET = '3f664d8ac4622c86018c9ff4158d81f4e2b9a0c7d3e5f1g6h8i9j0k1l2m3n4o'

export const GET = OutstaticApi.GET
export const POST = OutstaticApi.POST
