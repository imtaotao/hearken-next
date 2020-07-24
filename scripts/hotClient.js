if (window.name) {
  console.log(`Current ${window.name}`)
}

const ws = new window.WebSocket('ws://localhost:1234')

ws.onmessage = (e) => {
  if (e.data.startsWith('Rebuild:')) {
    window.location.reload(true)
    window.name = e.data
  }
}
