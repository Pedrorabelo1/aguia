import { Worker } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

const notificationWorker = new Worker(
  "notifications",
  async (job) => {
    console.log(`Processing notification job: ${job.id}`, job.data);
    // TODO: implement notification processing
  },
  { connection }
);

const processWorker = new Worker(
  "processes",
  async (job) => {
    console.log(`Processing process job: ${job.id}`, job.data);
    // TODO: implement process task generation
  },
  { connection }
);

console.log("🦅 AGUIA Worker started");

process.on("SIGTERM", async () => {
  await notificationWorker.close();
  await processWorker.close();
  process.exit(0);
});
