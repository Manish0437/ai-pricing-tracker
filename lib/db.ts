import { config } from "dotenv"
config({ path: ".env.local" })

import mongoose from "mongoose"

const MONGODB_URL = process.env.MONGODB_URL

if (!MONGODB_URL) {
  throw new Error("Missing MONGODB_URL in .env.local")
}

let isConnected = false

export async function connectDB(): Promise<void> {
  if (isConnected) return

  try {
    await mongoose.connect(MONGODB_URL as string)
    isConnected = true
    console.log("✓ MongoDB connected")
  } catch (error) {
    console.error("✗ MongoDB connection failed:", error)
    throw error
  }
}

export async function disconnectDB(): Promise<void> {
  if (!isConnected) return
  await mongoose.disconnect()
  isConnected = false
  console.log("✓ MongoDB disconnected")
}