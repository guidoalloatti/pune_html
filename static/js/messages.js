// This function adds a message to different textareas
function addMessage(message, id) {
  switch(id) {
    case "speed": 
      message = "Current speed is: " + message
      break
    case "rounds":
      message = "Current round is: " + message
      break
    case "longest":
      message = "Longest color: " + message
      break
    case "longest_size":
      message = "Longest size: " + message
      break
    default:
      message = "Wrong message type..."
      break
  }
  $("#"+id).text(message)
}