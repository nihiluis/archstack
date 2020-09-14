import * as React from "react"

import * as messageStyle from "../../../style/message.module.scss"
import { cx } from "../../../lib/reexports"
import { NotificationMessage } from "../../../redux/message"

interface Props {
  data: NotificationMessage
  idx: number
}

const NotificationMessageItem: React.FC<Props> = props => (
  <div
    key={`nmi-div-${props.idx}`}
    className={cx(messageStyle.notificationMessage, {
      [messageStyle.warn]: props.data.type === "WARN",
      [messageStyle.error]: props.data.type === "ERROR",
      [messageStyle.info]: props.data.type === "INFO",
    })}>
    <p key={`nmi-item-${props.idx}`}>{props.data.text}</p>
  </div>
)

export default NotificationMessageItem
