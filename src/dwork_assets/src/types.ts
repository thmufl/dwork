export type CalendarEntryAdapter = {
  id: number,
  creator: string,
  user: string,
  title: string,
  description: string,
  date: {
    begin: string,
    end: string
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