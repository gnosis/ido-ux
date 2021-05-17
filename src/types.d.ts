declare type Maybe<T> = T | null
declare module 'react-copy-to-clipboard'
declare module '*.woff2'
declare module '*.otf'
declare module './theme'
declare module "*.md"

function isTimeout(timeId: NodeJS.Timeout | undefined): timeId is NodeJS.Timeout {
    return typeof timeId !== 'undefined'
}