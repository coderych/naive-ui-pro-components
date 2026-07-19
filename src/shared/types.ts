/**
 * Extract the props type from a Vue component type.
 */
export type ExtractProps<T> = T extends { $props: infer P } ? P : never

/**
 * Make specified keys optional.
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * Make specified keys required.
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

/**
 * Nullable type.
 */
export type Nullable<T> = T | null | undefined

/**
 * Any function type.
 */
export type AnyFunction = (...args: any[]) => any

/**
 * Component instance type helper.
 */
export type ComponentInstance<T> = T extends { new (): infer I } ? I : never

/**
 * Extract public props (excluding internal keys).
 */
export type ExtractPublicPropTypes<T extends Record<string, unknown>> = Omit<
  T,
  `internal${string}`
>
