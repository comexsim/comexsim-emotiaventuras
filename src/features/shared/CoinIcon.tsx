/** Moneda dibujada con CSS: el emoji de moneda no existe en Windows 10. */
export function CoinIcon({ large = false }: { large?: boolean }) {
  return <span className={large ? "coin large" : "coin"} aria-hidden="true" />;
}
