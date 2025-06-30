const express = require('express');
const path = require('path'); // Add this line to import path
const { exec } = require('child_process');
const cors = require('cors');  // Add this line to import the CORS module
const app = express();
const port = 3535;
const axios = require('axios');


// Function to convert CPU and Memory formats
const convertCPU = (cpu) => (cpu.endsWith('m') ? parseInt(cpu.replace('m', ''), 10) / 1000 : parseFloat(cpu));
const convertMemory = (memory) => (memory.endsWith('Ki') ? parseInt(memory.replace('Ki', ''), 10) / 1024 : parseFloat(memory));


app.use(cors({
    origin: '*', // Allow all origins
}));

app.use(express.static(path.join(__dirname, 'build')));

// Variables to track deployment statuses
let semaphoreStatus = false;
let crmStatus = false;
let drawStatus = false;
let uptimeStatus = false;
let cloudflareStatus = false;
let dmsStatus = false;
let mongoStatus = false;

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

// --------- SEMAPHORE ROUTES ---------
app.get('/delete-semaphore', async (req, res) => {
  console.log('Received delete request for Semaphore');
  try {
    const result = await executeCommand('kubectl delete deployment semaphore');
    if (result.includes('not found')) {
      semaphoreStatus = false;
      return res.send('Semaphore deployment already deleted.');
    }
    semaphoreStatus = false;
    console.log('Semaphore deleted successfully');
    res.send('Semaphore deployment deleted successfully');
  } catch (error) {
    console.log('Error deleting Semaphore:', error);
    res.status(500).send('Failed to delete the Semaphore deployment');
  }
});

app.get('/apply-semaphore', async (req, res) => {
  console.log('Received create request for Semaphore');
  if (!semaphoreStatus) {
    try {
      const result = await executeCommand('kubectl apply -f /home/dev/Argo-0/Helm6/templates/semaphore.yaml');
      semaphoreStatus = true;
      console.log('Semaphore configuration applied successfully');
      res.send('Semaphore configuration applied successfully');
    } catch (error) {
      console.log('Error applying Semaphore:', error);
      res.status(500).send('Failed to apply the Semaphore configuration');
    }
  } else {
    res.send('Semaphore is already applied.');
  }
});

// --------- CRM ROUTES ---------
app.get('/delete-crm', async (req, res) => {
  console.log('Received delete request for CRM');
  try {
    const result = await executeCommand('kubectl delete deployment crm');
    if (result.includes('not found')) {
      crmStatus = false;
      return res.send('CRM deployment already deleted.');
    }
    crmStatus = false;
    console.log('CRM deleted successfully');
    res.send('CRM deployment deleted successfully');
  } catch (error) {
    console.log('Error deleting CRM:', error);
    res.status(500).send('Failed to delete the CRM deployment');
  }
});

app.get('/apply-crm', async (req, res) => {
  console.log('Received create request for CRM');
  if (!crmStatus) {
    try {
      const result = await executeCommand('kubectl apply -f /home/dev/Argo-0/Helm0/templates/crm.yaml');
      crmStatus = true;
      console.log('CRM configuration applied successfully');
      res.send('CRM configuration applied successfully');
    } catch (error) {
      console.log('Error applying CRM:', error);
      res.status(500).send('Failed to apply the CRM configuration');
    }
  } else {
    res.send('CRM is already applied.');
  }
});

// --------- DRAW ROUTES ---------
app.get('/delete-draw', async (req, res) => {
  console.log('Received delete request for Draw');
  try {
    const result = await executeCommand('kubectl delete deployment draw');
    if (result.includes('not found')) {
      drawStatus = false;
      return res.send('Draw deployment already deleted.');
    }
    drawStatus = false;
    console.log('Draw deleted successfully');
    res.send('Draw deployment deleted successfully');
  } catch (error) {
    console.log('Error deleting Draw:', error);
    res.status(500).send('Failed to delete the Draw deployment');
  }
});

app.get('/apply-draw', async (req, res) => {
  console.log('Received create request for Draw');
  if (!drawStatus) {
    try {
      const result = await executeCommand('kubectl apply -f /home/dev/Argo-0/Helm3/templates/draw.yaml');
      drawStatus = true;
      console.log('Draw configuration applied successfully');
      res.send('Draw configuration applied successfully');
    } catch (error) {
      console.log('Error applying Draw:', error);
      res.status(500).send('Failed to apply the Draw configuration');
    }
  } else {
    res.send('Draw is already applied.');
  }
});

// --------- UPTIME ROUTES ---------
app.get('/delete-uptime', async (req, res) => {
  console.log('Received delete request for Uptime');
  try {
    const result = await executeCommand('kubectl delete deployment uptime');
    if (result.includes('not found')) {
      uptimeStatus = false;
      return res.send('Uptime deployment already deleted.');
    }
    uptimeStatus = false;
    console.log('Uptime deleted successfully');
    res.send('Uptime deployment deleted successfully');
  } catch (error) {
    console.log('Error deleting Uptime:', error);
    res.status(500).send('Failed to delete the Uptime deployment');
  }
});

app.get('/apply-uptime', async (req, res) => {
  console.log('Received create request for Uptime');
  if (!uptimeStatus) {
    try {
      const result = await executeCommand('kubectl apply -f /home/dev/Argo-0/Helm4/templates/uptime.yaml');
      uptimeStatus = true;
      console.log('Uptime configuration applied successfully');
      res.send('Uptime configuration applied successfully');
    } catch (error) {
      console.log('Error applying Uptime:', error);
      res.status(500).send('Failed to apply the Uptime configuration');
    }
  } else {
    res.send('Uptime is already applied.');
  }
});

// --------- CLOUDFLARE ROUTES ---------
app.get('/delete-cloudflare', async (req, res) => {
  console.log('Received delete request for Cloudflare');
  try {
    const result = await executeCommand('kubectl delete deployment cloudflare');
    if (result.includes('not found')) {
      cloudflareStatus = false;
      return res.send('Cloudflare deployment already deleted.');
    }
    cloudflareStatus = false;
    console.log('Cloudflare deleted successfully');
    res.send('Cloudflare deployment deleted successfully');
  } catch (error) {
    console.log('Error deleting Cloudflare:', error);
    res.status(500).send('Failed to delete the Cloudflare deployment');
  }
});

app.get('/apply-cloudflare', async (req, res) => {
  console.log('Received create request for Cloudflare');
  if (!cloudflareStatus) {
    try {
      const result = await executeCommand('kubectl apply -f /home/dev/Argo-0/Helm5/templates/cloudflare.yaml');
      cloudflareStatus = true;
      console.log('Cloudflare configuration applied successfully');
      res.send('Cloudflare configuration applied successfully');
    } catch (error) {
      console.log('Error applying Cloudflare:', error);
      res.status(500).send('Failed to apply the Cloudflare configuration');
    }
  } else {
    res.send('Cloudflare is already applied.');
  }
});



// --------- DMS ROUTES ---------
app.get('/delete-dms', async (req, res) => {
  console.log('Received delete request for Dms');
  try {
    const result = await executeCommand('kubectl delete deployment dms');
    if (result.includes('not found')) {
      dmsStatus = false;
      return res.send('Dms deployment already deleted.');
    }
    dmsStatus = false;
    console.log('Dms deleted successfully');
    res.send('Dms deployment deleted successfully');
  } catch (error) {
    console.log('Error deleting Dms:', error);
    res.status(500).send('Failed to delete the Dms deployment');
  }
});

app.get('/apply-dms', async (req, res) => {
  console.log('Received create request for Dms');
  if (!dmsStatus) {
    try {
      const result = await executeCommand('kubectl apply -f /home/dev/Argo-0/Helm1/templates/dms.yaml');
      dmsStatus = true;
      console.log('Dms configuration applied successfully');
      res.send('Dms configuration applied successfully');
    } catch (error) {
      console.log('Error applying Dms:', error);
      res.status(500).send('Failed to apply the Dms configuration');
    }
  } else {
    res.send('Dms is already applied.');
  }
});


// --------- MONGO ROUTES ---------
app.get('/delete-mongo', async (req, res) => {
  console.log('Received delete request for Mongo');
  try {
    const result = await executeCommand('kubectl delete deployment mongo');
    if (result.includes('not found')) {
      mongoStatus = false;
      return res.send('Mongo deployment already deleted.');
    }
    mongoStatus = false;
    console.log('Mongo deleted successfully');
    res.send('Mongo deployment deleted successfully');
  } catch (error) {
    console.log('Error deleting Mongo:', error);
    res.status(500).send('Failed to delete the Mongo deployment');
  }
});

app.get('/apply-mongo', async (req, res) => {
  console.log('Received create request for Mongo');
  if (!mongoStatus) {
    try {
      const result = await executeCommand('kubectl apply -f /home/dev/Argo-0/Helm2/templates/mongodb.yaml');
      mongoStatus = true;
      console.log('Mongo configuration applied successfully');
      res.send('Mongo configuration applied successfully');
    } catch (error) {
      console.log('Error applying Mongo:', error);
      res.status(500).send('Failed to apply the Mongo configuration');
    }
  } else {
    res.send('Mongo is already applied.');
  }
});

// --------- STATUS ROUTES ---------
app.get('/status', (req, res) => {
  res.send({
    semaphore: semaphoreStatus ? 'Applied' : 'Deleted',
    crm: crmStatus ? 'Applied' : 'Deleted',
    draw: drawStatus ? 'Applied' : 'Deleted',
    uptime: uptimeStatus ? 'Applied' : 'Deleted',
    cloudflare: cloudflareStatus ? 'Applied' : 'Deleted',
    dms: dmsStatus ? 'Applied' : 'Deleted',
    mongo: mongoStatus ? 'Applied' : 'Deleted'
  });
});


app.get('/api/memory-usage', async (req, res) => {
  try {
    // Fetch Pod metrics
    const podMetrics = await axios.get('http://localhost:8001/apis/metrics.k8s.io/v1beta1/pods');
    const pods = podMetrics.data.items.map(pod => ({
      name: pod.metadata.name,
      memory: convertMemory(pod.containers[0].usage.memory),
    }));

    // Fetch Deployment resource requests & limits from API
    const deploymentResponse = await axios.get('http://localhost:8001/apis/apps/v1/namespaces/default/deployments');
    const deployments = deploymentResponse.data.items.map(deployment => {
      const name = deployment.metadata.name;
      const container = deployment.spec.template.spec.containers[0];

      return {
        name,
        requestedCpu: container.resources?.requests?.cpu || 'N/A',
        requestedMemory: container.resources?.requests?.memory || 'N/A',
        limitCpu: container.resources?.limits?.cpu || 'N/A',
        limitMemory: container.resources?.limits?.memory || 'N/A',
      };
    });

    res.json({ pods, deployments });
  } catch (error) {
    console.error('Error fetching Kubernetes metrics:', error.message);
    res.status(500).json({ error: 'Failed to fetch metrics data' });
  }
});






// Function to parse the node-exporter metrics into a structured format
const parseMetrics = (data) => {
    const metrics = {};
    const lines = data.split('\n');

    lines.forEach(line => {
        if (line.startsWith('#') || !line.trim()) {
            return; // Skip comments and empty lines
        }

        const [metric, value] = line.split(' ');
        if (metric && value) {
            metrics[metric] = parseFloat(value);
        }
    });

    return metrics;
};

// Endpoint to get memory usage from node-exporter metrics
app.get('/api/node-exporter-metrics', async (req, res) => {
    try {
        // Fetch node-exporter metrics
        const response = await axios.get('http://localhost:9100/metrics');
        const rawMetrics = response.data;

        // Parse the metrics into a structured object
        const metrics = parseMetrics(rawMetrics);

        // Send the parsed metrics as JSON
        res.json({
            memoryUsage: metrics['node_memory_MemTotal_bytes'] - metrics['node_memory_MemFree_bytes'],
            memoryTotal: metrics['node_memory_MemTotal_bytes'],
            cpuUsage: metrics['node_cpu_seconds_total'] || 0
        });
    } catch (error) {
        console.error('Error fetching node-exporter metrics:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});





// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});




//    const result = await axios.get('http://localhost:8001/api/v1/namespaces/default/pods');
