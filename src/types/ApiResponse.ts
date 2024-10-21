import { Message } from "@/model/User.model"

export interface ApiResponse {
  success: Boolean
  message: string
  isAcceptingMessage?: Boolean
  messages?: Array<Message>
}
