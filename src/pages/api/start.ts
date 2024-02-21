// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { CloudTasksClient } from "@google-cloud/tasks";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

const KEY = JSON.parse(process.env.CLOUD_TASKS_SERVICE_ACCOUNT as string);

const client = new CloudTasksClient({
  credentials: KEY,
});

function createHttpTask(payload: unknown) {
  const project = "nex-prod-7d39f";
  const queue = "my-queue";
  const location = "us-central1";
  const url = `${process.env.TASK_HANDLER_BASE_URL}/api/process-task`;

  console.log({ url });
  console.log({ payload });

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
  res: NextApiResponse<Data>
) {
  await createHttpTask({
    assessmentResultId: "Aw8V2PVAWWvb3D_e5DjKi",
    imageUrl:
      "https://3qxdwkqnnj0xhcqk.public.blob.vercel-storage.com/bayond-charge-vs-remains-Kr11BX9oaAb5WcQv2rnnHwc0IDQJME.png",
    assessmentId: "xbCipjeu5YpvFTCx672CQ",
  });

  res.status(200).json({ name: "John Doe" });
}
