

export default async function bootStrap() {
    let tls;
    try {
      tls = await import('node:tls');
    } catch (err) {
      console.error(`tls support is disabled! ${String(err)}`);
    }
}