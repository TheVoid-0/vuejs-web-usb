// import { MilkspecDevice } from "../milkspec.device";

// /**
//  * METHOD DECORATOR
//  */
// export function Reset(): MethodDecorator {
//   return (
//     target: unknown,
//     propertyKey: string | symbol,
//     descriptor: PropertyDescriptor
//   ) => {
//     const originalMethod = descriptor.value as (...args: any[]) => any;

//     if (!(target instanceof MilkspecDevice)) {
//       throw new Error(
//         "Reset decorator can only be used on MilkspecDevice class"
//       );
//     }

//     if (typeof originalMethod !== "function") {
//       throw new Error(
//         `@Reset() can only be applied to methods, not: ${typeof originalMethod}`
//       );
//     }

//     descriptor.value = async function (...args: any[]) {
//       const originalMethodResult = originalMethod.call(target, args);
//       await target.resetDevice();
//       return originalMethodResult;
//     };

//     return descriptor;
//   };
// }
