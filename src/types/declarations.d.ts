declare module 'drizzle';
declare module 'drizzle-react';
declare module 'drizzle-react-components';

declare module '*.json';

declare module 'loadable-components/server';
declare module 'express-manifest-helpers';
declare module 'cors';

declare module '*.css' {
  interface IClassNames {
    [className: string]: string;
  }
  const classNames: IClassNames;
  export = classNames;
}

declare module '*.less' {
  interface IClassNames {
    [className: string]: string;
  }
  const classNames: IClassNames;
  export = classNames;
}

declare module '*.svg' {
  const content: any;
  export default content;
}
