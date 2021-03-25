import numbro from 'numbro'

export const abbreviation = (value: string | number) => {
  const parseValue = numbro(value)

  if (parseValue && parseValue.value() !== undefined) {
    return parseValue.format({ spaceSeparated: false, average: true, mantissa: 2 })?.toUpperCase()
  }

  return value
}
