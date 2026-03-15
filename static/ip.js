fetch("https://api.ipify.org?format=json")
.then(res => res.json())
.then(data => {
    document.getElementById("ip").value = data.ip
})