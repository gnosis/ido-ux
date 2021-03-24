import numeral from 'numeral'

export const abbreviation = (value: string | number) => {
  const parseValue = numeral(value)

  if (parseValue.value() !== null) {
    return parseValue.format('0.00a').toUpperCase()
  }

  return value
}
