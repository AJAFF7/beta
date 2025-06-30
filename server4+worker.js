const express = require('express');
const path = require('path');
const { exec, execSync } = require('child_process');
const cors = require('cors');
const axios = require('axios');
const amqp = require('amqplib/callback_api');

// Initialize express app
const app = express();
const port = 3538;

app.use(express.json());
app.use(cors({ origin: '*' }));
app.use(express.static(path.join(__dirname, 'build')));


//app.use(cors({
//  origin: 'https://k8s.ajs-engineer.com',
//  credentials: true
//}));

/// Also make sure to handle OPTIONS preflight for all routes:
//app.options('*', cors({
//  origin: 'https://k8s.ajs-engineer.com',
//  credentials: true
//}));


// Function to execute shell commands
const executeCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err || stderr) {
        reject('Error fetching logs.');
      } else {
        resolve(stdout);
      }
    });
  });
};

// Endpoint to fetch DMS logs
app.get("/dmslogs", async (req, res) => {
  const command = "kubectl logs -l app=dms-app -n default";
  try {
    const logs = await executeCommand(command);
    res.send(logs);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Endpoint to clear logs (for DMS)
app.get("/clearlogs", (req, res) => {
  const defaultMessage = "Server running on port: 8282";  // Default message to show after clearing logs
  res.send(defaultMessage);  // Send the default message after clearing logs
});

// Endpoint to fetch MongoDB logs
app.get("/mongologs", async (req, res) => {
  const command = "kubectl logs -l app=mongo-app -n default";
  try {
    const logs = await executeCommand(command);
    res.send(logs);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Endpoint to clear logs (for MONGO)
app.get("/clearlogs", (req, res) => {
  const defaultMessage = "Server running on port: 27017";  // Default message to show after clearing logs
  res.send(defaultMessage);  // Send the default message after clearing logs
});

// Endpoint to fetch Nodex logs
app.get("/nodexlogs", async (req, res) => {
  const command = "kubectl logs -l app=nodex -n default";
  try {
    const logs = await executeCommand(command);
    res.send(logs);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Endpoint to clear logs (for Nodex)
app.get("/clearlogs", (req, res) => {
  const defaultMessage = "Server running on port: 9100";  // Default message to show after clearing logs
  res.send(defaultMessage);  // Send the default message after clearing logs
});

// Start the server
app.listen(port, () => {
  console.log(`Server4 running at http://localhost:${port}`);
});

// Worker functionality - RabbitMQ consumer to handle background tasks
amqp.connect('amqp://admin:RabbitMQ555@172.18.0.2:31410', (err, connection) => {
  if (err) {
    console.error("Failed to connect to RabbitMQ", err);
    process.exit(1);
  }

  connection.createChannel((err, channel) => {
    if (err) {
      console.error("Failed to create a channel", err);
      process.exit(1);
    }

    const queue = 'task_queue'; // Queue name to listen to

    channel.assertQueue(queue, { durable: true });
    console.log(`Worker is waiting for messages in queue: ${queue}`);

    // Consume messages from the queue
    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const task = JSON.parse(msg.content.toString());
        console.log('Received task:', task);

        // Based on the task, execute corresponding action
        try {
          if (task.action === 'clearDMSLogs') {
            const command = "kubectl logs -l app=dms-app -n default --clear";
            await executeCommand(command);
            console.log('DMS logs cleared');
          } else if (task.action === 'clearMongoLogs') {
            const command = "kubectl logs -l app=mongo-app -n default --clear";
            await executeCommand(command);
            console.log('Mongo logs cleared');
          } else if (task.action === 'clearNodexLogs') {
            const command = "kubectl logs -l app=nodex -n default --clear";
            await executeCommand(command);
            console.log('Nodex logs cleared');
          }

          // Acknowledge message
          channel.ack(msg);
        } catch (error) {
          console.error('Error processing task:', error);
          channel.nack(msg, false, true); // Requeue the message in case of failure
        }
      }
    });
  });
});

