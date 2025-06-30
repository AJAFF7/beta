const express = require('express');
const path = require('path');
const { exec, execSync } = require('child_process');
const cors = require('cors');
const axios = require('axios');

const ps = require("ps-node");

//const winston = require('winston');



const app = express();
const port = 3535;

// Convert CPU and Memory values to proper numbers
const convertCPU = (cpu) => {
  if (!cpu) return 0;
  return cpu.endsWith('m') ? parseInt(cpu.replace('m', ''), 10) / 1000 : parseFloat(cpu);
};

const convertMemory = (memory) => {
  if (!memory) return 0;
  return memory.endsWith('Ki') ? parseInt(memory.replace('Ki', ''), 10) / 1024 : parseFloat(memory);
};

app.use(express.json());
app.use(cors({ origin: '*' }));
app.use(express.static(path.join(__dirname, 'build')));

// Variables to track deployment statuses
let podStatuses = {
  semaphore: false,
  crm: false,
  draw: false,
  uptime: false,
  cloudflare: false,
  dms: false,
  mongo: false,
  nodex: false,
  prometheus: false
};

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

// In-memory log storage
let logs = [];

// Log startup messages
logs.push("Server is running on port 3535");
//logs.push("kubectl proxy 8001");

// Function to get logs
const getLogs = () => {
  return logs.join("\n");
};

// Handle DELETE deployment
const handleDelete = async (deployment, statusKey) => {
  console.log(`Attempting to delete deployment: ${deployment}`);
  try {
    const result = await executeCommand(`kubectl delete deployment ${deployment}`);
    logs.push(`${deployment} deployment deleted successfully`);
    if (result.includes('not found')) {
      podStatuses[statusKey] = false;
      logs.push(`${deployment} deployment already deleted`);
      return `${deployment} deployment already deleted`;
    }
    podStatuses[statusKey] = false;
    return `${deployment} deployment deleted successfully`;
  } catch (error) {
    logs.push(`Failed to delete ${deployment} deployment: ${error}`);
    throw new Error(`Failed to delete ${deployment} deployment: ${error}`);
  }
};

// Handle APPLY deployment
const handleApply = async (deployment, statusKey, yamlFile) => {
  console.log(`Attempting to apply configuration for deployment: ${deployment}`);
  if (!podStatuses[statusKey]) {
    try {
      const result = await executeCommand(`kubectl apply -f /home/dev/Argo-0/config/${yamlFile}`);
      podStatuses[statusKey] = true;
      logs.push(`${deployment} configuration applied successfully`);
      return `${deployment} configuration applied successfully`;
    } catch (error) {
      logs.push(`Failed to apply ${deployment} configuration: ${error}`);
      throw new Error(`Failed to apply ${deployment} configuration: ${error}`);
    }
  } else {
    logs.push(`${deployment} is already applied`);
    return `${deployment} is already applied`;
  }
};

// Logs API endpoint
app.get('/logs', (req, res) => {
  res.json({ logs: getLogs() });
});


// Endpoint to clear logs
app.post('/clear-logs', (req, res) => {
  logs = [];  // Clear the logs array
  console.log("Logs cleared");  // Optional: Log a message on the server side for debugging
  res.send({ message: 'Logs cleared successfully' });
});



// Generic routes for deployments
const createRoutes = (deployment, yamlFile) => {
  const statusKey = deployment.toLowerCase();
  app.get(`/delete-${statusKey}`, async (req, res) => {
    try {
      const result = await handleDelete(deployment, statusKey);
      res.send(result);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  app.get(`/apply-${statusKey}`, async (req, res) => {
    try {
      const result = await handleApply(deployment, statusKey, yamlFile);
      res.send(result);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
};

// Creating routes for each deployment
createRoutes('semaphore', 'semaphore.yaml');
createRoutes('crm', 'crm.yaml');
createRoutes('draw', 'draw.yaml');
createRoutes('uptime', 'uptime.yaml');
createRoutes('cloudflare', 'cloudflare.yaml');
createRoutes('dms', 'dms.yaml');
createRoutes('mongo', 'mongo.yaml');
createRoutes('nodex', 'nodex.yaml');
createRoutes('prometheus', 'prometheus.yaml');

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




const YAML_DIR = "/home/dev/Argo-0/config";

// API to open a YAML file
app.post("/open-file", (req, res) => {
  const { serviceName } = req.body;

  if (!serviceName) {
    return res.status(400).send("Service name is required");
  }

  // Construct full file path
  const filePath = path.join(YAML_DIR, `${serviceName}.yaml`);

  // Open the file with the default text editor (xdg-open for Linux)
  exec(`xdg-open "${filePath}"`, (err) => {
    if (err) {
      console.error("Error opening file:", err);
      return res.status(500).send(`Failed to open ${serviceName}.yaml`);
    }
    res.send(`${serviceName}.yaml opened successfully`);
  });
});





let kubectlProcess = null;



// Start kubectl proxy
app.post('/start-proxy', (req, res) => {
  if (kubectlProcess) {
    console.log('kubectl proxy is already running');
    return res.status(400).send('kubectl proxy is already running');
  }

  console.log('Starting kubectl proxy...');
  kubectlProcess = exec('kubectl proxy');

  kubectlProcess.stdout.on('data', (data) => {
    console.log('stdout:', data.toString());
  });

  kubectlProcess.stderr.on('data', (data) => {
    console.error('stderr:', data.toString());
  });

  kubectlProcess.on('close', (code) => {
    console.log(`kubectl proxy stopped with code ${code}`);
    kubectlProcess = null;
  });

  kubectlProcess.on('error', (err) => {
    console.error('Failed to start kubectl proxy:', err);
  });

  res.send('kubectl proxy started');
});

// Stop kubectl proxy
app.post('/stop-proxy', (req, res) => {
  if (!kubectlProcess) {
    console.log('kubectl proxy is not running');
    return res.status(400).send('kubectl proxy is not running');
  }

  console.log('Stopping kubectl proxy...');
  kubectlProcess.kill();
  res.send('kubectl proxy stopped');
});




app.get("/dmslogs", (req, res) => {
  const command = "kubectl logs -l app=dms-app -n default";

  exec(command, (err, stdout, stderr) => {
    if (err) {
      res.status(500).send("Error fetching logs.");
      return;
    }

    if (stderr) {
      res.status(500).send("Error fetching logs.");
      return;
    }

    res.send(stdout);
  });
});


app.get("/clearlogs", (req, res) => {
  // Send the default message to show after clearing logs
  const defaultMessage = "Server running on port: 8282";   //\nDB Connected....
  res.send(defaultMessage);  // Send the default message after clearing logs
});


// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
