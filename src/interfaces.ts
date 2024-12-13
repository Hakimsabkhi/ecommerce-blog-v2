

declare namespace NodeJS {
  interface Global {
    mongoose: {
      conn: any;
      promise: Promise<any> | null;
    };
  }
}

export interface MongooseGlobal extends NodeJS.Global {
  mongoose: {
    conn: any;
    promise: Promise<typeof mongoose> | null;
  };
}


