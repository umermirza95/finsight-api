export default interface FSICurrencyConverter{
    convert: (amount: number, convertFrom: string, date: Date) => Promise<number>
}
