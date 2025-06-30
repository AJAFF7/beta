const express = require('express');
const path = require('path');
const { exec, execSync } = require('child_process');
const ps = require("ps-node");
const cors = require('cors');
const axios = require('axios');
const amqp = require('amqplib/callback_api');

// Initialize express app
const app = express();
const port = 3536;

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




// Helper functions to convert memory and CPU values
const convertMemory = (memory) => {
  if (!memory) return null;
  const match = memory.match(/^(\d+)(\w+)$/);
  if (!match) return null;

  const value = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();

  if (unit === 'ki') return value * 1024;  // KiB to Bytes
  if (unit === 'mi') return value * 1024 * 1024;  // MiB to Bytes
  if (unit === 'gi') return value * 1024 * 1024 * 1024;  // GiB to Bytes
  return value; // Default (if no unit, assuming Bytes)
};

const convertCPU = (cpu) => {
  if (!cpu) return null;
  const match = cpu.match(/^(\d+)(\w+)$/);
  if (!match) return null;

  const value = parseFloat(match[1]);
  const unit = match[2].toLowerCase();

  if (unit === 'm') return value / 1000;  // milliCPU to CPU
  return value;  // Default value, assuming CPU is in cores
};

// API Route for Memory Usage
app.get('/api/memory-usage', async (req, res) => {
  try {
    // Fetch Pod metrics
    const podMetrics = await axios.get('http://127.0.0.1:8001/apis/metrics.k8s.io/v1beta1/pods');
    const pods = podMetrics.data.items.map(pod => {
      const container = pod.containers.find(c => c.name === pod.metadata.name) || pod.containers[0];
      return {
        name: pod.metadata.name,
        memory: convertMemory(container.usage.memory)
      };
    });

    // Fetch Deployment resource requests & limits from API
    const deploymentResponse = await axios.get('http://127.0.0.1:8001/apis/apps/v1/namespaces/default/deployments');
    const deployments = deploymentResponse.data.items.map(deployment => {
      const name = deployment.metadata.name;
      const container = deployment.spec.template.spec.containers[0];

      return {
        name,
        requestedCpu: convertCPU(container.resources?.requests?.cpu),
        requestedMemory: convertMemory(container.resources?.requests?.memory),
        limitCpu: convertCPU(container.resources?.limits?.cpu),
        limitMemory: convertMemory(container.resources?.limits?.memory)
      };
    });

    res.json({ pods, deployments });
  } catch (error) {
    console.error('Error fetching Kubernetes metrics:', error.message);
    res.status(500).json({ error: 'Failed to fetch metrics data' });
  }
});

// Endpoint to clean memory
app.post('/api/clean-memory', (req, res) => {
  const command = `
    sudo sh -c "echo 1 > /proc/sys/vm/drop_caches && echo 2 > /proc/sys/vm/drop_caches && echo 3 > /proc/sys/vm/drop_caches" &&
    sudo sysctl vm.drop_caches=1 &&
    sudo sysctl vm.drop_caches=2 &&
    sudo sysctl vm.drop_caches=3
  `;

  const silentCommand = `${command} > /dev/null 2>&1`;

  exec(silentCommand, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ message: `Error: ${stderr}` });
    }
    // Response will still be sent but no logs to terminal
    res.json({ message: 'Memory cleaned successfully!' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server2 running at http://localhost:${port}`);
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
          if (task.action === 'cleanMemory') {
            const command = `
              sudo sh -c "echo 1 > /proc/sys/vm/drop_caches && echo 2 > /proc/sys/vm/drop_caches && echo 3 > /proc/sys/vm/drop_caches" &&
              sudo sysctl vm.drop_caches=1 &&
              sudo sysctl vm.drop_caches=2 &&
              sudo sysctl vm.drop_caches=3
            `;
            await execAsync(command);
            console.log('Memory cleaning task completed');
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

// Utility function to execute commands with Promises
const execAsync = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Error executing command: ${error}`);
      } else if (stderr) {
        reject(`stderr: ${stderr}`);
      } else {
        resolve(stdout);
      }
    });
  });
};

