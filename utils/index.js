let getProcessEnv = (key) => {
  let value = null;
  if (process.env[key]) {
    value = process.env[key];
  } else {
    let argvs = process.argv.slice(2);
    argvs.forEach((argv) => {
      if (argv.startsWith(key + "=")) {
        value = argv.split("=")[1];
      }
    });
  }
  return value;
};

export default {};
