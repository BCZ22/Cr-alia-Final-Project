function readPackage(pkg) {
  // Allow all build scripts to run
  pkg.scripts = pkg.scripts || {};
  for (const script of ['preinstall', 'install', 'postinstall']) {
    if (pkg.scripts[script]) {
      pkg.scripts[script] = pkg.scripts[script].replace('pnpm run', 'npm run');
    }
  }
  return pkg;
}

module.exports = {
  hooks: {
    readPackage
  }
};
