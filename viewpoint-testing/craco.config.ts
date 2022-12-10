import path from "path";
export default {
  webpack: {
    alias: {
      "@assets": path.resolve(__dirname, "src/assets"),
      "@components": path.resolve(__dirname, "src/components"),
      "@context": path.resolve(__dirname, "src/context"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@layouts": path.resolve(__dirname, "src/layouts"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@redux": path.resolve(__dirname, "src/redux"),
      "@routers": path.resolve(__dirname, "src/routers"),
      "@services": path.resolve(__dirname, "src/services"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@models": path.resolve(__dirname, "src/models"),
    },
  },
};
