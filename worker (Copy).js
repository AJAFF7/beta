const amqp = require("amqplib");
const { exec } = require("child_process");

const RABBITMQ_URL = "amqp://localhost";
const QUEUE_NAME = "deployments";

// Function to execute shell commands
const executeCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) reject(`Error: ${error.message}`);
      else if (stderr) reject(`stderr: ${stderr}`);
      else resolve(stdout);
    });
  });
};

const startWorker = async () => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    console.log("Worker is waiting for messages...");

    channel.consume(QUEUE_NAME, async (msg) => {
      if (msg !== null) {
        const { action, deployment, yamlFile } = JSON.parse(msg.content.toString());
        console.log(`Received task: ${action} ${deployment}`);

        try {
          let result;
          if (action === "apply") {
            result = await executeCommand(`kubectl apply -f /home/dev/Argo-0/config/${yamlFile}`);
          } else if (action === "delete") {
            result = await executeCommand(`kubectl delete deployment ${deployment}`);
          }

          console.log(result);
          channel.ack(msg);
        } catch (error) {
          console.error(error);
          channel.nack(msg); // Requeue message if it fails
        }
      }
    });
  } catch (error) {
    console.error("Worker failed:", error);
  }
};

startWorker();
