import { ProfileInfo } from '../../declarations/market/market.did'

export type CalendarEntryAdapter = {
  id: number,
  creator: string,
  user: string,
  title: string,
  description: string,
  date: {
    begin: Date | string | undefined,
    end: Date | string | undefined
  },
  place: string,
  status: string,
  link: string
}

export type ContractAdapter = {
  id: number,
  contractor: string,
  contractee: string,
  title: string,
  description: string,
  date: {
    begin: string,
    end: string
  },
  place: string,
  link: string,
}