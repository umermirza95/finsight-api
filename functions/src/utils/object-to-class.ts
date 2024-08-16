export function objectToClass<T>(mapperClass: T, data:any) : T {
  for (const key in mapperClass) {
    if (data[key]) {
      mapperClass[key] = data[key];
    }
  }
  return mapperClass;
}
