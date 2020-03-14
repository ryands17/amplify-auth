export const createConfig = <U>() => <T extends { [name: string]: U }>(
  config: T
) => config
