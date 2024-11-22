// This file provides browser-compatible alternatives for Node.js modules

export const fs = {
  // Add any fs methods you need here
  readFileSync: () => {
    throw new Error('fs.readFileSync is not available in the browser')
  },
  writeFileSync: () => {
    throw new Error('fs.writeFileSync is not available in the browser')
  },
}

export const net = {
  // Add any net methods you need here
  connect: () => {
    throw new Error('net.connect is not available in the browser')
  },
}

export const tls = {
  // Add any tls methods you need here
  connect: () => {
    throw new Error('tls.connect is not available in the browser')
  },
}
