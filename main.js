
const speedTest = require('speedtest-net');
const cron = require('node-cron');
const createCSVWriter = require('csv-writer').createObjectCsvWriter;

function convertBytesToMegabytes(bytes) {
  return (bytes/1024)/1024;
}

async function measure() {
  const result = await speedTest({ 
    acceptLicense: true,
    acceptGdpr: true
  });

  const { 
    download: { bytes },
    timestamp 
  } = result;

  return {
    megabytes: convertBytesToMegabytes(bytes),
    timestamp
  }
}

cron.schedule('* * * * *', async () => {
  const { megabytes, timestamp } = await measure();

  const csvWriter = createCSVWriter({
    path: 'data.csv',
    header: [
      {
        id: 'megabytes', title: 'MEGABYTES',
      },
      {
        id: 'timestamp', title: 'DATA/HORÁRIO',
      }
    ],
    append: true,
  });

  await csvWriter.writeRecords([
    { 
      megabytes,
      timestamp: new Date(timestamp).toISOString()
    }
  ]);

  console.log(`MB: ${megabytes}, Timestamp: ${timestamp}`);
});