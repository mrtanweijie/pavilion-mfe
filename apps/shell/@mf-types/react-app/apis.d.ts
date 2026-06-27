
    export type RemoteKeys = 'react-app/main';
    type PackageType<T> = T extends 'react-app/main' ? typeof import('react-app/main') :any;