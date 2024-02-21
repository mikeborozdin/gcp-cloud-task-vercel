import { CloudTasksClient } from "@google-cloud/tasks";
import type { NextApiRequest, NextApiResponse } from "next";

const KEY = JSON.parse(process.env.CLOUD_TASKS_SERVICE_ACCOUNT as string);

const client = new CloudTasksClient({
  credentials: KEY,
});

function createHttpTask(payload: unknown) {
  const project = "nex-prod-7d39f";
  const queue = "my-queue";
  const location = "us-central1";
  const url = `${process.env.TASK_HANDLER_BASE_URL}/api/process-task`;

  const parent = client.queuePath(project, location, queue);

  const task = {
    httpRequest: {
      headers: {
        "Content-Type": "application/json",
      },
      url,
      body: Buffer.from(JSON.stringify(payload)).toString("base64"),
    },
  };

  const request = { parent: parent, task: task };

  return client.createTask(request);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await createHttpTask({ foo: "hello" });

  res.status(204).end();
}
