const express = require('express');
const path = require('path');
const { exec, execSync } = require('child_process');
const cors = require('cors');
const axios = require('axios');
const amqp = require('amqplib/callback_api');

// Initialize express app
const app = express();
const port = 3537;

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




// Helper function to execute shell commands
const executeCommand = (command) => {
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

// API Route for Pod Status
app.get('/pod-status', async (req, res) => {
  try {
    const result = await executeCommand('kubectl get pods --all-namespaces -o json');
    const podsData = JSON.parse(result);

    const serviceStatuses = {};

    podsData.items.forEach(pod => {
      const serviceName = pod.metadata.labels?.app || pod.metadata.name;
      const podStatus = pod.status.phase.toLowerCase();

      if (!serviceStatuses[serviceName]) {
        serviceStatuses[serviceName] = { 
          serviceName, 
          status: 'not running', 
          pods: [], 
          message: '',
          replicas: 0 
        };
      }

      serviceStatuses[serviceName].pods.push(pod.metadata.name);
      serviceStatuses[serviceName].replicas += 1; // Count the number of pods as replicas

      if (podStatus === 'running') {
        serviceStatuses[serviceName].status = 'running';
      } else if (podStatus === 'failed') {
        serviceStatuses[serviceName].status = 'error';
        serviceStatuses[serviceName].message = `Pod ${pod.metadata.name} failed.`;
      } else if (podStatus === 'pending') {
        serviceStatuses[serviceName].status = 'pending';
        serviceStatuses[serviceName].message = `Pod ${pod.metadata.name} is pending.`;
      }

      // Check if pod is in CrashLoopBackOff
      const containerStatuses = pod.status.containerStatuses || [];
      containerStatuses.forEach(container => {
        if (container.state.waiting && container.state.waiting.reason === 'CrashLoopBackOff') {
          serviceStatuses[serviceName].status = 'error-pod';
          serviceStatuses[serviceName].message = `Pod ${pod.metadata.name} is in CrashLoopBackOff.`;
        }
      });
    });

    res.json({ status: 'success', data: Object.values(serviceStatuses) });
  } catch (error) {
    console.error('Error fetching pod statuses:', error.message);
    res.status(500).json({ status: 'error', message: 'Failed to fetch pod statuses' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server3 running at http://localhost:${port}`);
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
          if (task.action === 'fetchPodStatus') {
            const result = await executeCommand('kubectl get pods --all-namespaces -o json');
            const podsData = JSON.parse(result);

            const serviceStatuses = {};

            podsData.items.forEach(pod => {
              const serviceName = pod.metadata.labels?.app || pod.metadata.name;
              const podStatus = pod.status.phase.toLowerCase();

              if (!serviceStatuses[serviceName]) {
                serviceStatuses[serviceName] = { 
                  serviceName, 
                  status: 'not running', 
                  pods: [], 
                  message: '',
                  replicas: 0 
                };
              }

              serviceStatuses[serviceName].pods.push(pod.metadata.name);
              serviceStatuses[serviceName].replicas += 1; // Count the number of pods as replicas

              if (podStatus === 'running') {
                serviceStatuses[serviceName].status = 'running';
              } else if (podStatus === 'failed') {
                serviceStatuses[serviceName].status = 'error';
                serviceStatuses[serviceName].message = `Pod ${pod.metadata.name} failed.`;
              } else if (podStatus === 'pending') {
                serviceStatuses[serviceName].status = 'pending';
                serviceStatuses[serviceName].message = `Pod ${pod.metadata.name} is pending.`;
              }

              // Check if pod is in CrashLoopBackOff
              const containerStatuses = pod.status.containerStatuses || [];
              containerStatuses.forEach(container => {
                if (container.state.waiting && container.state.waiting.reason === 'CrashLoopBackOff') {
                  serviceStatuses[serviceName].status = 'error-pod';
                  serviceStatuses[serviceName].message = `Pod ${pod.metadata.name} is in CrashLoopBackOff.`;
                }
              });
            });

            console.log('Pod status fetched:', serviceStatuses);
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

