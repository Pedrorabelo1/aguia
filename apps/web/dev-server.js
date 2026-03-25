// Launcher script for Next.js dev server
// Ensures npm/node are in PATH for Next.js auto-install features
process.env.PATH = `C:\\Program Files\\nodejs;C:\\Users\\pedro\\AppData\\Roaming\\npm;${process.env.PATH}`;

require("../../node_modules/.pnpm/next@14.2.35_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/bin/next");
