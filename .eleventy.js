module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy("src/js");
  // CNAME vive en la raiz del repo, fuera de src/, asi que hay que copiarlo
  // explicitamente o el artefacto desplegado se queda sin dominio propio.
  eleventyConfig.addPassthroughCopy({ "CNAME": "CNAME" });

  // security.txt tiene que quedar en /.well-known/ segun el RFC 9116, y una
  // carpeta que empieza con punto es incomoda de mantener en el repositorio.
  eleventyConfig.addPassthroughCopy({ "src/security.txt": ".well-known/security.txt" });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    }
  };
};
