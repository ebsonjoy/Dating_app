declare module '*.jpg' {
    const value: string;
    export default value;
  }
  
  declare module '*.jpeg' {
    const value: string;
    export default value;
  }
  
  declare module '*.png' {
    const value: string;
    export default value;
  }
  
  declare module '*.svg' {
    const value: string;
    export default value;
  }
  
  interface ImportMetaEnv {
    VITE_AWS_BUCKET_NAME: string;
    VITE_AWS_REGION: string;

  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }