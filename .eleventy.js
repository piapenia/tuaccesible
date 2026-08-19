module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/img");
  // CNAME vive en la raiz del repo, fuera de src/, asi que hay que copiarlo
  // explicitamente o el artefacto desplegado se queda sin dominio propio.
  eleventyConfig.addPassthroughCopy({ "CNAME": "CNAME" });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    }
  };
};
