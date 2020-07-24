const ws = new window.WebSocket('ws://localhost:1234')

ws.onmessage = (e) => {
  if (e.data === 'reload client') {
    window.location.reload(true)
  }
}
