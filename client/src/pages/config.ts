export type Configuration = {
  serverUrl: string;
};
 const configurations: { [env: string]: Configuration } ={
  development: {
    serverUrl: "http://localhost:4000",
  },
  production: {
    serverUrl: "",
  },
};
export default configurations[process.env.NODE_ENV || "development"];
