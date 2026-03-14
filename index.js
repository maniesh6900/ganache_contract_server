const express = require("express");
const  { ethers } =  require("ethers");
const dotenv = require("dotenv");
const Abi = require("./abi/Counter.json"); 

dotenv.config({
    path: ['.env.local', '.env'],
});
const app = express();
app.use(express.json());

const provider = new ethers.JsonRpcProvider(process.env.GANACHE_RPC);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  Abi.abi,
  wallet,
);

app.post("/pay", async (req, res) => {
  console.log(req.body.address);
  const tx = await contract.pay({
    value : 10000n
  }); 
  await tx.wait();
  if(!tx) {
    res.status(401);
  }
  console.log("value: ",  tx.value.toString());
  console.log("from: ",tx.from.toString());
  res.json({ hash: tx.hash, msg : "payment successful", success: true });
});

app.get("/finish", async (req, res) => {
  const tx = await contract.release(); 
  await tx.wait();
  console.log("value: ",  tx.value.toString());
  console.log("from: ",tx.from.toString());
  res.json({ hash: tx.hash, msg : "finished payment successful", success: true });
});

app.get("/refund", async (req, res) => {
  const tx = await contract.refund(); 
  await tx.wait();
  console.log("value: ",  tx.value.toString());
  console.log("from: ",tx.from.toString());
  res.json({ hash: tx.hash, msg : "refund successful", success: true });
});

app.get("/pay", async(req, res)=> {
   res.json({ msg : "payment successful", success: true });
})

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});