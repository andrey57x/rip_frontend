// модели TypeScript

export type Reaction = {
  id: number
  title: string
  reagent: string
  product: string
  conversation_factor: number
  img_link?: string | null
  description?: string
}
