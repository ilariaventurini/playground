export type Payment = {
  paymentMethod: string
  amount: number
  type: string
  location: string
  coordinates: [number, number]
  date: string
}

export async function fetchPaymentDataset(): Promise<Payment[]> {
  const res = await fetch('/mockDataset.json')
  return res.json()
}
