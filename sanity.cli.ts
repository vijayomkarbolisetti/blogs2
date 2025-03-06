import { defineCliConfig } from 'sanity/cli'

const projectId = 'bgqq8r69'
const dataset = 'production'

export default defineCliConfig({
  api: { projectId, dataset },
  studioHost: 'blogs2-rouge'  // ✅ Use a valid host, NOT a full domain
});
