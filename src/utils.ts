const os = require('os')

export const getIPAddresses = () => {
  const interfaces = os.networkInterfaces()
  const ipAddresses: any[] = []
  for (var deviceName in interfaces) {
    var addresses = interfaces[deviceName];
    for (var i = 0; i < addresses.length; i++) {
      var addressInfo = addresses[i];
      if (addressInfo.family === "IPv4" && !addressInfo.internal) {
          ipAddresses.push(addressInfo.address);
      }
    }
  }

  return ipAddresses;
}