import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { cx } from "../../lib/reexports"

import * as styles from "./Navigation.module.css"

interface Props {
  name?: string
  url?: string
  Icon?: any
  iconSize?: number
  index?: boolean
  className?: string
  onClick?: () => void
}

const NavigationItem: React.FC<Props> = props => {
  const { url, onClick, name, Icon, iconSize, className } = props

  const router = useRouter()

  const classNames = cx(className, {
    [styles.itemActive]: url && router.pathname === url,
  })

  return (
    <li>
      {url && <NavigationItemLink {...props} className={classNames} />}
      {!url && !Icon && <a onClick={onClick}>{name}</a>}
      {!url && Icon && (
        <a onClick={onClick}>
          <Icon size={{ width: iconSize || 16, height: iconSize || 16 }} />
        </a>
      )}
    </li>
  )
}

const NavigationItemLink: React.FC<Props> = props => {
  const { name, url, index, Icon, iconSize, className } = props

  const router = useRouter()

  return Icon ? (
    <Link href={url!}>
      <a className={className}>
        {!name && Icon && (
          <Icon style={{ width: iconSize || 16, height: iconSize || 16 }} />
        )}
        {name && Icon && (
          <span className="flex items-center">
            <Icon
              className="mr-4 text-gray-600 fill-current"
              style={{ width: iconSize || 16, height: iconSize || 16 }}
            />
            <p>{name}</p>
          </span>
        )}
      </a>
    </Link>
  ) : (
    <Link href={url!}>
      <a className={className}>{name}</a>
    </Link>
  )
}

export default NavigationItem
