import {DocumentNode} from 'graphql';

export function decorate<T>(
  clazz: new (...args: any[]) => T,
  decorators: {
    [P in keyof T]?:
      | MethodDecorator
      | PropertyDecorator
      | Array<MethodDecorator>
      | Array<PropertyDecorator>
  },
): void;
export function decorate<T>(
  object: T,
  decorators: {
    [P in keyof T]?:
      | MethodDecorator
      | PropertyDecorator
      | Array<MethodDecorator>
      | Array<PropertyDecorator>
  },
): T;
export function decorate(thing: any, decorators: any) {
  const target = typeof thing === 'function' ? thing.prototype : thing;

  for (let prop in decorators) {
    let propertyDecorators = decorators[prop];
    if (!Array.isArray(propertyDecorators)) {
      propertyDecorators = [propertyDecorators];
    }
    const descriptor = Object.getOwnPropertyDescriptor(target, prop);
    const newDescriptor = propertyDecorators.reduce(
      (accDescriptor: any, decorator: any) =>
        decorator(target, prop, accDescriptor),
      descriptor,
    );
    if (newDescriptor) Object.defineProperty(target, prop, newDescriptor);
  }

  return thing;
}

export function getDisplayName(component: any): string {
  return component.displayName || component.name || 'Component';
}

export function isMutationType(doc: DocumentNode) {
  return doc.definitions.some(
    x => x.kind === 'OperationDefinition' && x.operation === 'mutation',
  );
}
