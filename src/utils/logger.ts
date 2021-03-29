import logdown from 'logdown'

export const getLogger = (title: string) => {
  const logger = logdown(`GNOSIS_AUCTION::${title}`)

  logger.state.isEnabled = true

  return logger
}
