export class ContextFormatter {
     private currentObject: Record<string, unknown>;
     constructor(obj: Record<string, unknown>) {
          this.currentObject = obj;
     }

     Format() {
          this.currentObject = ContextFormatter.Format(this.currentObject);
          return this;
     }
     SwapKeys(replace: Record<string, string>) {
          this.currentObject = ContextFormatter.SwapKeys(
               this.currentObject,
               replace,
          );
          return this;
     }
     static SwapKeys<T extends Record<string, unknown> | undefined>(
          sourceObject: T,
          keyValueMap: { [t in keyof T | string]?: string },
     ) {
          if (!sourceObject) return {};

          //sellerId: 'products.sellerId'
          //
          //
          for (const k in keyValueMap) {
               if (!(k in sourceObject)) continue;
               const replacementExists = keyValueMap[k];
               if (replacementExists) {
                    //@ts-expect-error haha cool
                    sourceObject[replacementExists as keyof typeof sourceObject] =
                         //@ts-expect-error haha cool
                         sourceObject[k as keyof typeof sourceObject];
                    //@ts-expect-error haha cool
                    delete sourceObject[k as keyof typeof sourceObject];
               }
          }

          return sourceObject;
     }
     SwapValues(replace: Record<string, string>) {
          this.currentObject = ContextFormatter.SwapValues(
               this.currentObject,
               replace,
          );
          return this;
     }
     Build() {
          return this.currentObject;
     }
     static Format(
          query: qs.ParsedQs | URLSearchParams | null | undefined | object,
     ) {
          if (!query || query.toString() === '') return {};

          const paramObj: Record<string, unknown> = {};

          if (query instanceof URLSearchParams) {
               for (const [key] of query) {
                    if (query.getAll(key).length > 1) {
                         paramObj[key] = query.getAll(key);
                         continue;
                    }
                    paramObj[key] = query.get(key);
               }
               return paramObj;
          }

          const keys = Object.keys(query);
          for (let i = 0; i < keys.length; i++) {
               const key = keys[i];
               if (!key) continue;
               paramObj[key] = query[key as keyof typeof query];
          }
          return paramObj;
     }

     private static SwapInArr(
          value: unknown[],
          key: unknown,
          replaceWith: unknown,
     ) {
          const idx = value.indexOf(key);
          if (idx === -1) return;
          value[idx] = replaceWith;
     }
     static SwapValues<T extends Record<keyof T, unknown>>(
          sourceObject: T,
          keyValueMap: { [t in keyof T | string]?: string },
     ) {
          for (const replacementKey in keyValueMap) {
               for (const property in sourceObject) {
                    if (!sourceObject) continue;
                    const propertyValue = sourceObject[property];
                    if (Array.isArray(propertyValue)) {
                         ContextFormatter.SwapInArr(
                              propertyValue,
                              replacementKey,
                              keyValueMap[replacementKey],
                         );
                    }
                    if (
                         sourceObject[property] !== replacementKey ||
                         !keyValueMap[replacementKey]
                    ) {
                         continue;
                    }
                    const replacementExists = keyValueMap[replacementKey];
                    if (replacementExists) {
                         //@ts-expect-error haha cool
                         sourceObject[property] = replacementExists;
                    }
               }
          }

          return sourceObject;
     }
}
