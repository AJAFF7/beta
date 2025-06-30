const amqp = require('amqplib/callback_api');
const { exec } = require('child_process');
const path = require('path');

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

// Connect to RabbitMQ and start consuming messages
amqp.connect('amqp://localhost', (err, connection) => {
  if (err) {
    console.error("Failed to connect to RabbitMQ", err);
    process.exit(1);
  }

  connection.createChannel((err, channel) => {
    if (err) {
      console.error("Failed to create a channel", err);
      process.exit(1);
    }

    const queue = 'deployment_tasks'; // Queue name to listen to

    // Ensure that the queue exists
    channel.assertQueue(queue, { durable: true });

    console.log(`Worker is waiting for messages in queue: ${queue}`);

    // Consume messages from the queue
    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const task = JSON.parse(msg.content.toString());
        console.log('Received task:', task);

        // Based on the task action (apply or delete), call the appropriate function
        const { action, deployment, statusKey, yamlFile } = task;

        try {
          let result;
          if (action === 'delete') {
            result = await executeCommand(`kubectl delete deployment ${deployment}`);
          } else if (action === 'apply') {
            result = await executeCommand(`kubectl apply -f /home/dev/Argo-0/config/${yamlFile}`);
          }

          console.log(`${deployment} processed successfully: ${result}`);
          
          // Acknowledge the message
          channel.ack(msg);

          // Send result back (optional, depending on your architecture)
          // You could publish a response to a different queue or log the result

        } catch (error) {
          console.error('Error processing task:', error);
          channel.nack(msg, false, true); // Requeue the message in case of failure
        }
      }
    });
  });
});


