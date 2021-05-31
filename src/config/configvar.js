const IPFS_URL = process.env.NODE_ENV === "production" ? "https://gateway.ipfs.io/ipfs/" : "https://gateway.ipfs.io/ipfs/"
const CONTRACT_NAME = process.env.NODE_ENV === "production" ? "dev-1622468158083-85931757466999" : "dev-1622468158083-85931757466999"
export { IPFS_URL, CONTRACT_NAME }