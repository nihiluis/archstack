import { createAction, handleActions } from "redux-actions"
import { take, takeEvery, put, delay } from "redux-saga/effects"

import { NOTIFICATION_MESSAGE_REMOVE_DELAY } from "../../constants/env";

export interface NotificationMessageState {
  data: NotificationMessage[]
}

export interface NotificationMessage {
  text: string
  type: NotificationMessageType
}

export type NotificationMessageType = "INFO" | "WARN" | "ERROR"

const initialState: NotificationMessageState = {
  data: []
}

const actionNames = {
  NOTIFICATION_MESSAGE_INFO: "NOTIFICATION_MESSAGE_INFO",
  NOTIFICATION_MESSAGE_WARN: "NOTIFICATION_MESSAGE_WARN",
  NOTIFICATION_MESSAGE_ERROR: "NOTIFICATION_MESSAGE_ERROR",
  NOTIFICATION_MESSAGE_POP: "NOTIFICATION_MESSAGE_POP",
}

const actions = {
  info: createAction<string>(actionNames.NOTIFICATION_MESSAGE_INFO),
  warn: createAction<string>(actionNames.NOTIFICATION_MESSAGE_WARN),
  error: createAction<string>(actionNames.NOTIFICATION_MESSAGE_ERROR),
  pop: createAction<{}>(actionNames.NOTIFICATION_MESSAGE_POP),
}

export const NotificationMessageActions = actions

// the setTimeout is very unclean, but should suffice for now.
export const notificationMessageReducer = handleActions<NotificationMessageState, NotificationMessageState>({
  [actionNames.NOTIFICATION_MESSAGE_INFO]: (state, action) => {
    const data: NotificationMessage[] = state.data
    const newData = [{ type: "INFO", text: action.payload }, ...data]

    return {
      data: newData
    }
  },
  [actionNames.NOTIFICATION_MESSAGE_WARN]: (state, action) => {
    const data: NotificationMessage[] = state.data
    const newData = [{ type: "WARN", text: action.payload }, ...data]

    return {
      data: newData
    }
  },
  [actionNames.NOTIFICATION_MESSAGE_ERROR]: (state, action) => {
    const data: NotificationMessage[] = state.data
    const newData = [{ type: "ERROR", text: action.payload }, ...data]

    return {
      data: newData
    }
  },
  [actionNames.NOTIFICATION_MESSAGE_POP]: (state) => {
    const data: NotificationMessage[] = state.data

    return {
      data: data.length > 0 ? data.slice(0, data.length - 1) : []
    }
  },
}, initialState)

export function* handleNotificationMessageError() {
  yield delay(NOTIFICATION_MESSAGE_REMOVE_DELAY)
  yield put(actions.pop({}))
}

export function* handleNotificationMessageInfo() {
  yield delay(NOTIFICATION_MESSAGE_REMOVE_DELAY)
  yield put(actions.pop({}))
}

export function* handleNotificationMessageWarn() {
  yield delay(NOTIFICATION_MESSAGE_REMOVE_DELAY)
  yield put(actions.pop({}))
}

export function* watchHandleNotificationMessageError() {
  yield takeEvery(actions.error, handleNotificationMessageError)
}

export function* watchHandleNotificationMessageInfo() {
  yield takeEvery(actions.info, handleNotificationMessageInfo)
}

export function* watchHandleNotificationMessageWarn() {
  yield takeEvery(actions.warn, handleNotificationMessageWarn)
}
