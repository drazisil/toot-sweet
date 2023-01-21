

export default async function bootStrap() {
  try {
    await import('node:tls');
  } catch (err) {
    console.error(`tls support is disabled! ${String(err)}`);
  }
}
