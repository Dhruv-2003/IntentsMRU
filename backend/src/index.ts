// import express, { Request, Response } from "express";

import axios from "axios";

// const app = express();
// app.use(express.json());

const endpointUrl = "https://example.com/your-endpoint";

function pollEndpoint() {
  // get the rollup state
  // check for new requests which haven't been fulfilled
  // If a request is found , send one to the solver in Next API
  //   console.log("hello");
  //   axios
  //     .get(endpointUrl)
  //     .then((response) => {
  //       // Process the response or trigger actions based on the new requests
  //       console.log("Response:", response.data);
  //       // You can perform your desired logic here
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //     });
}

// Poll the endpoint every 5 minutes (300,000 milliseconds)
function main() {
  try {
    const interval = setInterval(pollEndpoint, 5000);
  } catch (error) {
    console.log(error);
  }
}

main();
