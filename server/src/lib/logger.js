function formatMeta(meta) {
  return meta && Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
}

function log(level, message, meta = {}) {
  console[level](`[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}${formatMeta(meta)}`);
}

module.exports = {
  info: (message, meta) => log("log", message, meta),
  error: (message, meta) => log("error", message, meta),
};
