window.onload = async () => {
    // Get public IP from a service
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipResponse.json();
    const clientIP = ipData.ip;

    // Send it to Flask
    fetch('/log_ip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip: clientIP })
    });
};