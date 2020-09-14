import * as React from "react"
import {
  NotificationMessageActions,
  NotificationMessage,
} from "../../../redux/message"
import { RootState } from "../../../redux"
import { Dispatch, bindActionCreators } from "redux"

import * as messageStyle from "../../../style/message.module.scss"
import NotificationMessageItem from "./NotificationMessageItem"
import { connect } from "react-redux"

interface Props {
  all: NotificationMessage[]
  notificationMessageActions?: typeof NotificationMessageActions
}

class NotificationMessageContainer extends React.Component<Props> {
  render(): JSX.Element {
    const { all } = this.props

    return (
      <div className={messageStyle.notificationMessageContainer}>
        {all.map((notificationMessage, idx) => (
          <NotificationMessageItem
            key={`nmi-${idx}`}
            idx={idx}
            data={notificationMessage}
          />
        ))}
      </div>
    )
  }
}

function mapStateToProps(state: RootState): Partial<Props> {
  return {
    all: state.notificationMessage.data,
  }
}

function mapDispatchToProps(dispatch: Dispatch<any>): Partial<Props> {
  return {
    notificationMessageActions: bindActionCreators(
      NotificationMessageActions,
      dispatch
    ),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationMessageContainer)
