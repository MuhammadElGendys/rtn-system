async function loadLatest(){

// change always the URL to match your backend API endpoint
const res = await fetch("http://192.168.178.187:3000/api/latest")
const data = await res.json()

document.getElementById("pressure").textContent = data.pressure
document.getElementById("temperature").textContent = data.temperature
document.getElementById("speedRPM").textContent = data.speedRPM
document.getElementById("motorRun").textContent = data.motorRun ? "ON":"OFF"
document.getElementById("alarmActive").textContent = data.alarmActive ? "ACTIVE":"NORMAL"

}

async function loadHistory(){
    
    // change always the URL to match your backend API endpoint
const res = await fetch("http://192.168.178.187:3000/api/history?limit=10")
const rows = await res.json()

const table = document.getElementById("historyTable")
table.innerHTML=""

rows.forEach(r=>{

const tr = document.createElement("tr")

tr.innerHTML = `
<td>${r.id}</td>
<td>${r.pressure}</td>
<td>${r.temperature}</td>
<td>${r.speedRPM}</td>
<td>${r.motorRun ? "ON":"OFF"}</td>
<td>${r.alarmActive ? "ACTIVE":"NORMAL"}</td>
<td>${r.ts}</td>
`

table.appendChild(tr)

})

}

loadLatest()
loadHistory()

setInterval(loadLatest,1000)
setInterval(loadHistory,5000)