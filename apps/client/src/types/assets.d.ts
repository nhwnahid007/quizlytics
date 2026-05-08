declare module "*.css";

declare module "aos" {
  export function init(options?: Record<string, unknown>): void;

  const AOS: {
    init: typeof init;
  };

  export default AOS;
}
