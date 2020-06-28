// Get static resource
export function get(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.withCredentials = true
    xhr.responseType = 'arraybuffer'
    xhr.send()
    xhr.onerror = reject
    xhr.onload = e => {
      if (xhr.status === 200) {
        resolve(e.target.response)
      }
    }
  })
}
