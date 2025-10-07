import ip from "ip";

export function isPrivateIp(ipAddress) {
  try {
    const normalizedIp = ip.isV6Format(ipAddress)
      ? ip.toString(ip.toBuffer(ipAddress))
      : ipAddress;

    if (ip.isLoopback(normalizedIp)) {
      return {
        valid: false,
        error: "Loopback addresses are not allowed",
      };
    }

    if (ip.isPrivate(normalizedIp)) {
      return {
        valid: false,
        error: "Private IP addresses are not allowed",
      };
    }

    if (ip.isV4Format(normalizedIp)) {
      const parts = normalizedIp.split(".").map(Number);
      if (parts[0] === 169 && parts[1] === 254) {
        return {
          valid: false,
          error: "Link-local addresses are not allowed",
        };
      }
    } else if (ip.isV6Format(normalizedIp)) {
      const buffer = ip.toBuffer(normalizedIp);
      if (buffer[0] === 0xfe && buffer[1] === 0x80) {
        return {
          valid: false,
          error: "Link-local addresses are not allowed",
        };
      }
    }

    const blockedIps = [
      "169.254.169.254", // AWS/Azure
      "fd00:ec2::254", // AWS IPv6
    ];

    if (blockedIps.includes(normalizedIp)) {
      return {
        valid: false,
        error: "This IP is blocked for security reasons",
      };
    }

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: "Invalid IP address format",
    };
  }
}

export function checkJsonComplexity(obj, maxDepth = 20, maxKeys = 1000) {
  let keyCount = 0;

  function traverse(value, currentDepth) {
    if (currentDepth > maxDepth) {
      throw new Error(`JSON too deeply nested (max depth: ${maxDepth})`);
    }

    if (typeof value === "object" && value !== null) {
      const keys = Object.keys(value);
      keyCount += keys.length;

      if (keyCount > maxKeys) {
        throw new Error(`JSON too complex (max ${maxKeys} keys)`);
      }

      for (const key of keys) {
        traverse(value[key], currentDepth + 1);
      }
    }
  }

  try {
    traverse(obj, 0);
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: error.message,
    };
  }
}
