import * as React from "react"
import cx from "classnames"

import * as style from "./style.module.css"

export type TabItem = string

interface TabMenuProps {
  items: TabItem[]
  activeIndex: number
  onClick: (index: number) => void
  className?: string
  itemClassName?: string
}

interface TabItemProps {
  name: string
  active: boolean
  className?: string
  index: number
  onClick: (index: number) => void
}

interface TabProps {
  currentTab: number
  showWhenTab: number
  className?: string
}

interface TabContainerProps {
  className?: string
}

const TabMenu: React.FC<TabMenuProps> = props => {
  const classes = cx("flex", style.tabMenu, props.className)

  return (
    <ul className={classes}>
      {props.items.map((itemName, index) => (
        <TabItem
          key={`tab-item-${itemName}`}
          name={itemName}
          active={props.activeIndex === index}
          className={props.itemClassName}
          index={index}
          onClick={props.onClick}
        />
      ))}
    </ul>
  )
}

const TabItem: React.FC<TabItemProps> = props => {
  const classes = cx(style.tabMenuItem, props.className, { active: props.active })

  return (
    <li key={`tab-item-${props.name}-li`} className={classes}>
      <a
        key={`tab-item-${props.name}-a`}
        onClick={() => props.onClick(props.index)}>
        {props.name}
      </a>
    </li>
  )
}

const Tab: React.FC<TabProps> = props => {
  const classes = cx(props.className)

  return props.currentTab === props.showWhenTab ? (
    <div className={classes}>{props.children}</div>
  ) : null
}

const TabContainer: React.FC<TabContainerProps> = props => {
  const classes = cx(style.tabContainer, props.className)

  return <div className={classes}>{props.children}</div>
}

export { TabMenu, Tab, TabContainer }
