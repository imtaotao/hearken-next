// get static resource
export function get(url) {
  return new Promise(resolve => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.withCredentials = true
    xhr.responseType = 'arraybuffer'
    xhr.send()
    xhr.onload = e => {
      if (xhr.status === 200) {
        resolve(e.target.response)
      }
    }
  })
}
