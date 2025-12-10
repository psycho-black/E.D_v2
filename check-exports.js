const ReactExtension = require('@21st-extension/react');

console.log('Type of exports:', typeof ReactExtension);
console.log('Exports keys:', Object.keys(ReactExtension));
if (ReactExtension.ReactPlugin) {
  console.log('Type of ReactPlugin:', typeof ReactExtension.ReactPlugin);
  console.log('ReactPlugin value:', ReactExtension.ReactPlugin);
} else {
  console.log('ReactPlugin is undefined');
}
