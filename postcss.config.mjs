const scrubInvalidRules = () => ({
  postcssPlugin: "scrub-invalid-rules",
  Once(root) {
    root.walkRules((rule) => {
      if (/[^\x00-\x7F]/.test(rule.selector)) {
        rule.remove();
      }
    });
    root.walkDecls((decl) => {
      if (decl.prop === "-" || /[^\x00-\x7F]/.test(decl.prop)) {
        decl.remove();
      }
    });
  },
});
scrubInvalidRules.postcss = true;

const config = {
  plugins: ["@tailwindcss/postcss", scrubInvalidRules],
};

export default config;
