import { defineConfig } from '@hey-api/openapi-ts'

const backendUrl = 'http://localhost:5050'

export default defineConfig({
  input: process.env.OPENAPI_URL ?? `${backendUrl}/v3/api-docs`,
  output: 'src/api/generated',
  plugins: [
    '@hey-api/typescript',
    '@hey-api/sdk',
    {
      name: '@hey-api/client-fetch',
      baseUrl: false,
    },
  ],
  parser: {
    validate_EXPERIMENTAL: true,
  },
})