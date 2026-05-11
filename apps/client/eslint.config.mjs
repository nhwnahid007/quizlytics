import nextConfig from "eslint-config-next";

export default [
  ...nextConfig,
  {
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off",
      "react-hooks/refs": "off",
      "import/no-anonymous-default-export": "off",
      "react/no-unescaped-entities": "off",
    },
  },
];
